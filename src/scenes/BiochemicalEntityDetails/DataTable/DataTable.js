import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import { parseHistoryLocationPathname, downloadData } from "~/utils/utils";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { LicenseManager } from "@ag-grid-enterprise/core";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { SideBarModule } from "@ag-grid-enterprise/side-bar";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import { LinkCellRenderer } from "../LinkCellRenderer";
import { NumericCellRenderer } from "../NumericCellRenderer";
import { StatsToolPanel } from "../StatsToolPanel/StatsToolPanel";
import { TaxonomyFilter } from "../TaxonomyFilter";
import { TanimotoFilter } from "../TanimotoFilter";

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
    "get-col-defs": PropTypes.func.isRequired,
    "format-col-headings": PropTypes.func
  };

  static defaultProps = {
    "format-col-headings": null
  };

  static frameworkComponents = {
    htmlColumnHeader: HtmlColumnHeader,
    linkCellRenderer: LinkCellRenderer,
    numericCellRenderer: NumericCellRenderer,
    statsToolPanel: StatsToolPanel,
    taxonomyFilter: TaxonomyFilter,
    tanimotoFilter: TanimotoFilter
  };

  static defaultColDef = {
    minWidth: 100,
    filter: "agTextColumnFilter",
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
    this.cancelDataTokenSource = null;
    this.cancelTaxonInfoTokenSource = null;

    this.sideBarDef = null;
    this.colDefs = null;
    this.taxonLineage = [];
    this.state = {
      sideBarDef: this.sideBarDef,
      colDefs: this.colDefs,
      taxonLineage: this.taxonLineage,
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
    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }
    if (this.cancelTaxonInfoTokenSource) {
      this.cancelTaxonInfoTokenSource.cancel();
    }
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      this.sideBarDef = null;
      this.colDefs = null;
      this.taxonLineage = [];
      this.setState({
        sideBarDef: this.sideBarDef,
        colDefs: this.colDefs,
        taxonLineage: this.taxonLineage,
        data: null
      });
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;
    const organism = route.organism;

    // cancel earlier query
    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }

    const url = this.props["get-data-url"](query, organism);
    this.cancelDataTokenSource = axios.CancelToken.source();
    getDataFromApi([url], { cancelToken: this.cancelDataTokenSource.token })
      .then(response => {
        this.formatData(response.data);
      })
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
        this.cancelDataTokenSource = null;
      });

    if (organism) {
      // cancel earlier query
      if (this.cancelTaxonInfoTokenSource) {
        this.cancelTaxonInfoTokenSource.cancel();
      }

      this.cancelTaxonInfoTokenSource = axios.CancelToken.source();
      getDataFromApi(
        ["taxon", "canon_rank_distance_by_name/?name=" + organism],
        { cancelToken: this.cancelTaxonInfoTokenSource.token }
      )
        .then(response => {
          this.taxonLineage = response.data;
          if (this.colDefs != null) {
            this.colDefs = this.colDefs.slice();
            for (const colDef of this.colDefs) {
              if (colDef.filter === "taxonomyFilter") {
                colDef["filterParams"] = {
                  taxonLineage: this.taxonLineage
                };
                break;
              }
            }
            this.setState({
              colDefs: this.colDefs,
              taxonLineage: this.taxonLineage
            });
          } else {
            this.setState({
              taxonLineage: this.taxonLineage
            });
          }
        })
        .catch(
          genApiErrorHandler(
            ["taxon", "canon_rank_distance_by_name/?name=" + organism],
            "Unable to obtain taxonomic information about '" + organism + "'."
          )
        )
        .finally(() => {
          this.cancelTaxonInfoTokenSource = null;
        });
    }
  }

  formatData(rawData) {
    const route = parseHistoryLocationPathname(this.props.history);
    const organism = route.organism;

    const formattedData = this.props["format-data"](rawData);
    this.sideBarDef = this.props["get-side-bar-def"](formattedData);
    this.colDefs = this.props["get-col-defs"](organism, formattedData);

    for (const colDef of this.colDefs) {
      if (colDef.filter === "taxonomyFilter") {
        colDef["filterParams"] = {
          taxonLineage: this.taxonLineage
        };
        break;
      }
    }

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
        <div className="biochemical-entity-data-table ag-theme-balham">
          <AgGridReact
            ref={this.grid}
            modules={[
              ClientSideRowModelModule,
              CsvExportModule,
              LicenseManager,
              ColumnsToolPanelModule,
              FiltersToolPanelModule,
              SetFilterModule,
              SideBarModule
              ]}
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
            onGridColumnsChanged={this.props["format-col-headings"]}
            onGridSizeChanged={this.fitCols}
            onColumnVisible={this.fitCols}
            onColumnResized={this.updateHorzScrolling}
            onToolPanelVisibleChanged={this.fitCols}
            onFirstDataRendered={this.fitCols}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default withRouter(DataTable);
