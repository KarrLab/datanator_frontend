import React, { Component } from "react";
import { withRouter } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";
import {
  upperCaseFirstLetter,
  scrollTo,
  parseHistoryLocationPathname
} from "~/utils/utils";
import { MetadataSection } from "./MetadataSection";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";

import "../BiochemicalEntityDetails.scss";

class Rna extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.cancelDataTokenSource = null;

    this.state = { metadata: null };
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
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      this.setState({ metadata: null });
      this.getMetadataFromApi();
    }
  }

  getMetadataFromApi() {
    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;

    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }

    this.cancelDataTokenSource = axios.CancelToken.source();
    getDataFromApi(
      [
        "/rna/halflife/get_info_by_protein_name/" +
          "?protein_name=" +
          query +
          "&_from=0" +
          "&size=1000"
      ],
      { cancelToken: this.cancelDataTokenSource.token },
      "Unable to get data about RNA '" + query + "'."
    )
      .then(response => {
        if (!response) return;
        this.formatMetadata(response.data);
      })
      .finally(() => {
        this.cancelDataTokenSource = null;
      });
  }

  formatMetadata(data) {
    const metadata = {};

    metadata.geneName = data[0].gene_name;

    if (data[0].function) {
      metadata.proteinName = data[0].function;
    } else if (data[0].protein_name) {
      metadata.proteinName = data[0].protein_name;
    } else {
      metadata.proteinName = "Protein Name not Found";
    }

    this.setState({ metadata: metadata });
  }

  getHalfLifeUrl(query) {
    return (
      "/rna/halflife/get_info_by_protein_name/" +
      "?protein_name=" +
      query +
      "&_from=0" +
      "&size=1000"
    );
  }

  formatHalfLifeData(rawData) {
    if (rawData != null && typeof rawData != "string") {
      const measurements = rawData[0].halflives;
      const formattedData = [];
      for (const measurement of measurements) {
        formattedData.push({
          halfLife: parseFloat(measurement.halflife),
          organism: measurement.species,
          growthMedium: measurement.growth_medium,
          source: measurement.reference[0].doi
        });
      }
      return formattedData;
    } else {
      return [];
    }
  }

  getHalfLifeSideBarDef() {
    return {
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
          toolPanel: "statsToolPanel",
          toolPanelParams: {
            col: ["halfLife"]
          }
        }
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false
    };
  }

  getHalfLifeColDefs() {
    return [
      {
        headerName: "Half-life (s^{-1})",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              Half-life (s<sup>-1</sup>)
            </span>
          )
        },
        field: "halfLife",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "agNumberColumnFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        headerName: "Organism",
        field: "organism",
        filter: "agSetColumnFilter"
      },
      /*
      {
        headerName: "Taxonomic distance",
        field: "taxonomicProximity",
        hide: true,
        filter: "taxonomyFilter",
        valueFormatter: params => {
          const value = params.value;
          return value;
      },
      */
      {
        headerName: "Media",
        field: "growthMedium",
        filter: "agTextColumnFilter",
        hide: false
      },
      {
        headerName: "Source",
        field: "source",
        cellRenderer: function(params) {
          return (
            '<a href="https://dx.doi.org/' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            "DOI" +
            "</a>"
          );
        },
        filterValueGetter: () => "DOI",
        filter: "agSetColumnFilter"
      }
    ];
  }

  formatHalfLifeColHeadings(event) {
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
            label.innerHTML.replace("s^{-1}", "s<sup>-1</sup>") +
            "</span>";
        }
      }
    }
  }

  render() {
    if (this.state.metadata == null) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;
    const organism = route.organism;

    let title = this.state.metadata.geneName;
    if (!title) {
      title = this.state.metadata.proteinName;
    }
    title = upperCaseFirstLetter(title);

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-rna-scene">
        <h1 className="page-title">RNA: {title}</h1>
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
                    <HashLink to="#half-life" scroll={scrollTo}>
                      Half-life
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column section">
            <MetadataSection
              metadata={this.state.metadata}
              rna={query}
              organism={organism}
            />

            <DataTable
              id="half-life"
              title="Half-life"
              entity-type="RNA"
              data-type="half-life"
              get-data-url={this.getHalfLifeUrl}
              format-data={this.formatHalfLifeData}
              get-side-bar-def={this.getHalfLifeSideBarDef}
              get-col-defs={this.getHalfLifeColDefs}
              format-col-headings={this.formatHalfLifeColHeadings}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Rna);
