import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import { setTotalData, setSelectedData } from "~/data/actions/resultsAction";

import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import StatsToolPanel from "./StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
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
      id: "stats-kcat",
      labelDefault: "k<sub>cat</sub>",
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

function getReactionID(resource) {
  for (let i = 0; i < resource.length; i++)
    if (resource[i].namespace === "sabiork.reaction") {
      return resource[i].id;
    }
}

function getECNumber(resource) {
  for (let i = 0; i < resource.length; i++)
    if (resource[i].namespace === "ec-code") {
      return resource[i].id;
    }
}

function getSubstrates(substrate) {
  const subNames = [];
  for (let i = 0; i < substrate.length; i++) {
    subNames.push(substrate[i].substrate_name);
  }
  return subNames;
}

function getProducts(product) {
  const subNames = [];
  for (let i = 0; i < product.length; i++) {
    subNames.push(product[i].product_name);
  }
  return subNames;
}

function formatPart(parts) {
  let participants_string = "";
  for (let i = parts.length - 1; i >= 0; i--) {
    participants_string = participants_string + parts[i] + " + ";
  }
  participants_string = participants_string.substring(
    0,
    participants_string.length - 3
  );
  return participants_string;
}

function getKcat(parameters) {
  const kinetic_params = {};
  for (let i = 0; i < parameters.length; i++) {
    if (parameters[i].name === "k_cat") {
      kinetic_params["kcat"] = parameters[i].value;
    }
  }
  return kinetic_params;
}

