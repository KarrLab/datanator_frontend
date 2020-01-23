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
import { AllModules } from '@ag-grid-enterprise/all-modules';
import StatsToolPanel from "./StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";
import "./Rna.scss";

const frameworkComponents = {
  statsToolPanel: StatsToolPanel,
  taxonomyFilter: TaxonomyFilter,
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
        suppressColumnExpandAll: true,
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
        suppressExpandAll: true,
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
  hiddenByDefault: false,
};

const defaultColDef = {
  filter: 'agTextColumnFilter',
  sortable: true,
  resizable: true,
  suppressMenu: true,
};

const columnDefs = [
  {
    headerName: "Abundance",
    field: "abundance",
    sortable: true,
    filter: "agNumberColumnFilter",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
  },    
  {
    headerName: "Protein",
    field: "protein_name",
    filter: "agNumberColumnFilter",
    menuTabs: ["filterMenuTab"]
  },    
  {
    headerName: "Uniprot",
    field: "uniprot_source",

    cellRenderer: function(params) {
      if (true) {
        return (
          '<a href="https://www.uniprot.org/uniprot/' +
          params.value.uniprot_id +
          '" target="_blank" rel="noopener noreferrer">' +
          params.value.uniprot_id +
          "</a>"
        );
      } else {
        return (
          '<a href="https://www.ymdb.ca/compounds/' +
          params.value.id +
          '" target="_blank" rel="noopener noreferrer">' +
          "YMDB" +
          "</a>"
        );
      }
    }
  },
  {
    headerName: "Gene",
    field: "gene_symbol",
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
    field: "taxonomic_proximity",
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
    field: "source_link",

    cellRenderer: function(params) {
      if (true) {
        return (
          '<a href="https://pax-db.org/search?q=' +
          params.value.uniprot_id +
          '" target="_blank" rel="noopener noreferrer">' +
          "PAXdb" +
          "</a>"
        );
      } else {
        return (
          '<a href="https://www.ymdb.ca/compounds/' +
          params.value.id +
          '" target="_blank" rel="noopener noreferrer">' +
          "YMDB" +
          "</a>"
        );
      }
    }
  },
];

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

@connect(store => {
  return {
    //currentUrl: store.page.url,
    moleculeAbstract: store.page.moleculeAbstract,
    totalData: store.results.totalData
  };
}) //the names given here will be the names of props
class Rna extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      proteinMetadata: [],
      orthologyMetadata: [],
      f_abundances: null,
      organism: "",
      orig_json: null,
      isFlushed: false,
      data_arrived: false,
      lineage: [],
      data_arrived: false,
      tanimoto: false,
    };

    this.formatProteinMetadata = this.formatProteinMetadata.bind(this);
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
        rna + "&_from=0&size=10"
      ]).then(response => {
        this.formatData(response.data);
      });
  }

  formatProteinMetadata(data) {
  }

  formatData(data) {
    console.log(data)
    var f_abundances = [];
    if (data != null && typeof data != "string") {
      if (!(data[0].uniprot_id === "Please try another input combination")) {
        let start = 0;
        if (Object.size(data[0]) === 1) {
          start = 1;
        }
        for (var i = start; i < data.length; i++) {
          let uniprot = data[i];
          if (uniprot.abundances !== undefined) {
            for (var n = 0; n < uniprot.abundances.length; n++) {
              let row = {};
              row["abundance"] = uniprot.abundances[n].abundance;
              row["organ"] = uniprot.abundances[n].organ;
              row["gene_symbol"] = uniprot.gene_name;
              row["organism"] = uniprot.species_name;
              row["uniprot_id"] = uniprot.uniprot_id;
              row["uniprot_source"] = { uniprot_id: uniprot.uniprot_id };
              let protein_name = uniprot.protein_name;
              if (protein_name.includes("(")) {
                protein_name = protein_name.substring(
                  0,
                  protein_name.indexOf("(")
                );
              }
              row["protein_name"] = protein_name;

              row["source_link"] = { uniprot_id: uniprot.uniprot_id };
              f_abundances.push(row);
            }
          }
        }
        this.props.dispatch(setTotalData(f_abundances));
        this.setState({ data_arrived: true });
      } else {
        //alert('Nothing Found');
      }
    } else {
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
    const organism = this.props.match.params.organism;

    if (
      this.state.orthologyMetadata.length === 0 ||
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
          proteinMetadata={this.state.orthologyMetadata}
          //molecule={this.props.match.params.rna}
          organism={organism}
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
