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

/*
wildtypeMutant
*/
class Reaction extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.cancelTokenSource = null;

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
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
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
    const substratesProducts = route.query.split("-->");
    const substrates = substratesProducts[0].trim();
    const products = substratesProducts[1].trim();

    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    this.cancelTokenSource = axios.CancelToken.source();
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
      { cancelToken: this.cancelTokenSource.token },
      "Unable to get data about reaction."
    )
      .then(response => {
        if (!response) return;
        this.formatMetadata(response.data);
      })
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  formatMetadata(data) {
    if (data != null) {
      const metadata = {};

      const reactionId = Reaction.getReactionId(data[0].resource);
      const ecNumber = Reaction.getEcNumber(data[0].resource);
      const name = data[0]["enzymes"][0]["enzyme"][0]["enzyme_name"];
      const substrates = Reaction.getSubstrateNames(
        data[0].reaction_participant[0].substrate
      );
      const products = Reaction.getProductNames(
        data[0].reaction_participant[1].product
      );
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
        Reaction.formatSide(substrates) + " → " + Reaction.formatSide(products);

      this.setState({ metadata: metadata });
    }
  }

  static getReactionId(resources) {
    for (const resource of resources) {
      if (resource.namespace === "sabiork.reaction") {
        return resource.id;
      }
    }
  }

  static getEcNumber(resources) {
    for (const resource of resources) {
      if (resource.namespace === "ec-code") {
        return resource.id;
      }
    }
  }

  static getSubstrateNames(substrates) {
    const names = [];
    for (const substrate of substrates) {
      names.push(substrate.substrate_name);
    }
    return names;
  }

  static getProductNames(products) {
    const names = [];
    for (const product of products) {
      names.push(product.product_name);
    }
    return names;
  }

  static formatSide(parts) {
    return parts.join(" + ");
  }

  getRateConstantsUrl(query) {
    const substratesProducts = query.split("-->");
    const substrates = substratesProducts[0].trim();
    const products = substratesProducts[1].trim();
    return (
      "reactions/kinlaw_by_name/" +
      "?substrates=" +
      substrates +
      "&products=" +
      products +
      "&_from=0" +
      "&size=1000" +
      "&bound=tight"
    );
  }

  formatRateConstantsData(rawData) {
    if (rawData != null) {
      const formattedData = [];

      for (const datum of rawData) {
        let wildtypeMutant = null;
        if (datum["taxon_wildtype"] === "1") {
          wildtypeMutant = "wildtype";
        } else if (datum["taxon_wildtype"] === "0") {
          wildtypeMutant = "mutant";
        }

        const formattedDatum = {
          kcat: Reaction.getKcatValues(datum.parameter),
          km: Reaction.getKmValues(datum.parameter),
          organism: datum.taxon_name,
          wildtypeMutant: wildtypeMutant,
          temperature: datum.temperature,
          ph: datum.ph,
          source: datum["kinlaw_id"]
        };

        if (
          formattedDatum.kcat != null ||
          Object.keys(formattedDatum.km).length > 0
        ) {
          formattedData.push(formattedDatum);
        }
      }

      return formattedData;
    }
  }

  static getKcatValues(parameters) {
    for (const parameter of parameters) {
      if (parameter.name === "k_cat") {
        return parseFloat(parameter.value);
      }
    }
  }

  static getKmValues(parameters) {
    const kms = {};
    for (const parameter of parameters) {
      if (
        parameter.type === 27 &&
        parameter.observed_name.toLowerCase() === "km"
      ) {
        kms[parameter.name] = parseFloat(parameter.value);
      }
    }
    return kms;
  }

  getConcRateConstantsBarDef(formattedData) {
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
          labelDefault: "Stats: k<sub>cat</sub> (s<sup>-1</sup>)",
          labelKey: "chart",
          iconKey: "chart",
          toolPanel: "statsToolPanel",
          toolPanelParams: {
            col: ["kcat"]
          }
        }
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false
    };

    // K_M tool panels
    let kmMets = {};
    for (const formattedDatum of formattedData) {
      for (const met in formattedDatum.km) {
        kmMets[met] = true;
      }
    }
    kmMets = Object.keys(kmMets);
    kmMets.sort();

    for (const kmMet of kmMets) {
      sideBar["toolPanels"].push({
        id: "stats-km-" + kmMet,
        labelDefault: "Stats: K<sub>M</sub> " + kmMet + " (M)",
        labelKey: "chart",
        iconKey: "chart",
        toolPanel: "statsToolPanel",
        toolPanelParams: {
          col: ["km", kmMet]
        }
      });
    }

    // return all tool panels
    return sideBar;
  }

  getRateConstantsColDefs(organism, formattedData) {
    const colDefs = [];

    // k_cat column
    let hasKcat = false;
    for (const formattedDatum of formattedData) {
      if (formattedDatum.kcat != null) {
        hasKcat = true;
        break;
      }
    }

    if (hasKcat) {
      colDefs.push({
        headerName: "k_{cat}",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              k<sub>cat</sub> (s<sup>-1</sup>)
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
      });
    }

    // K_M columns
    let kmMets = {};
    for (const formattedDatum of formattedData) {
      for (const kmMet in formattedDatum.km) {
        kmMets[kmMet] = true;
      }
    }
    kmMets = Object.keys(kmMets);
    kmMets.sort();

    for (const kmMet of kmMets) {
      colDefs.push({
        headerName: "K_M " + kmMet + " (M)",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              K<sub>M</sub> {kmMet} (M)
            </span>
          )
        },
        field: "km." + kmMet,
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "agNumberColumnFilter"
      });
    }

    // metadata columns
    colDefs.push({
      headerName: "Organism",
      field: "organism",
      filter: "agSetColumnFilter"
    });

    colDefs.push({
      headerName: "Variant",
      field: "wildtypeMutant",
      hide: true,
      filter: "agSetColumnFilter"
    });

    /*
    colDefs.push({
      headerName: "Taxonomic distance",
      field: "taxonomicProximity",
      hide: true,
      filter: "taxonomyFilter",
      valueFormatter: params => {
        const value = params.value;
        return value;
      }
    })
    */

    colDefs.push({
      headerName: "Temperature (C)",
      field: "temperature",
      cellRenderer: "numericCellRenderer",
      type: "numericColumn",
      filter: "agNumberColumnFilter"
    });

    colDefs.push({
      headerName: "pH",
      field: "ph",
      cellRenderer: "numericCellRenderer",
      type: "numericColumn",
      filter: "agNumberColumnFilter"
    });

    colDefs.push({
      headerName: "Source",
      field: "source",
      cellRenderer: function(params) {
        return (
          '<a href="http://sabiork.h-its.org/newSearch/index?q=EntryID:' +
          params.value +
          '" target="_blank" rel="noopener noreferrer">' +
          "SABIO-RK" +
          "</a>"
        );
      },
      filterValueGetter: () => "SABIO-RK",
      filter: "agSetColumnFilter"
    });

    // return column definitions
    return colDefs;
  }

  formatRateConstantsColHeadings(event) {
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
              .replace("k_{cat}", "k<sub>cat</sub>")
              .replace("K_M", "K<sub>M</sub>")
              .replace("s^{-1}", "s<sup>-1</sup>") +
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
            <MetadataSection
              metadata={this.state.metadata}
              reaction={query}
              organism={organism}
            />

            <DataTable
              id="rate-constants"
              title="Rate constants"
              entity-type="reaction"
              data-type="rate constants"
              get-data-url={this.getRateConstantsUrl}
              format-data={this.formatRateConstantsData}
              get-side-bar-def={this.getConcRateConstantsBarDef}
              get-col-defs={this.getRateConstantsColDefs}
              format-col-headings={this.formatRateConstantsColHeadings}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Reaction);
