import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";
import axios from "axios";
import {
  upperCaseFirstLetter,
  scrollTo,
  sizeGridColumnsToFit,
  updateGridHorizontalScrolling,
  gridDataExportParams,
  downloadData,
  parseHistoryLocationPathname
} from "~/utils/utils";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import { setAllData } from "~/data/actions/resultsAction";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { NumericCellRenderer } from "../NumericCellRenderer";
import { StatsToolPanel } from "../StatsToolPanel/StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";

const frameworkComponents = {
  numericCellRenderer: NumericCellRenderer,
  statsToolPanel: StatsToolPanel,
  taxonomyFilter: TaxonomyFilter
};

const sideBar = {
  toolPanels: [
    {
      id: "columns",
      labelDefault: "Columns",
      labelKey: "columns",
      iconKey: "columns",
      toolPanel: "agColumnsToolPanel",
      toolPanelParams: {
        suppressRowGroups: true,
        suppressValues: true,
        suppressPivots: true,
        suppressPivotMode: true,
        suppressSideButtons: false,
        suppressColumnFilter: true,
        suppressColumnSelectAll: true,
        suppressColumnExpandAll: true
      }
    },
    {
      id: "filters",
      labelDefault: "Filters",
      labelKey: "filters",
      iconKey: "filter",
      toolPanel: "agFiltersToolPanel",
      toolPanelParams: {
        suppressFilterSearch: true,
        suppressExpandAll: true
      }
    },
    {
      id: "stats",
      labelDefault: "Stats",
      labelKey: "chart",
      iconKey: "chart",
      toolPanel: "statsToolPanel",
      toolPanelParams: {
        col: "abundance"
      }
    }
  ],
  position: "left",
  defaultToolPanel: "filters",
  hiddenByDefault: false
};

const defaultColDef = {
  minWidth: 100,
  filter: "agTextColumnFilter",
  sortable: true,
  resizable: true,
  suppressMenu: true
};

const columnDefs = [
  {
    headerName: "Abundance",
    field: "abundance",
    cellRenderer: "numericCellRenderer",
    type: "numericColumn",
    filter: "agNumberColumnFilter",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true
  },
  {
    headerName: "Protein",
    field: "proteinName",
    filter: "agSetColumnFilter",
    menuTabs: ["filterMenuTab"]
  },
  {
    headerName: "UniProt id",
    field: "uniprotSource",
    cellRenderer: function(params) {
      return (
        '<a href="https://www.uniprot.org/uniprot/' +
        params.value.uniprotId +
        '" target="_blank" rel="noopener noreferrer">' +
        params.value.uniprotId +
        "</a>"
      );
    }
  },
  {
    headerName: "Gene",
    field: "geneSymbol",
    filter: "agSetColumnFilter",
    hide: true
  },
  {
    headerName: "Organism",
    field: "organism",
    filter: "agSetColumnFilter"
  },
  {
    headerName: "Taxonomic distance",
    field: "taxonomicProximity",
    hide: true,
    filter: "taxonomyFilter"
  },
  {
    headerName: "Organ",
    field: "organ",
    filter: "agSetColumnFilter",
    hide: false
  },
  {
    headerName: "Source",
    field: "source",
    cellRenderer: function(params) {
      return (
        '<a href="https://pax-db.org/search?q=' +
        params.value.uniprotId +
        '" target="_blank" rel="noopener noreferrer">' +
        "PAXdb" +
        "</a>"
      );
    },
    filter: "agSetColumnFilter"
  }
];

Object.size = function(obj) {
  let size = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      size++;
    }
  }
  return size;
};

