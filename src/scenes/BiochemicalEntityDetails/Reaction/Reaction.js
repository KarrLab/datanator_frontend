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
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import { NumericCellRenderer } from "../NumericCellRenderer";
import { StatsToolPanel } from "../StatsToolPanel/StatsToolPanel.js";
import { TaxonomyFilter } from "~/scenes/BiochemicalEntityDetails/TaxonomyFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";

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
      toolPanel: "statsToolPanel",
      toolPanelParams: {
        col: "kcat"
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
  return parts.join(" + ");
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
      parameter.type === 27 &&
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
class Reaction extends Component {
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
      lineage: [],
      columnDefs: [],
      firstColumns: [
        {
          headerName: "Kcat",
          headerComponentFramework: HtmlColumnHeader,
          headerComponentParams: {
            name: (
              <span>
                k<sub>cat</sub>
              </span>
            )
          },
          field: "kcat",
          cellRenderer: "numericCellRenderer",
          type: "numericColumn",
          filter: "agNumberColumnFilter",
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true
        },
        {
          headerName: "SABIO-RK id",
          field: "kinLawId",
          menuTabs: ["filterMenuTab"],
          cellRenderer: function(params) {
            return (
              '<a href="http://sabiork.h-its.org/newSearch/index?q=EntryID:' +
              params.value +
              '" target="_blank" rel="noopener noreferrer">' +
              params.value +
              "</a>"
            );
          },
          filter: "agTextColumnFilter"
        }
      ],
      secondColumns: [
        {
          headerName: "Organism",
          field: "organism",
          filter: "agSetColumnFilter"
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
          },
          filter: "agSetColumnFilter"
        }
      ],

      frameworkComponents: {}
    };

    this.formatColumnHeadings = this.formatColumnHeadings.bind(this);
    this.sizeGridColumnsToFit = this.sizeGridColumnsToFit.bind(this);
    this.updateGridHorizontalScrolling = this.updateGridHorizontalScrolling.bind(
      this
    );
    this.onClickExportDataCsv = this.onClickExportDataCsv.bind(this);
    this.onClickExportDataJson = this.onClickExportDataJson.bind(this);
  }

  setKmColumns(kmValues) {
    const newColumns = [];
    const frameworkComponents = {
      htmlColumnHeader: HtmlColumnHeader,
      numericCellRenderer: NumericCellRenderer,
      taxonomyFilter: TaxonomyFilter,
      statsToolPanel: StatsToolPanel
    };

    for (const kmValue of kmValues) {
      const metabolite = kmValue.split("_")[1];
      newColumns.push({
        headerName: "Km " + metabolite + " (M)",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              K<sub>M</sub> {metabolite} (M)
            </span>
          )
        },
        field: kmValue,
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "agNumberColumnFilter"
      });

      sideBar["toolPanels"].push({
        id: kmValue,
        labelDefault: "K<sub>M</sub> " + metabolite,
        labelKey: "chart",
        iconKey: "chart",
        toolPanel: "statsToolPanel",
        toolPanelParams: {
          col: kmValue.toString()
        }
      });
    }

    const finalColumns = this.state.firstColumns
      .concat(newColumns)
      .concat(this.state.secondColumns);
    this.setState({
      columnDefs: finalColumns,
      frameworkComponents: frameworkComponents
    });
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
      this.setState({
        metadata: null,
        data: null
      });
      this.getResultsData();
    }
  }

  getResultsData() {
    const route = parseHistoryLocationPathname(this.props.history);
    const substratesProducts = route.query.split("-->");
    const substrates = substratesProducts[0].trim();
    const products = substratesProducts[1].trim();
    const organism = route.organism;

    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }

    this.cancelDataTokenSource = axios.CancelToken.source();
    getDataFromApi(
      [
        "reactions/kinlaw_by_name/" +
          "?substrates=" +
          substrates +
          "&products=" +
          products +
          "&_from=0" +
          "&size=1000" +
          "&bound=tight"
      ],
      { cancelToken: this.cancelDataTokenSource.token },
      "Unable to get data about reaction."
    )
      .then(response => {
        if (!response) return;
        this.formatMetadata(response.data);
        this.formatData(response.data);
      })
      .finally(() => {
        this.cancelDataTokenSource = null;
      });

    if (organism) {
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

  formatData(data) {
    if (data != null) {
      const allData = [];
      const substrates = getSubstrateNames(
        data[0].reaction_participant[0].substrate
      );
      const potentialKmValues = {};
      for (const substrate of substrates) {
        potentialKmValues["km_" + substrate] = false;
      }

      for (const datum of data) {
        let wildtypeMutant = null;
        if (datum["taxon_wildtype"] === "1") {
          wildtypeMutant = "wildtype";
        } else if (datum["taxon_wildtype"] === "0") {
          wildtypeMutant = "mutant";
        }
        const row = {
          kinLawId: datum["kinlaw_id"],
          kcat: getKcatValues(datum.parameter),
          wildtypeMutant: wildtypeMutant,
          organism: datum.taxon_name,
          ph: datum.ph,
          temperature: datum.temperature,
          source: { reactionId: getReactionId(datum.resource) }
        };
        const rowWithKm = Object.assign(
          {},
          row,
          getKmValues(datum.parameter, substrates)
        );

        let hasData = false;
        for (const KmValue of Object.keys(potentialKmValues)) {
          if (rowWithKm[KmValue] != null) {
            hasData = true;
            potentialKmValues[KmValue] = true;
          }
        }
        if (rowWithKm.kcat != null) {
          hasData = true;
        }
        if (hasData) {
          allData.push(rowWithKm);
        }
      }

      this.setKmColumns(
        Object.keys(potentialKmValues)
          .filter(function(k) {
            return potentialKmValues[k];
          })
          .map(String)
      );

      this.setState({
        data: allData
      });
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
        metadata: metadata
      });
    }
  }

  formatColumnHeadings(event) {
    const gridApi = event.api;
    const panelLabelClasses = {
      columns: "ag-column-tool-panel-column-label",
      filters: "ag-group-component-title"
    };
    for (const panelId in panelLabelClasses) {
      const panel = gridApi.getToolPanelInstance(panelId);
      const labels = panel.eGui.getElementsByClassName(
        panelLabelClasses[panelId]
      );
      for (const label of labels) {
        if (!label.innerHTML.startsWith("<span>")) {
          label.innerHTML =
            "<span>" +
            label.innerHTML
              .replace("Kcat", "k<sub>cat</sub>")
              .replace("Km", "K<sub>m</sub>") +
            "</span>";
        }
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
                    <HashLink to="#description" scroll={scrollTo}>
                      Description
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
                  frameworkComponents={this.state.frameworkComponents}
                  sideBar={sideBar}
                  defaultColDef={defaultColDef}
                  columnDefs={this.state.columnDefs}
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
                  onGridColumnsChanged={this.formatColumnHeadings}
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

export default withRouter(Reaction);
