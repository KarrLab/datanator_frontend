import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import { parseHistoryLocationPathname, downloadData } from "~/utils/utils";
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
    "get-col-defs": PropTypes.func.isRequired
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
    this.cancelTokenSource = null;

    this.sideBarDef = null;
    this.colDefs = null;
    this.state = {
      sideBarDef: this.sideBarDef,
      colDefs: this.colDefs,
      data: null
    };

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
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
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

    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    const url = this.props["get-data-url"](query, organism);
    this.cancelTokenSource = axios.CancelToken.source();
    axios
      .all([
        getDataFromApi([url], { cancelToken: this.cancelTokenSource.token }),
        organism
          ? getDataFromApi(
              ["taxon", "canon_rank_distance_by_name/?name=" + organism],
              { cancelToken: this.cancelTokenSource.token }
            )
          : null
      ])
      .then(
        axios.spread((...responses) => {
          this.formatData(
            responses[0].data,
            organism ? responses[1].data : null
          );
        })
      )
      .catch(
        genApiErrorHandler(
          [url],
          "Unable to retrieve " +
            this.props["data-type"] +
            " data about " +
            this.props["entity-type"] +
            " '" +
            query +
            "'."
        )
      )
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  static calcTaxonomicRanks(organismData) {
    const ranks = [];
    if (organismData[1]["rank"] === "species") {
      ranks.push("strain");
    } else if (organismData[1]["rank"] === "genus") {
      ranks.push("species");
    }
    for (let iLineage = 1; iLineage < organismData.length - 1; iLineage++) {
      const rank = organismData[iLineage]["rank"];
      ranks.push(rank);
    }
    ranks.push("cellular organisms");
    return ranks;
  }

  formatData(rawData, organismData) {
    let taxonomicRanks = [];
    if (organismData) {
      taxonomicRanks = DataTable.calcTaxonomicRanks(organismData);
    }
    const route = parseHistoryLocationPathname(this.props.history);
    const organism = route.organism;

    const formattedData = this.props["format-data"](
      rawData,
      organism,
      taxonomicRanks.length
    );
    this.sideBarDef = this.props["get-side-bar-def"](formattedData);
    this.colDefs = this.props["get-col-defs"](
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

  fitCols(event) {
    const gridApi = event.api;
    gridApi.sizeColumnsToFit();
    this.updateHorzScrolling(event);
  }

  updateHorzScrolling(event) {
    const grid = this.grid.current;
    const columnApi = event.columnApi;

    const gridRoot = grid.eGridDiv.getElementsByClassName("ag-root")[0];
    const gridWidth: number = gridRoot.offsetWidth;

    const displayedCols = columnApi.getAllDisplayedColumns();
    const numDisplayedCols: number = displayedCols.length;
    let totDisplayedColMinWidth = 0;
    for (const col of displayedCols) {
      totDisplayedColMinWidth += col.getActualWidth();
    }

    if (totDisplayedColMinWidth + 2 * (numDisplayedCols + 1) > gridWidth) {
      grid.gridOptions.suppressHorizontalScroll = false;
    } else {
      grid.gridOptions.suppressHorizontalScroll = true;
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
              domLayout="autoHeight"
              onGridSizeChanged={this.fitCols}
              onColumnVisible={this.fitCols}
              onColumnResized={this.updateHorzScrolling}
              onToolPanelVisibleChanged={this.fitCols}
              onFirstDataRendered={this.fitCols}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DataTable);
