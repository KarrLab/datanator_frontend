import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import {
  setLineage,
  setTotalData,
  setSelectedData
} from "~/data/actions/resultsAction";
import { setNewUrl, abstractMolecule } from "~/data/actions/pageAction";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import StatsToolPanel from "./StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";
import "./Rna.scss";

const frameworkComponents = {
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
    headerName: "Half Life",
    field: "half_life",
    sortable: true,
    filter: "agNumberColumnFilter",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true
  },

  {
    headerName: "Reference",
    field: "reference",

    cellRenderer: function(params) {
      return (
        '<a href="https://scholar.google.com/scholar?q=' +
        params.value +
        '" target="_blank" rel="noopener noreferrer">' +
        "Reference" +
        "</a>"
      );
    }
  },

  {
    headerName: "Organism",
    field: "organism",
    filter: "agTextColumnFilter"
  },
  {
    headerName: "Growth Medium",
    field: "growth_medium",
    filter: "agTextColumnFilter",
    hide: false
  },
];

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) size++;
  }
  return size;
};

@connect(store => {
  return {
    //currentUrl: store.page.url,
    totalData: store.results.totalData
  };
}) //the names given here will be the names of props
class Rna extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      rnaMetadata: [],
      orthologyMetadata: [],
      f_abundances: null,
      organism: "",
      orig_json: null,
      isFlushed: false,
      lineage: [],
      data_arrived: false,
      tanimoto: false
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
      this.setState({
        search: "",
        proteinMetadata: [],
        orthologyMetadata: [],
        f_abundances: null,
        organism: "",
        orig_json: null,
        isFlushed: false,
        data_arrived: false
      });
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
      this.formatData(response.data);
    });
  }

  formatData(data) {
    let meta = {}
    meta["protein_name"] = data[0]['function']
    meta["gene_name"] = data[0].gene_name
    console.log(data);
    if (data != null && typeof data != "string") {
      //let data_n = data[0]
      let half_lives = data[0].halflives;
      let final_data = []
      for (var i = 0; i < half_lives.length; i++) {
        let entry = half_lives[i];
        let row = {};
        row["half_life"] = entry.halflife;
        row["reference"] = entry.reference[0]["doi"];
        row["organism"] = entry.species;
        row["growth_medium"] = entry.growth_medium;
        final_data.push(row);
      }
      this.props.dispatch(setTotalData(final_data));
      this.setState({ data_arrived: true, rnaMetadata:[meta] }); 
    }
    else {
        //alert('Nothing Found');

    } 
  }

  onFirstDataRendered(params) {
    //params.columnApi.autoSizeColumns(['concentration'])

    var allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds);
    //params.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  onRowSelected(event) {
    let selectedRows = [];
    for (var i = event.api.getSelectedNodes().length - 1; i >= 0; i--) {
      selectedRows.push(event.api.getSelectedNodes()[i].data);
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
      this.state.rnaMetadata.length === 0 ||
      this.props.totalData == null
    ) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-rna-scene">
        <MetadataSection
          rnaMetadata={this.state.rnaMetadata}
        />

        <div className="content-block measurements-grid ag-theme-balham">
          <h2 className="content-block-heading">Half-life</h2>
          <AgGridReact
            modules={AllModules}
            frameworkComponents={frameworkComponents}
            sideBar={sideBar}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            rowData={this.props.totalData}
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
    );
  }
}

export default withRouter(Rna);
