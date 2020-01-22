import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

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
import PartialMatchFilter from "../PartialMatchFilter";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";
import "./Protein.scss";

const sideBar = {
  toolPanels: [
    {
      id: "columns",
      labelDefault: "Columns",
      labelKey: "columns",
      iconKey: "columns",
      toolPanel: "agColumnsToolPanel"
    },
    {
      id: "filters",
      labelDefault: "Filters",
      labelKey: "filters",
      iconKey: "filter",
      toolPanel: "agFiltersToolPanel"
    },
    {
      id: "customStats",
      labelDefault: "Stats",
      labelKey: "customStats",
      iconKey: "customstats",
      toolPanel: "statsToolPanel"
    }
  ],
  position: "left",
  defaultToolPanel: "filters"
};

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
class Protein extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      orthologyMetadata: [],
      f_abundances: null,
      organism: "",
      orig_json: null,
      isFlushed: false,
      data_arrived: false,
      modules: AllModules,
      lineage: [],
      data_arrived: false,
      tanimoto: false,
      columnDefs: [
        {
          headerName: "Protein",
          field: "protein_name",
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          //filter: 'taxonomyFilter',
          filter: "agNumberColumnFilter",
          menuTabs: ["filterMenuTab"]
        },
        {
          headerName: "Abundance",
          field: "abundance",
          sortable: true,
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "Organism",
          field: "organism",
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Source Link",
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
          headerName: "Taxonomic Distance",
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
          headerName: "Gene Symbol",
          field: "gene_symbol",
          filter: "agTextColumnFilter",
          hide: true
        }
      ],

      rowData: null,
      rowSelection: "multiple",
      autoGroupColumnDef: {
        headerName: "Conc",
        field: "concentration",
        width: 200,
        cellRenderer: "agGroupCellRenderer",
        cellRendererParams: { checkbox: true }
      },
      frameworkComponents: {
        statsToolPanel: StatsToolPanel,
        taxonomyFilter: TaxonomyFilter,
        partialMatchFilter: PartialMatchFilter
      }
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
        search: "",
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
    const ko = this.props.match.params.protein;
    const organism = this.props.match.params.organism;

    getDataFromApi([
      "proteins",
      "proximity_abundance/proximity_abundance_kegg/?kegg_id=" +
        ko +
        "&anchor=" +
        organism +
        "&distance=40&depth=40"
    ]).then(response => {
      this.processProteinDataUniprot(response.data);
    });

    if (organism != null) {
      getDataFromApi([
        "taxon",
        "canon_rank_distance_by_name/?name=" + organism
      ]).then(response => {
        this.setState({ lineage: response.data });
      });
    }
  }

  formatOrthologyMetadata(data) {
    let newOrthologyMetadata = [];
    let start = 0;
    let uni_ids = [];
    let meta = {};
    meta["ko_number"] = data[0].ko_number;
    meta["ko_name"] = data[0].ko_name;

    for (var i = start; i < data.length; i++) {
      uni_ids.push(data[i].uniprot_id);
    }
    meta["uniprot_ids"] = uni_ids;
    newOrthologyMetadata.push(meta);
    this.setState({ orthologyMetadata: newOrthologyMetadata });
  }

  processProteinData(data) {
    if (typeof data != "string") {
      this.setState({ orig_json: data });
      this.formatData(data);

      let newOrthologyMetadata = [];
      let meta = {};
      let uniprot_id = "";
      if (Object.size(data[0]) === 1) {
        uniprot_id = data[1].uniprot_id;
      } else {
        uniprot_id = data[0].uniprot_id;
      }
      meta["ko_number"] = [data[0].ko_number, uniprot_id];
      newOrthologyMetadata.push(meta);
      this.setState({ orthologyMetadata: newOrthologyMetadata });
    } else {
      getDataFromApi([
        "proteins",
        "meta?uniprot_id=" + this.props.match.params.protein
      ]).then(response => {
        this.formatData(response.data);

        let newOrthologyMetadata = [];
        let meta = {};
        meta["ko_number"] = [
          response.data[0].ko_number,
          response.data[1].uniprot_id
        ];
        newOrthologyMetadata.push(meta);
        this.setState({ orthologyMetadata: newOrthologyMetadata });
      });
    }
  }

  processProteinDataUniprot(data) {
    if (typeof data != "string") {
      this.setState({ orig_json: data });
      var f_abundances = [];
      let newProteinMetadata = [];
      let uniprot_to_dist = {};
      if (data != null && typeof data != "string") {
        let start = 0;
        for (var i = 0; i < data.length; i++) {
          let docs = data[i].documents;
          for (var q = docs.length - 1; q >= 0; q--) {
            var uniprot = docs[q].abundances;
            if (uniprot !== undefined) {
              for (var n = 0; n < uniprot.length; n++) {
                let row = {};
                uniprot_to_dist[docs[q].uniprot_id] = data[i].distance;
              }
            }
          }
        }
      }
      let total_ids = Object.keys(uniprot_to_dist);
      let end_query = "";
      for (var f = total_ids.length - 1; f >= 0; f--) {
        end_query = end_query + "uniprot_id=" + total_ids[f] + "&";
      }
      getDataFromApi(["proteins", "meta/meta_combo/?" + end_query]).then(
        response => {
          this.formatOrthologyMetadata(response.data);
          this.formatData(response.data, uniprot_to_dist);
        }
      );
    }
  }

  formatData(data, uniprot_to_dist) {
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
              row["taxonomic_proximity"] =
                uniprot_to_dist[uniprot.uniprot_id] + 1;
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

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  };

  onClicked() {
    this.gridApi
      .getFilterInstance("taxonomic_proximity")
      .getFrameworkComponentInstance()
      .componentMethod2("Hello World!");
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

    let styles = {
      marginTop: 50
    };
    return (
      <div className="biochemical-entity-scene biochemical-entity-protein-scene">
        <MetadataSection
          proteinMetadata={this.state.orthologyMetadata}
          organism={organism}
        />

        <div className="ag_chart" style={{ width: "100%", height: "1000px" }}>
          <div className="ag-theme-balham">
            <AgGridReact
              modules={this.state.modules}
              frameworkComponents={this.state.frameworkComponents}
              columnDefs={this.state.columnDefs}
              sideBar={sideBar}
              rowData={this.props.totalData}
              gridOptions={{ floatingFilter: true }}
              onFirstDataRendered={this.onFirstDataRendered.bind(this)}
              rowSelection={this.state.rowSelection}
              groupSelectsChildren={true}
              suppressRowClickSelection={true}
              //autoGroupColumnDef={this.state.autoGroupColumnDef}
              //onGridReady={this.onGridReady}
              lineage={this.state.lineage}
              onSelectionChanged={this.onRowSelected.bind(this)}
              onFilterChanged={this.onFiltered.bind(this)}
              domLayout={"autoHeight"}
              domLayout={"autoWidth"}
              onGridReady={this.onGridReady}
            ></AgGridReact>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Protein);
