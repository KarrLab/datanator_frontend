import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";
import { upperCaseFirstLetter, scrollTo } from "~/utils/utils";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import { setTotalData, setSelectedData } from "~/data/actions/resultsAction";

import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { StatsToolPanel } from "../StatsToolPanel/StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";
// import "./Reaction.scss";

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

function getReactionId(resources) {
  for (const resource of resources) {
    if (resource.namespace === "sabiork.reaction") {
      return resource.id;
    }
  }
}

function getEcNumber(resources) {
  for (const resource of resources) {
    if (resource.namespace === "ec-code") {
      return resource.id;
    }
  }
}

function getSubstrateNames(substrates) {
  const names = [];
  for (const substrate of substrates) {
    names.push(substrate.substrate_name);
  }
  return names;
}

function getProductNames(products) {
  const names = [];
  for (const product of products) {
    names.push(product.product_name);
  }
  return names;
}

function formatSide(parts) {
  return parts.join(' + ');
}

function getKcatValues(parameters) {
  for (const parameter of parameters) {
    if (parameter.name === "k_cat") {
      return parseFloat(parameter.value);
    }
  }
}

function getKmValues(parameters, substrates) {
  const kms = {};
  for (const parameter of parameters) {
    if (
      parameter.type === "27" &&
      substrates.includes(parameter.name) &&
      parameter.observed_name.toLowerCase() === "km"
    ) {
      kms["km_" + parameter.name] = parseFloat(parameter.value);
    }
  }
  return kms;
}

/*
reactionId
kcat
wildtypeMutant
organism
ph
temperature
*/
@connect(store => {
  return { allData: store.results.allData };
}) //the names given here will be the names of props
class Reaction extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      metadata: null,
      lineage: [],
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
          field: "kinLawId",
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
          headerName: "Source",
          field: "source",

          cellRenderer: function(params) {
            return (
              '<a href="http://sabio.h-its.org/reacdetails.jsp?reactid=' +
              params.value.reactionId +
              '" target="_blank" rel="noopener noreferrer">' +
              "SABIO-RK" +
              "</a>"
            );
          }
        }
      ],

      frameworkComponents: {}
    };
  }

  setKmColumns(km_values) {
    const new_columns = [];
    const frameworkComponents = {
      taxonomyFilter: TaxonomyFilter
    };
    frameworkComponents["statsToolPanel"] = () => (
      <StatsToolPanel col={"kcat"} />
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
        <StatsToolPanel col={km} />
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
        metadata: null,
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
        if (!response)
          return;
        this.formatMetadata(response.data);
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
      if (!response)
          return;
      this.formatMetadata(response.data);
      this.formatData(response.data);
    });

    if (pathArgs.organism) {
      getDataFromApi([
        "taxon",
        "canon_rank_distance_by_name/?name=" + pathArgs.organism
      ], {}, "Unable to get taxonomic information about '" + pathArgs.organism + "'.").then(response => {
        if (!response)
          return;
        //this.props.dispatch(setLineage(response.data));
        this.setState({ lineage: response.data });
      });
    }
  }

  formatData(data) {
    console.log("ReactionPage: Calling formatData");
    if (data != null) {
      const allData = [];
      const substrates = getSubstrateNames(
        data[0].reaction_participant[0].substrate
      );
      const km_values = [];
      for (const substrate of substrates) {
        km_values.push("km_" + substrate);
      }
      this.setKmColumns(km_values);

      for (const datum of data) {
        let wildtypeMutant = null;
        if (datum["taxon_wildtype"] === "1") {
          wildtypeMutant = "wildtype";
        } else if (datum["taxon_wildtype"] === "0") {
          wildtypeMutant = "mutant";
        }
        let row = {
          kinLawId: datum["kinlaw_id"],
          kcat: getKcatValues(datum.parameter),
          wildtypeMutant: wildtypeMutant,
          organism: datum.taxon_name,
          ph: datum.ph,
          temperature: datum.temperature,
          source: { reactionId: getReactionId(datum.resource) }
        };
        let row_with_km = Object.assign(
          {},
          row,
          getKmValues(datum.parameter, substrates)
        );

        let hasData = false;
        for (const km_value of km_values) {
          if (row_with_km[km_value] != null) {
            hasData = true;
          }
        }
        if (row_with_km.kcat != null) {
          hasData = true;
        }
        if (hasData) {
          allData.push(row_with_km);
        }
        //console.log(row_with_km)
      }

      this.props.dispatch(setTotalData(allData));
    }
  }

  formatMetadata(data) {
    if (data != null) {
      const metadata = {};

      const reactionId = getReactionId(data[0].resource);
      const ecNumber = getEcNumber(data[0].resource);      
      const name = data[0]["enzymes"][0]["enzyme"][0]["enzyme_name"];
      const substrates = getSubstrateNames(
        data[0].reaction_participant[0].substrate
      );
      const products = getProductNames(data[0].reaction_participant[1].product);
      metadata["reactionId"] = reactionId;
      metadata["substrates"] = substrates;
      metadata["products"] = products;
      if (ecNumber !== "-.-.-.-") {
        metadata["ecNumber"] = ecNumber;
      }

      if (name) {
        const start = name[0].toUpperCase();
        const end = name.substring(1, name.length);
        metadata["name"] = start + end;
      }

      metadata["equation"] =
        formatSide(substrates) + " → " + formatSide(products);

      this.setState({
        metadata: metadata,
      });
    }    
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
    const selectedNodes = event.api.getSelectedNodes();
    const selectedRows = [];    
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
      this.props.allData == null ||
      this.state.metadata == null
    ) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    let title = this.state.metadata.name;
    if (!title) {
      title = this.state.metadata.equation;
    }
    title = upperCaseFirstLetter(title);

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-reaction-scene">
        <h1 className="page-title">Reaction: {title}</h1>
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
                    <HashLink to="#rate-constants" scroll={scrollTo}>
                      Rate constants
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column section">        
            <MetadataSection metadata={this.state.metadata} />

            <div className="content-block measurements" id="rate-constants">
              <div className="content-block-heading-container">
                <h2 className="content-block-heading">Kinetic parameters</h2>
                <div className="content-block-heading-actions">
                  Export: <button className="text-button">CSV</button> | <button className="text-button">JSON</button>
                </div>
              </div>
              <div className="ag-theme-balham">
                <AgGridReact
                  modules={AllModules}
                  frameworkComponents={this.state.frameworkComponents}
                  sideBar={sideBar}
                  defaultColDef={defaultColDef}
                  columnDefs={this.state.columnDefs}
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

export default withRouter(Reaction);
