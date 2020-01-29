import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import {
  setLineage,
  setTotalData,
  setSelectedData
} from "~/data/actions/resultsAction";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { StatsToolPanel } from "../StatsToolPanel/StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";
import "./Protein.scss";

const frameworkComponents = {
  statsToolPanel: () => (<StatsToolPanel relevant-column={"abundance"} />),
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
      toolPanel: "statsToolPanel"
    }
  ],
  position: "left",
  defaultToolPanel: "filters",
  hiddenByDefault: false
};

const defaultColDef = {
  filter: "agTextColumnFilter",
  sortable: true,
  resizable: true,
  suppressMenu: true
};

const columnDefs = [
  {
    headerName: "Abundance",
    field: "abundance",
    sortable: true,
    filter: "agNumberColumnFilter",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true
  },
  {
    headerName: "Protein",
    field: "proteinName",
    filter: "agNumberColumnFilter",
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
    filter: "agTextColumnFilter",
    hide: true
  },
  {
    headerName: "Organism",
    field: "organism",
    filter: "agTextColumnFilter"
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
    filter: "agTextColumnFilter",
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
    }
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
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      metadata: null,
      lineage: [],
    };

    this.processProteinData = this.processProteinData.bind(this);
    this.formatData = this.formatData.bind(this);
  }
  componentDidMount() {
    this.getDataFromApi();
  }

  componentDidUpdate(prevProps) {
    // respond to parameter change in scenario 3

    if (
      this.props.match.params.protein !== prevProps.match.params.protein ||
      this.props.match.params.organism !== prevProps.match.params.organism
    ) {
      this.setState({
        metadata: null,
        lineage: [],
      });
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const ko = this.props.match.params.protein;
    const organism = this.props.match.params.organism;

    getDataFromApi([
      "proteins",
      "proximity_abundance/proximity_abundance_kegg/?kegg_id=" +
        ko +
        "&anchor=" +
        organism +
        "&distance=40&depth=40"
    ], {}, "Unable to get data about ortholog group '" + ko + "'.").then(response => {
      this.processProteinDataUniprot(response.data);
    });

    if (organism != null) {
      getDataFromApi([
        "taxon",
        "canon_rank_distance_by_name/?name=" + organism
      ], {}, "Unable to get taxonomic information about '" + organism + "'.").then(response => {
        this.setState({ lineage: response.data });
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
      getDataFromApi([
        "proteins",
        "meta?uniprot_id=" + this.props.match.params.protein
      ], {}, "Unable to data about ortholog group '" + this.props.match.params.protein + "'.").then(response => {
        this.formatData(response.data);

        const metadata = {};
        metadata["koNumber"] = [
          response.data[0].ko_number,
          response.data[1].uniprot_id
        ];
        this.setState({ metadata: metadata });
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
      getDataFromApi(["proteins", "meta/meta_combo/?" + endQuery], {}, 
        "Unable to get data about proteins for ortholog group '" + this.props.match.params.protein + "'.")
        .then(
          response => {
            this.formatOrthologyMetadata(response.data);
            this.formatData(response.data, uniprotToDist);
          }
        );
    }
  }

  formatData(data, uniprotToDist) {
    if (data != null && typeof data != "string") {
      if (!(data[0].uniprot_id === "Please try another input combination")) {
        let start = 0;
        if (Object.size(data[0]) === 1) {
          start = 1;
        }

        const allData = []
        for (const uniprot of data.slice(start)) {
          if (uniprot.abundances !== undefined) {
            for (let iMeasurement = 0; iMeasurement < uniprot.abundances.length; iMeasurement++) {
              let row = {};
              row["abundance"] = uniprot.abundances[iMeasurement].abundance;
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
              row["taxonomicProximity"] =
                uniprotToDist[uniprot.uniprot_id];
              row["source"] = { uniprotId: uniprot.uniprot_id };
              allData.push(row);
            }
          }
        }
        this.props.dispatch(setTotalData(allData));
      } else {
        //alert('Nothing Found');
      }
    } else {
      //alert('Nothing Found');
    }
  }

  onFirstDataRendered(params) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds);
    //params.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  onRowSelected(event) {
    let selectedRows = [];
    for (const selectedNode of event.api.getSelectedNodes()) {
      selectedRows.push(selectedNode.data);
    }
    this.props.dispatch(setSelectedData(selectedRows));
  }

  onFiltered(event) {
    event.api.deselectAll();
    this.props.dispatch(setSelectedData([]));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  render() {
    const organism = this.props.match.params.organism;

    if (this.props.allData == null) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    let scrollTo = el => {
      window.scrollTo({ behavior: "smooth", top: el.offsetTop - 52 });
    };

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-protein-scene">
        <h1 className="page-title">{this.state.metadata.koName[0]}</h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <HashLink to="#properties" scroll={scrollTo}>
                      Properties
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
                  Export: <button className="text-button">CSV</button> | <button className="text-button">JSON</button>
                </div>
              </div>
              <div className="ag-theme-balham">
                <AgGridReact
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
                  onGridReady={this.onGridReady.bind(this)}
                  onFirstDataRendered={this.onFirstDataRendered.bind(this)}
                  onFilterChanged={this.onFiltered.bind(this)}
                  onSelectionChanged={this.onRowSelected.bind(this)}
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
