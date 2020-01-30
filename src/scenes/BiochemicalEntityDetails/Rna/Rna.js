import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";
import { upperCaseFirstLetter, scrollTo } from "~/utils/utils";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import {
  setLineage,
  setAllData,
  setSelectedData
} from "~/data/actions/resultsAction";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { StatsToolPanel } from "../StatsToolPanel/StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";
// import "./Rna.scss";

const frameworkComponents = {
  statsToolPanel: () => (<StatsToolPanel col={"halfLife"} />),
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
    headerName: "Half life (s^-1)",
    field: "halfLife",
    sortable: true,
    filter: "agNumberColumnFilter",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true
  },
  {
    headerName: "Organism",
    field: "organism",
    filter: "agTextColumnFilter"
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
    }
  },
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
class Rna extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      metadata: null,
      lineage: [],
    };

    this.formatData = this.formatData.bind(this);
  }
  componentDidMount() {
    this.getDataFromApi();
  }

  componentDidUpdate(prevProps) {
    // respond to parameter change in scenario 3

    if (
      this.props.match.params.rna !== prevProps.match.params.rna ||
      this.props.match.params.organism !== prevProps.match.params.organism
    ) {
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const rna = this.props.match.params.rna;
    getDataFromApi([
      "/rna/halflife/get_info_by_protein_name/?protein_name=" +
        rna +
        "&_from=0&size=1000"
    ], {}, "Unable to get data about RNA '" + rna + "'.").then(response => {
      if (!response)
        return;
      this.formatData(response.data);
    });
  }

  formatData(data) { 
    const metadata = {}
    
    metadata["geneName"] = data[0].gene_name;

    if(data[0]['function']) {
      metadata["proteinName"] = data[0]['function']
    } else if (data[0]['protein_name']){
       metadata["proteinName"] = data[0]['protein_name']
    } else{
      metadata["proteinName"] = 'Protein Name not Found'
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
      this.props.dispatch(setAllData(allData));
      this.setState({ metadata: metadata }); 
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
    const selectedRows = [];
    const selectedNodes = event.api.getSelectedNodes();
    for (const selectedNode of selectedNodes) {
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
    if (
      this.state.metadata == null ||
      this.props.allData == null
    ) {
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
                    <HashLink to="#properties" scroll={scrollTo}>
                      Properties
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
            <MetadataSection
              metadata={this.state.metadata}
            />

            <div className="content-block measurements" id="half-life">
              <div className="content-block-heading-container">
                <h2 className="content-block-heading">Half-life</h2>
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

export default withRouter(Rna);