function getKm(parameters, substrates) {
  const kms = {};
  for (let i = 0; i < parameters.length; i++) {
    if (
      parameters[i].type === "27" &&
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
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      reactionMetadata: [],
      km_values: [],
      lineage: [],
      data_arrived: false,
      tanimoto: false,
      columnDefs: [],
      first_columns: [
        {
          headerName: "Kcat",
          field: "kcat",
          sortable: true,
          filter: "agNumberColumnFilter",
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true
        },
        {
          headerName: "SABIO-RK id",
          field: "kinlaw_id",
          filter: "agNumberColumnFilter",
          menuTabs: ["filterMenuTab"],

          cellRenderer: function(params) {
            return (
              '<a href="http://sabiork.h-its.org/newSearch/index?q=EntryID:' +
              params.value +
              '" target="_blank" rel="noopener noreferrer">' +
              params.value +
              "</a>"
            );
          }
        }
      ],
      second_columns: [
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
          headerName: "Growth phase",
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
        },
        {
          headerName: "Source",
          field: "source_link",

          cellRenderer: function(params) {
            return (
              '<a href="http://sabio.h-its.org/reacdetails.jsp?reactid=' +
              params.value.reactionID +
              '" target="_blank" rel="noopener noreferrer">' +
              "SABIO-RK" +
              "</a>"
            );
          }
        }
      ],

      frameworkComponents: {}
    };

    this.formatReactionData = this.formatReactionData.bind(this);
    this.setKmColumns = this.setKmColumns.bind(this);
  }

  setKmColumns(km_values) {
    const new_columns = [];
    const frameworkComponents = {
      taxonomyFilter: TaxonomyFilter
    };
    frameworkComponents["statsToolPanel"] = () => (
      <StatsToolPanel relevant-column={"kcat"} />
    );
    for (let i = km_values.length - 1; i >= 0; i--) {
      new_columns.push({
        headerName: "Km " + km_values[i].split("_")[1].toLowerCase() + " (M)",
        field: km_values[i],
        sortable: true,
        filter: "agNumberColumnFilter"
      });
      let comp_name = "CustomToolPanelReaction_" + km_values[i];
      sideBar["toolPanels"].push({
        id: km_values[i],
        labelDefault: "K<sub>M</sub> " + km_values[i].split("_")[1].toLowerCase(),
        labelKey: "chart",
        iconKey: "chart",
        toolPanel: comp_name
      });

      let km = km_values[i].toString();
      frameworkComponents[comp_name] = () => (
        <StatsToolPanel relevant-column={km} />
      );
    }

    const final_columns = this.state.first_columns
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
    ], {}, "Unable to get data about reaction.")
      .then(response => {
        this.formatReactionMetadata(response.data);
      })
      .catch(() => {
        //alert('Nothing Found');
        this.setState({ orig_json: null });
      });
  }

  getResultsData() {
    const pathArgs = this.props.match.params;
    console.log(pathArgs.organism);

    getDataFromApi([
      "reactions/kinlaw_by_name/?products=" +
        pathArgs.products +
        "&substrates=" +
        pathArgs.substrates +
        "&_from=0&size=1000&bound=tight"
    ], {}, "Unable to get data about reaction.").then(response => {
      this.formatReactionMetadata(response.data);
      this.formatReactionData(response.data);
    });
    if (pathArgs.organism) {
      getDataFromApi([
        "taxon",
        "canon_rank_distance_by_name/?name=" + pathArgs.organism
      ], {}, "Unable to get taxonomic information about '" + pathArgs.organism + "'.").then(response => {
        //this.props.dispatch(setLineage(response.data));
        this.setState({ lineage: response.data });
      });
      //.catch(err => {
      //alert('Nothing Found');
      //this.setState({ orig_json: null });
      //});
    }
  }

  formatReactionData(data) {
    console.log("ReactionPage: Calling formatReactionData");
    if (data != null) {
      const total_rows = [];
      const substrates = getSubstrates(
        data[0].reaction_participant[0].substrate
      );
      const km_values = [];
      for (let k = substrates.length - 1; k >= 0; k--) {
        km_values.push("km_" + substrates[k]);
      }
      this.setKmColumns(km_values);
      this.setState({ km_values: km_values });

      for (let i = 0; i < data.length; i++) {
        let wildtype_mutant = null;
        if (data[i]["taxon_wildtype"] === "1") {
          wildtype_mutant = "wildtype";
        } else if (data[i]["taxon_wildtype"] === "0") {
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

        let has_data = false;
        for (let l = km_values.length - 1; l >= 0; l--) {
          if (row_with_km[km_values[l]] != null) {
            has_data = true;
          }
        }
        if (row_with_km.kcat != null) {
          has_data = true;
        }
        if (has_data) {
          total_rows.push(row_with_km);
        }
        //console.log(row_with_km)
      }

      this.props.dispatch(setTotalData(total_rows));
      this.setState({
        data_arrived: true
      });
    }
  }

  formatReactionMetadata(data) {
    const newReactionMetadataDict = {};
    if (data != null) {
      const reactionID = getReactionID(data[0].resource);
      const ecNumber = getECNumber(data[0].resource);
      let new_dict = newReactionMetadataDict[reactionID];
      if (!new_dict) {
        new_dict = {};
      }
      const reaction_name = data[0]["enzymes"][0]["enzyme"][0]["enzyme_name"];
      const substrates = getSubstrates(
        data[0].reaction_participant[0].substrate
      );
      const products = getProducts(data[0].reaction_participant[1].product);
      new_dict["reactionID"] = reactionID;
      new_dict["substrates"] = substrates;
      new_dict["products"] = products;
      if (ecNumber !== "-.-.-.-") {
        new_dict["ecNumber"] = ecNumber;
      }

      if (reaction_name) {
        const start = reaction_name[0].toUpperCase();
        const end = reaction_name.substring(1, reaction_name.length);
        new_dict["reaction_name"] = start + end;
      }

      new_dict["equation"] =
        formatPart(substrates) + " → " + formatPart(products);
      newReactionMetadataDict[reactionID] = new_dict; //newReactionMetadataDict.push(meta);
    }

    this.setState({
      reactionMetadata: Object.keys(newReactionMetadataDict).map(function(key) {
        return newReactionMetadataDict[key];
      })
    });
  }

  onFirstDataRendered(params) {
    //params.columnApi.autoSizeColumns(['concentration'])

    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds);
    //params.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  onRowSelected(event) {
    const selectedRows = [];
    for (let i = event.api.getSelectedNodes().length - 1; i >= 0; i--) {
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
      this.props.totalData == null ||
      this.state.reactionMetadata.length === 0
    ) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-reaction-scene">
        <MetadataSection reactionMetadata={this.state.reactionMetadata} />

        <div className="content-block measurements-grid ag-theme-balham">
          <h2 className="content-block-heading">Kinetic parameters</h2>
          <AgGridReact
            modules={AllModules}
            frameworkComponents={this.state.frameworkComponents}
            sideBar={sideBar}
            defaultColDef={defaultColDef}
            columnDefs={this.state.columnDefs}
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

export default withRouter(Reaction);