@connect(store => {
  return {
    //currentUrl: store.page.url,
    allData: store.results.allData
  };
}) //the names given here will be the names of props
class Protein extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    allData: PropTypes.array,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.grid = React.createRef();

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.cancelDataTokenSource = null;
    this.cancelTaxonInfoTokenSource = null;
    this.cancelUniprotMetadataTokenSource = null;
    this.cancelComboMetadataTokenSource = null;

    this.state = {
      metadata: null,
      lineage: []
    };

    this.processProteinData = this.processProteinData.bind(this);
    this.formatData = this.formatData.bind(this);
    this.sizeGridColumnsToFit = this.sizeGridColumnsToFit.bind(this);
    this.updateGridHorizontalScrolling = this.updateGridHorizontalScrolling.bind(
      this
    );
    this.onClickExportDataCsv = this.onClickExportDataCsv.bind(this);
    this.onClickExportDataJson = this.onClickExportDataJson.bind(this);
  }

  componentDidMount() {
    this.locationPathname = this.props.history.location.pathname;
    this.unlistenToHistory = this.props.history.listen(location => {
      if (location.pathname !== this.locationPathname) {
        this.locationPathname = this.props.history.location.pathname;
        this.updateStateFromLocation();
      }
    });
    this.updateStateFromLocation();
  }

  componentWillUnmount() {
    this.unlistenToHistory();
    this.unlistenToHistory = null;
    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }
    if (this.cancelTaxonInfoTokenSource) {
      this.cancelTaxonInfoTokenSource.cancel();
    }
    if (this.cancelUniprotMetadataTokenSource) {
      this.cancelUniprotMetadataTokenSource.cancel();
    }
    if (this.cancelComboMetadataTokenSource) {
      this.cancelComboMetadataTokenSource.cancel();
    }
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      this.setState({
        metadata: null,
        lineage: []
      });
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;
    const organism = route.organism;

    // cancel earlier query
    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }

    this.cancelDataTokenSource = axios.CancelToken.source();
    getDataFromApi(
      [
        "proteins",
        "proximity_abundance/proximity_abundance_kegg/" +
          "?kegg_id=" +
          query +
          "&anchor=" +
          organism +
          "&distance=40" +
          "&depth=40"
      ],
      { cancelToken: this.cancelDataTokenSource.token },
      "Unable to get data about ortholog group '" + query + "'."
    )
      .then(response => {
        if (!response) return;
        this.processProteinDataUniprot(response.data);
      })
      .finally(() => {
        this.cancelDataTokenSource = null;
      });

    if (organism != null) {
      // cancel earlier query
      if (this.cancelTaxonInfoTokenSource) {
        this.cancelTaxonInfoTokenSource.cancel();
      }

      this.cancelTaxonInfoTokenSource = axios.CancelToken.source();
      getDataFromApi(
        ["taxon", "canon_rank_distance_by_name/?name=" + organism],
        { cancelToken: this.cancelTaxonInfoTokenSource.token },
        "Unable to get taxonomic information about '" + organism + "'."
      )
        .then(response => {
          if (!response) return;
          this.setState({ lineage: response.data });
        })
        .finally(() => {
          this.cancelTaxonInfoTokenSource = null;
        });
    }
  }

  formatOrthologyMetadata(data) {
    const metadata = {};

    metadata["koNumber"] = data[0].ko_number;
    metadata["koName"] = data[0].ko_name;

    const uniprotIds = [];
    for (const datum of data) {
      uniprotIds.push(datum.uniprot_id);
    }
    metadata["uniprotIds"] = uniprotIds;

    this.setState({ metadata: metadata });
  }

  processProteinData(data) {
    if (typeof data != "string") {
      this.formatData(data);

      const metadata = {};

      let uniprotId = "";
      if (Object.size(data[0]) === 1) {
        uniprotId = data[1].uniprot_id;
      } else {
        uniprotId = data[0].uniprot_id;
      }
      metadata["koNumber"] = [data[0].ko_number, uniprotId];
      this.setState({ metadata: metadata });
    } else {
      const route = parseHistoryLocationPathname(this.props.history);
      const query = route.query;

      if (this.cancelUniprotMetadataTokenSource) {
        this.cancelUniprotMetadataTokenSource.cancel();
      }

      this.cancelUniprotMetadataTokenSource = axios.CancelToken.source();
      getDataFromApi(
        ["proteins", "meta?uniprot_id=" + query],
        { cancelToken: this.cancelUniprotMetadataTokenSource.token },
        "Unable to data about ortholog group '" + query + "'."
      )
        .then(response => {
          if (!response) return;

          this.formatData(response.data);

          const metadata = {};
          metadata["koNumber"] = [
            response.data[0].ko_number,
            response.data[1].uniprot_id
          ];
          this.setState({ metadata: metadata });
        })
        .finally(() => {
          this.cancelUniprotMetadataTokenSource = null;
        });
    }
  }

  processProteinDataUniprot(data) {
    if (typeof data != "string") {
      const uniprotToDist = {};
      if (data != null && typeof data != "string") {
        for (const datum of data) {
          for (const doc of datum.documents) {
            if (doc.abundances !== undefined) {
              uniprotToDist[doc.uniprot_id] = datum.distance;
            }
          }
        }
      }
      const uniprotIds = Object.keys(uniprotToDist);
      let endQuery = "";
      for (const uniprotId of uniprotIds) {
        endQuery += "uniprot_id=" + uniprotId + "&";
      }

      const route = parseHistoryLocationPathname(this.props.history);
      const query = route.query;

      if (this.cancelComboMetadataTokenSource) {
        this.cancelComboMetadataTokenSource.cancel();
      }

      this.cancelComboMetadataTokenSource = axios.CancelToken.source();
      getDataFromApi(
        ["proteins", "meta/meta_combo/?" + endQuery],
        { cancelToken: this.cancelComboMetadataTokenSource.token },
        "Unable to get data about proteins for ortholog group '" + query + "'."
      )
        .then(response => {
          if (!response) return;
          this.formatOrthologyMetadata(response.data);
          this.formatData(response.data, uniprotToDist);
        })
        .finally(() => {
          this.cancelComboMetadataTokenSource = null;
        });
    }
  }

  formatData(data, uniprotToDist) {
    if (data != null && typeof data != "string") {
      if (!(data[0].uniprot_id === "Please try another input combination")) {
        let start = 0;
        if (Object.size(data[0]) === 1) {
          start = 1;
        }

        const allData = [];
        for (const uniprot of data.slice(start)) {
          if (uniprot.abundances !== undefined) {
            for (
              let iMeasurement = 0;
              iMeasurement < uniprot.abundances.length;
              iMeasurement++
            ) {
              let row = {};
              row["abundance"] = parseFloat(
                uniprot.abundances[iMeasurement].abundance
              );
              row["organ"] = uniprot.abundances[iMeasurement].organ;
              row["geneSymbol"] = uniprot.gene_name;
              row["organism"] = uniprot.species_name;
              row["uniprotId"] = uniprot.uniprot_id;
              row["uniprotSource"] = { uniprotId: uniprot.uniprot_id };
              let proteinName = uniprot.protein_name;
              if (proteinName.includes("(")) {
                proteinName = proteinName.substring(
                  0,
                  proteinName.indexOf("(")
                );
              }
              row["proteinName"] = proteinName;
              row["taxonomicProximity"] = uniprotToDist[uniprot.uniprot_id];
              row["source"] = { uniprotId: uniprot.uniprot_id };
              allData.push(row);
            }
          }
        }
        this.props.dispatch(setAllData(allData));
      }
    }
  }

  sizeGridColumnsToFit(event) {
    sizeGridColumnsToFit(event, this.grid.current);
  }

  updateGridHorizontalScrolling(event) {
    updateGridHorizontalScrolling(event, this.grid.current);
  }

  onClickExportDataCsv() {
    const gridApi = this.grid.current.api;
    gridApi.exportDataAsCsv(gridDataExportParams);
  }

  onClickExportDataJson() {
    downloadData(
      JSON.stringify(this.props.allData),
      "data.json",
      "application/json"
    );
  }

  render() {
    const route = parseHistoryLocationPathname(this.props.history);
    const organism = route.organism;

    if (this.props.allData == null) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    let title = this.state.metadata.koName[0];
    title = upperCaseFirstLetter(title);

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-protein-scene">
        <h1 className="page-title">Protein: {title}</h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <HashLink to="#description" scroll={scrollTo}>
                      Description
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#abundance" scroll={scrollTo}>
                      Abundance
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column section">
            <MetadataSection
              metadata={this.state.metadata}
              organism={organism}
            />

            <div className="content-block measurements" id="abundance">
              <div className="content-block-heading-container">
                <h2 className="content-block-heading">Abundance</h2>
                <div className="content-block-heading-actions">
                  Export:{" "}
                  <button
                    className="text-button"
                    onClick={this.onClickExportDataCsv}
                  >
                    CSV
                  </button>{" "}
                  |{" "}
                  <button
                    className="text-button"
                    onClick={this.onClickExportDataJson}
                  >
                    JSON
                  </button>
                </div>
              </div>
              <div className="ag-theme-balham">
                <AgGridReact
                  ref={this.grid}
                  modules={AllModules}
                  frameworkComponents={frameworkComponents}
                  sideBar={sideBar}
                  defaultColDef={defaultColDef}
                  columnDefs={columnDefs}
                  rowData={this.props.allData}
                  rowSelection="multiple"
                  groupSelectsChildren={true}
                  suppressMultiSort={true}
                  suppressAutoSize={true}
                  suppressMovableColumns={true}
                  suppressCellSelection={true}
                  suppressRowClickSelection={true}
                  suppressContextMenu={true}
                  domLayout="autoHeight"
                  onGridSizeChanged={this.sizeGridColumnsToFit}
                  onColumnVisible={this.sizeGridColumnsToFit}
                  onColumnResized={this.updateGridHorizontalScrolling}
                  onToolPanelVisibleChanged={this.sizeGridColumnsToFit}
                  onFirstDataRendered={this.sizeGridColumnsToFit}
                  lineage={this.state.lineage}
                ></AgGridReact>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Protein);
