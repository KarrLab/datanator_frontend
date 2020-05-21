import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import {
  parseHistoryLocationPathname,
  downloadData,
  isEmpty
} from "~/utils/utils";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import { LinkCellRenderer } from "../LinkCellRenderer";
import { NumericCellRenderer } from "../NumericCellRenderer";
import { ToolPanels } from "../ToolPanels";
import { ColumnsToolPanel } from "../ColumnsToolPanel/ColumnsToolPanel";
import { FiltersToolPanel } from "../FiltersToolPanel/FiltersToolPanel";
import { StatsToolPanel } from "../StatsToolPanel/StatsToolPanel";
import { NumberFilter } from "../NumberFilter";
import { TaxonomyFilter } from "../TaxonomyFilter";
import { TextFilter } from "../TextFilter";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "./DataTable.scss";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const IS_TEST = process.env.NODE_ENV.startsWith("test");

class DataTable extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    "entity-type": PropTypes.string.isRequired,
    "data-type": PropTypes.string.isRequired,
    "get-data-url": PropTypes.func.isRequired,
    "format-data": PropTypes.func.isRequired,
    "get-side-bar-def": PropTypes.func.isRequired,
    "get-col-defs": PropTypes.func.isRequired,
    "get-col-sort-order": PropTypes.func.isRequired,
    "dom-layout": PropTypes.string,
    "set-scene-metadata": PropTypes.func.isRequired
  };

  static defaultProps = {
    "dom-layout": "autoHeight"
  };

  static frameworkComponents = {
    htmlColumnHeader: HtmlColumnHeader,
    linkCellRenderer: LinkCellRenderer,
    numericCellRenderer: NumericCellRenderer,
    columnsToolPanel: ColumnsToolPanel,
    filtersToolPanel: FiltersToolPanel,
    statsToolPanel: StatsToolPanel,
    textFilter: TextFilter,
    taxonomyFilter: TaxonomyFilter,
    numberFilter: NumberFilter
  };

  static defaultColDef = {
    minWidth: 100,
    filter: "textFilter",
    sortable: true,
    resizable: true,
    suppressMenu: true
  };

  static exportParams = {
    allColumns: true,
    onlySelected: false
  };

  constructor() {
    super();

    this.grid = React.createRef();

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.queryCancelTokenSource = null;
    this.taxonCancelTokenSource = null;

    this.sideBarDef = null;
    this.colDefs = null;
    this.colSortOrder = null;
    this.state = {
      sideBarDef: this.sideBarDef,
      colDefs: this.colDefs,
      data: null
    };

    this.onFirstDataRendered = this.onFirstDataRendered.bind(this);
    this.fitCols = this.fitCols.bind(this);
    this.updateHorzScrolling = this.updateHorzScrolling.bind(this);
    this.exportCsv = this.exportCsv.bind(this);
    this.exportJson = this.exportJson.bind(this);
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
    if (this.queryCancelTokenSource) {
      this.queryCancelTokenSource.cancel();
    }
    if (this.taxonCancelTokenSource) {
      this.taxonCancelTokenSource.cancel();
    }
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      this.sideBarDef = null;
      this.colDefs = null;
      this.setState({
        sideBarDef: this.sideBarDef,
        colDefs: this.colDefs,
        data: null
      });
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;
    const organism = route.organism;

    if (this.queryCancelTokenSource) {
      this.queryCancelTokenSource.cancel();
    }
    if (this.taxonCancelTokenSource) {
      this.taxonCancelTokenSource.cancel();
    }

    const url = this.props["get-data-url"](query, organism);
    const taxonUrl = "taxon/canon_rank_distance_by_name/?name=" + organism;
    this.queryCancelTokenSource = axios.CancelToken.source();
    if (organism) {
      this.taxonCancelTokenSource = axios.CancelToken.source();
    }
    axios
      .all([
        getDataFromApi([url], {
          cancelToken: this.queryCancelTokenSource.token
        }),
        organism
          ? getDataFromApi([taxonUrl], {
              cancelToken: this.taxonCancelTokenSource.token
            })
          : null
      ])
      .then(
        axios.spread((...responses) => {
          if (isEmpty(responses[0].data)) {
            this.setState({
              data: []
            });
          } else {
            this.formatData(
              responses[0].data,
              organism ? responses[1].data : null
            );
          }
        })
      )
      .catch(error => {
        if (
          "response" in error &&
          "request" in error.response &&
          error.response.request.constructor.name === "XMLHttpRequest"
        ) {
          const response = error.response;
          if (
            response.config.url.endsWith(taxonUrl) &&
            response.status === 500
          ) {
            this.props["set-scene-metadata"]({
              error404: true
            });
          } else {
            genApiErrorHandler(
              [url],
              "Unable to retrieve " +
                this.props["data-type"] +
                " data about " +
                this.props["entity-type"] +
                " '" +
                query +
                "'."
            )(error);
          }
        } else if (!axios.isCancel(error) && (IS_DEVELOPMENT || IS_TEST)) {
          console.error(error);
        }
      })
      .finally(() => {
        this.queryCancelTokenSource = null;
        this.taxonCancelTokenSource = null;
      });
  }

  static calcTaxonomicRanks(organismData) {
    const ranks = [];
    for (let iLineage = 0; iLineage < organismData.length; iLineage++) {
      const lineage = organismData[iLineage];
      let rank;
      if ("rank" in lineage) {
        rank = lineage["rank"];
      } else if (iLineage === organismData.length - 1) {
        rank = "cellular organisms";
      } else if (organismData[iLineage + 1].rank === "species") {
        rank = "strain";
      } else if (organismData[iLineage + 1].rank === "genus") {
        rank = "species";
      } else if (organismData[iLineage + 1].rank === "family") {
        rank = "genus";
      } else if (organismData[iLineage + 1].rank === "order") {
        rank = "family";
      } else if (organismData[iLineage + 1].rank === "class") {
        rank = "order";
      } else if (organismData[iLineage + 1].rank === "phylum") {
        rank = "class";
      } else if (organismData[iLineage + 1].rank === "superkingdom") {
        rank = "phylum";
      }
      ranks.push(rank);
    }
    return ranks;
  }

  static calcTaxonomicDistance(taxonDistance, targetSpecies, measuredSpecies) {
    let distance = null;

    if (targetSpecies === measuredSpecies) {
      distance = 0;
    } else if (
      targetSpecies + "_canon_ancestors" in taxonDistance &&
      measuredSpecies + "_canon_ancestors" in taxonDistance
    ) {
      const toAncestors = taxonDistance[targetSpecies + "_canon_ancestors"];
      const fromAncestors = taxonDistance[measuredSpecies + "_canon_ancestors"];
      toAncestors.push(targetSpecies);
      fromAncestors.push(measuredSpecies);
      distance = 0;
      for (
        let iLineage = 0;
        iLineage < Math.min(toAncestors.length, fromAncestors.length);
        iLineage++
      ) {
        if (toAncestors[iLineage] !== fromAncestors[iLineage]) {
          distance = toAncestors.length - iLineage;
          break;
        }
      }
    } else {
      distance = null;
    }

    return distance;
  }

  static shouldTableRender(data) {
    let render = null;
    if (data) {
      if (data.length) {
        render = true;
      } else {
        render = false;
      }
    } else {
      render = true;
    }
    return render;
  }

  formatData(rawData, organismData) {
    let taxonomicRanks = [];
    if (organismData) {
      taxonomicRanks = DataTable.calcTaxonomicRanks(organismData);
    }
    const route = parseHistoryLocationPathname(this.props.history);
    const organism = route.organism;

    const formattedData = this.props["format-data"](rawData, organism);
    this.sideBarDef = this.props["get-side-bar-def"](formattedData);
    this.colDefs = this.props["get-col-defs"](
      organism,
      formattedData,
      taxonomicRanks
    );
    this.colSortOrder = this.props["get-col-sort-order"](
      organism,
      formattedData,
      taxonomicRanks
    );

    this.setState({
      sideBarDef: this.sideBarDef,
      colDefs: this.colDefs,
      data: formattedData
    });
  }

  onFirstDataRendered(event) {
    this.setDefaultSorting(event);
    this.fitCols(event);
  }

  setDefaultSorting(event) {
    const gridApi = event.api;

    const model = [];
    for (const colId of this.colSortOrder) {
      model.push({
        colId: colId,
        sort: "asc"
      });
    }
    gridApi.setSortModel(model);
  }

  fitCols(event) {
    const gridApi = event.api;
    gridApi.sizeColumnsToFit();
    this.updateHorzScrolling(event);
  }

  updateHorzScrolling(event) {
    const columnApi = event.columnApi;

    const gridRoot = event.api.gridPanel.eGui;
    const gridWidth: number = gridRoot.offsetWidth;

    const displayedCols = columnApi.getAllDisplayedColumns();
    const numDisplayedCols: number = displayedCols.length;
    let totDisplayedColMinWidth = 0;
    for (const col of displayedCols) {
      totDisplayedColMinWidth += col.getActualWidth();
    }

    const gridOptions = event.api.gridOptionsWrapper.gridOptions;
    if (totDisplayedColMinWidth + 2 * (numDisplayedCols + 1) > gridWidth) {
      gridOptions.suppressHorizontalScroll = false;
    } else {
      gridOptions.suppressHorizontalScroll = true;
    }
  }

  exportCsv() {
    const gridApi = this.grid.current.api;
    gridApi.exportDataAsCsv(DataTable.exportParams);
  }

  exportJson() {
    downloadData(
      JSON.stringify(this.state.data),
      "data.json",
      "application/json"
    );
  }

  render() {
    if (DataTable.shouldTableRender(this.state.data)) {
      return (
        <div className="content-block" id={this.props.id}>
          <div className="content-block-heading-container">
            <h2 className="content-block-heading">{this.props.title}</h2>
            <div className="content-block-heading-actions">
              Export:{" "}
              <button className="text-button" onClick={this.exportCsv}>
                CSV
              </button>{" "}
              |{" "}
              <button className="text-button" onClick={this.exportJson}>
                JSON
              </button>
            </div>
          </div>
          <div className="biochemical-entity-data-table">
            <ToolPanels agGridReactRef={this.grid} />
            <div className="ag-theme-balham">
              <AgGridReact
                ref={this.grid}
                modules={[ClientSideRowModelModule, CsvExportModule]}
                frameworkComponents={DataTable.frameworkComponents}
                sideBar={this.state.sideBarDef}
                defaultColDef={DataTable.defaultColDef}
                columnDefs={this.state.colDefs}
                rowData={this.state.data}
                rowSelection="multiple"
                groupSelectsChildren={true}
                suppressMultiSort={true}
                suppressAutoSize={true}
                suppressMovableColumns={true}
                suppressCellSelection={true}
                suppressRowClickSelection={true}
                suppressContextMenu={true}
                domLayout={this.props["dom-layout"]}
                onGridSizeChanged={this.fitCols}
                onColumnVisible={this.fitCols}
                onColumnResized={this.updateHorzScrolling}
                onToolPanelVisibleChanged={this.fitCols}
                onFirstDataRendered={this.onFirstDataRendered}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="content-block" id={this.props.id}>
          <div className="content-block-heading-container">
            <h2 className="content-block-heading">{this.props.title}</h2>
          </div>
          <div className="content-block-content">No data is available.</div>
        </div>
      );
    }
  }

  static numericComparator(valueA, valueB) {
    if (valueA == null) {
      if (valueB == null) {
        return 0;
      } else {
        return 1;
      }
    } else {
      if (valueB == null) {
        return -1;
      } else {
        return valueA - valueB;
      }
    }
  }
}

export default withRouter(DataTable);
