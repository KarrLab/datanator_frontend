import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import { setTotalData, setSelectedData } from "~/data/actions/resultsAction";

import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import StatsToolPanel from "./StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
import { TanimotoFilter } from "~/scenes/BiochemicalEntityDetails/TanimotoFilter.js";
import PartialMatchFilter from "../PartialMatchFilter";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";
import "./Reaction.scss";

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
      labelDefault: "Kcat",
      labelKey: "customStats",
      iconKey: "customstats",
      toolPanel: "statsToolPanel"
    },
  ],
  position: "left",
  defaultToolPanel: "filters"
};

function getReactionID(resource) {
  for (var i = 0; i < resource.length; i++)
    if (resource[i].namespace === "sabiork.reaction") {
      return resource[i].id;
    }
}

function getECNumber(resource) {
  for (var i = 0; i < resource.length; i++)
    if (resource[i].namespace === "ec-code") {
      return resource[i].id;
    }
}

function getSubstrates(substrate) {
  let subNames = [];
  for (var i = 0; i < substrate.length; i++) {
    subNames.push(substrate[i].substrate_name);
  }
  return subNames;
}

function getProducts(product) {
  let subNames = [];
  for (var i = 0; i < product.length; i++) {
    subNames.push(product[i].product_name);
  }
  return subNames;
}

function formatPart(parts) {
  let participants_string = "";
  for (var i = parts.length - 1; i >= 0; i--) {
    participants_string = participants_string + parts[i] + " + ";
  }
  participants_string = participants_string.substring(
    0,
    participants_string.length - 3
  );
  return participants_string;
}

function getSubstrateInchiKey(substrate) {
  let inchiKeys = [];
  for (var i = 0; i < substrate.length; i++) {
    if (substrate[i].substrate_structure[0]) {
      inchiKeys.push(substrate[i].substrate_structure[0].InChI_Key);
    }
  }
  return inchiKeys;
}

function getProductInchiKey(product) {
  let inchiKeys = [];
  for (var i = 0; i < product.length; i++) {
    if (product[i].product_structure[0]) {
      inchiKeys.push(product[i].product_structure[0].InChI_Key);
    }
  }
  return inchiKeys;
}

function getKcat(parameters) {
  let kinetic_params = {};
  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].name === "k_cat") {
      kinetic_params["kcat"] = parameters[i].value;
    }
  }
  return kinetic_params;
}

