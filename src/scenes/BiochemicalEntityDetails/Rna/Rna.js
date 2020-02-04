import React, { Component } from "react";
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
        col: "halfLife"
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
    headerName: "Half life (s^-1)",
    field: "halfLife",
    cellRenderer: "numericCellRenderer",
    type: "numericColumn",
    filter: "agNumberColumnFilter",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true
  },
  {
    headerName: "Organism",
    field: "organism",
    filter: "agSetColumnFilter"
  },
  {
    headerName: "Media",
    field: "growthMedium",
    filter: "agTextColumnFilter",
    hide: false
  },
  {
    headerName: "Source",
    field: "reference",
    cellRenderer: function(params) {
      return (
        '<a href="https://scholar.google.com/scholar?q=' +
        params.value +
        '" target="_blank" rel="noopener noreferrer">' +
        "DOI" +
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

class Rna extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.grid = React.createRef();

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.cancelDataTokenSource = null;
    this.cancelTaxonInfoTokenSource = null;

    this.state = {
      metadata: null,
      data: null,
      lineage: []
    };

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
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;

    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }

    this.cancelDataTokenSource = axios.CancelToken.source();
    getDataFromApi(
      [
        "/rna/halflife/get_info_by_protein_name/" +
          "?protein_name=" +
          query +
          "&_from=0" +
          "&size=1000"
      ],
      { cancelToken: this.cancelDataTokenSource.token },
      "Unable to get data about RNA '" + query + "'."
    )
      .then(response => {
        if (!response) return;
        this.formatData(response.data);
      })
      .finally(() => {
        this.cancelDataTokenSource = null;
      });
  }

  formatData(data) {
    const metadata = {};

    metadata["geneName"] = data[0].gene_name;

    if (data[0]["function"]) {
      metadata["proteinName"] = data[0]["function"];
    } else if (data[0]["protein_name"]) {
      metadata["proteinName"] = data[0]["protein_name"];
    } else {
      metadata["proteinName"] = "Protein Name not Found";
    }

    if (data != null && typeof data != "string") {
      const measurements = data[0].halflives;
      const allData = [];
      for (const measurement of measurements) {
        const row = {};
        row["halfLife"] = parseFloat(measurement.halflife);
        row["reference"] = measurement.reference[0]["doi"];
        row["organism"] = measurement.species;
        row["growthMedium"] = measurement.growth_medium;
        allData.push(row);
      }
      this.setState({
        metadata: metadata,
        data: allData
      });
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
      JSON.stringify(this.state.data),
      "data.json",
      "application/json"
    );
  }

  render() {
    if (this.state.metadata == null || this.state.data == null) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    let title = this.state.metadata.geneName;
    if (!title) {
      title = this.state.metadata.proteinName;
    }
    title = upperCaseFirstLetter(title);

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-rna-scene">
        <h1 className="page-title">RNA: {title}</h1>
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
                    <HashLink to="#half-life" scroll={scrollTo}>
                      Half-life
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column section">
            <MetadataSection metadata={this.state.metadata} />

            <div className="content-block measurements" id="half-life">
              <div className="content-block-heading-container">
                <h2 className="content-block-heading">Half-life</h2>
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
                  rowData={this.state.data}
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

export default withRouter(Rna);