function getKm(parameters, substrates) {
  let kms = {};
  for (var i = 0; i < parameters.length; i++) {
    if (
      parameters[i].type == "27" &&
      substrates.includes(parameters[i]["name"]) &&
      parameters[i]["observed_name"].toLowerCase() === "km"
    ) {
      kms["km_" + parameters[i]["name"]] = parameters[i].value;
    }
  }
  return kms;
}
/*
reaction_id
kcat
wildtype_mutant
organism
ph
temperature
*/
@connect(store => {
  return { totalData: store.results.totalData };
}) //the names given here will be the names of props
class Reaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reactionMetadata: [],
      km_values: [],
      modules: AllModules,
      lineage: [],
      data_arrived: false,
      tanimoto: false,
      columnDefs: [],
      first_columns: [
        {
          headerName: "Entry ID",
          field: "kinlaw_id",
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          //filter: 'taxonomyFilter',
          filter: "agNumberColumnFilter",
          menuTabs: ["filterMenuTab"],

          cellRenderer: function(params) {
            if (true) {
              return (
                '<a href="http://sabiork.h-its.org/newSearch/index?q=EntryID:' +
                params.value +
                '" target="_blank" rel="noopener noreferrer">' +
                params.value +
                "</a>"
              );
            }
          }
        },
        {
          headerName: "Kcat",
          field: "kcat",
          sortable: true,
          filter: "agNumberColumnFilter"
        }
      ],
      second_columns: [
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
                '<a href="http://sabio.h-its.org/reacdetails.jsp?reactid=' +
                params.value.reactionID +
                '" target="_blank" rel="noopener noreferrer">' +
                "SABIO-RK" +
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
          headerName: "Growth Phase",
          field: "growth_phase",
          filter: "agTextColumnFilter",
          hide: true
        },
        {
          headerName: "Conditions",
          field: "growth_conditions",
          filter: "agTextColumnFilter",
          hide: true
        },
        {
          headerName: "Media",
          field: "growth_media",
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
      }
    };

    this.formatReactionData = this.formatReactionData.bind(this);
    this.getSearchDataReaction = this.getSearchDataReaction.bind(this);
    this.setKmColumns = this.setKmColumns.bind(this);
  }

  setKmColumns(km_values) {
    let new_columns = [];
    let frameworkComponents = {
      taxonomyFilter: TaxonomyFilter,
      partialMatchFilter: PartialMatchFilter
    };
    frameworkComponents["statsToolPanel"] = (() => (
        <StatsToolPanel relevant_column={"kcat"} />
      ))
    for (var i = km_values.length - 1; i >= 0; i--) {
      new_columns.push({
        headerName: "Km " + km_values[i].split("_")[1] + " (M)",
        field: km_values[i],
        sortable: true,
        filter: "agNumberColumnFilter"
      });
      let comp_name = "CustomToolPanelReaction_" + km_values[i];
      sideBar["toolPanels"].push({
        id: km_values[i],
        labelDefault: "Km " + km_values[i].split("_")[1] + " (M)",
        labelKey: "customStats",
        iconKey: "customstats",
        toolPanel: comp_name
      })

      let km = km_values[i].toString()
      frameworkComponents[comp_name] = (() => (
        <StatsToolPanel relevant_column={km} />
      ));

    }

    let final_columns = this.state.first_columns
      .concat(new_columns)
      .concat(this.state.second_columns);
    //final_columns = final_columns.concat(default_second_columns)
    this.setState({
      columnDefs: final_columns,
      frameworkComponents: frameworkComponents
    });
  }
  componentDidMount() {
    this.getResultsData();
  }

  componentDidUpdate(prevProps) {
    const pathArgs = this.props.match.params;
    const oldPathArgs = prevProps.match.params;
    if (
      pathArgs.substrates !== oldPathArgs.substrates ||
      pathArgs.products !== oldPathArgs.products
    ) {
      this.setState({
        data_arrived: false,
        reactionMetadata: [],
        km_values: []
      });
      this.getResultsData();
    }
  }

  getMetaData() {
    const pathArgs = this.props.match.params;
    getDataFromApi([
      "reactions/kinlaw_by_name/?products=" +
        pathArgs.products +
        "&substrates=" +
        pathArgs.substrates +
        "&_from=0&size=1000&bound=tight"
    ])
      .then(response => {
        this.formatReactionMetadata(response.data);
      })
      .catch(err => {
        //alert('Nothing Found');
        this.setState({ orig_json: null });
      });
  }

  getResultsData() {
    const pathArgs = this.props.match.params;
    console.log(pathArgs.organism)

    getDataFromApi([
      "reactions/kinlaw_by_name/?products=" +
        pathArgs.products +
        "&substrates=" +
        pathArgs.substrates +
        "&_from=0&size=1000&bound=tight"
    ]).then(response => {
      this.formatReactionMetadata(response.data);
      this.formatReactionData(response.data);
    });
    getDataFromApi([
      "taxon",
      "canon_rank_distance_by_name/?name=" + pathArgs.organism
    ]).then(response => {
      //this.props.dispatch(setLineage(response.data));
      this.setState({ lineage: response.data });
    });
    //.catch(err => {
    //alert('Nothing Found');
    //this.setState({ orig_json: null });
    //});
  }

  formatReactionData(data) {
    console.log("ReactionPage: Calling formatReactionData");
    if (data != null) {
      var total_rows = [];
      let substrates = getSubstrates(data[0].reaction_participant[0].substrate);
      let km_values = [];
      for (var k = substrates.length - 1; k >= 0; k--) {
        km_values.push("km_" + substrates[k]);
      }
      this.setKmColumns(km_values);
      this.setState({ km_values: km_values });

      let start = 0;
      for (var i = start; i < data.length; i++) {
        let wildtype_mutant = null;
        if (data[i]["taxon_wildtype"] == "1") {
          wildtype_mutant = "wildtype";
        } else if (data[i]["taxon_wildtype"] == "0") {
          wildtype_mutant = "mutant";
        }
        let row = {
          kinlaw_id: data[i]["kinlaw_id"],
          kcat: getKcat(data[i].parameter)["kcat"],
          wildtype_mutant: wildtype_mutant,
          organism: data[i].taxon_name,
          ph: data[i].ph,
          temperature: data[i].temperature,
          source_link: { reactionID: getReactionID(data[i].resource) }
        };
        let row_with_km = Object.assign(
          {},
          row,
          getKm(data[i].parameter, substrates)
        );

        let has_data = false
        for (var l = km_values.length - 1; l >= 0; l--) {
          if ((row_with_km[km_values[l]]) != null){
            has_data = true
          }
        }
        if (row_with_km.kcat != null){
          has_data = true
        }
        if (has_data){
          total_rows.push(row_with_km);
        }
        //console.log(row_with_km)
      }

      this.props.dispatch(setTotalData(total_rows));
      this.setState({
        data_arrived: true
      });
    } else {
    }
  }

  getSearchDataReaction(url) {}

  formatReactionMetadata(data) {
    let newReactionMetadataDict = {};
    let start = 0;
    if (data != null) {
      let reactionID = getReactionID(data[0].resource);
      let ecNumber = getECNumber(data[0].resource)
      let new_dict = newReactionMetadataDict[reactionID];
      if (!new_dict) {
        new_dict = {};
      }
      let reaction_name = data[0]['enzymes'][0]['enzyme'][0]['enzyme_name']
      let substrates = getSubstrates(data[0].reaction_participant[0].substrate);
      let products = getProducts(data[0].reaction_participant[1].product);
      new_dict["reactionID"] = reactionID;
      new_dict["substrates"] = substrates;
      new_dict["products"] = products;
      if (ecNumber != "-.-.-.-"){
        new_dict["ecNumber"] = ecNumber
      }

      if (reaction_name){
        let start = reaction_name[0].toUpperCase()
        let end = reaction_name.substring(1,reaction_name.length)
        new_dict['reaction_name'] = start + end
      }

      let sub_inchis = getSubstrateInchiKey(
        data[0].reaction_participant[0].substrate
      );
      let prod_inchis = getProductInchiKey(
        data[0].reaction_participant[1].product
      );

      new_dict["equation"] = formatPart(substrates) + " → " + formatPart(products)
      newReactionMetadataDict[reactionID] = new_dict;
      //newReactionMetadataDict.push(meta);
    }

    this.setState({
      reactionMetadata: Object.keys(newReactionMetadataDict).map(function(key) {
        return newReactionMetadataDict[key];
      })
    });
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
    if (this.props.totalData == null || this.state.reactionMetadata.length===0) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }


    return (
      <div className="biochemical-entity-scene biochemical-entity-reaction-scene">
        <MetadataSection
          reactionMetadata={this.state.reactionMetadata}
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

export default withRouter(Reaction);