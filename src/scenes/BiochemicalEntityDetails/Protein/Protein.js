import React, { Component } from "react";
import { withRouter } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";
import {
  upperCaseFirstLetter,
  scrollTo,
  parseHistoryLocationPathname,
  getNumProperties
} from "~/utils/utils";
import { MetadataSection } from "./MetadataSection";
import DataTable from "../DataTable/DataTable";

import "../BiochemicalEntityDetails.scss";

class Protein extends Component {
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
    const query = route.query;
    const organism = route.organism;

    // cancel earlier query
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    this.cancelTokenSource = axios.CancelToken.source();
    getDataFromApi(
      [
        "proteins",
        "proximity_abundance/proximity_abundance_kegg/" +
          "?kegg_id=" +
          query +
          "&anchor=" +
          organism +
          "&distance=40" +
          "&depth=40"
      ],
      { cancelToken: this.cancelTokenSource.token },
      "Unable to get data about ortholog group '" + query + "'."
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
    if (typeof data != "string") {
      const uniprotIdToTaxonDist = {};
      if (data != null && typeof data != "string") {
        for (const datum of data) {
          for (const doc of datum.documents) {
            if (doc.abundances !== undefined) {
              uniprotIdToTaxonDist[doc.uniprot_id] = datum.distance;
            }
          }
        }
      }

      this.setState({
        metadata: {
          koNumber: data[0].documents[0].ko_number,
          koName: data[0].documents[0].ko_name[0],
          uniprotIdToTaxonDist: uniprotIdToTaxonDist,
          uniprotIds: Object.keys(uniprotIdToTaxonDist)
        }
      });
    }
  }

  getAbundanceUrl() {
    if (this.state.metadata) {
      const queryArgs = this.state.metadata.uniprotIds
        .map(el => "uniprot_id=" + el)
        .join("&");
      return "proteins/meta/meta_combo/?" + queryArgs;
    }
  }

  formatAbundanceData(rawData) {
    if (rawData != null && typeof rawData != "string") {
      if (!(rawData[0].uniprot_id === "Please try another input combination")) {
        let start = 0;
        if (getNumProperties(rawData[0]) === 1) {
          start = 1;
        }

        const formattedData = [];
        for (const rawDatum of rawData.slice(start)) {
          if (rawDatum.abundances !== undefined) {
            for (const measurement of rawDatum.abundances) {
              let proteinName = rawDatum.protein_name;
              if (proteinName.includes("(")) {
                proteinName = proteinName.substring(
                  0,
                  proteinName.indexOf("(")
                );
              }

              formattedData.push({
                abundance: parseFloat(measurement.abundance),
                proteinName: proteinName,
                uniprotId: rawDatum.uniprot_id,
                geneSymbol: rawDatum.gene_name,
                organism: rawDatum.species_name,
                taxonomicProximity: this.state.metadata.uniprotIdToTaxonDist[
                  rawDatum.uniprot_id
                ],
                organ: measurement.organ
              });
            }
          }
        }
        return formattedData;
      }
    }
  }

  getAbundanceSideBarDef() {
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
            col: ["abundance"]
          }
        }
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false
    };
  }

  getAbundanceColDefs() {
    return [
      {
        headerName: "Abundance",
        field: "abundance",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "agNumberColumnFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        headerName: "Protein",
        field: "proteinName",
        filter: "agSetColumnFilter"
      },
      {
        headerName: "UniProt id",
        field: "uniprotId",
        cellRenderer: function(params) {
          return (
            '<a href="https://www.uniprot.org/uniprot/' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            params.value +
            "</a>"
          );
        }
      },
      {
        headerName: "Gene",
        field: "geneSymbol",
        filter: "agSetColumnFilter",
        hide: true
      },
      {
        headerName: "Organism",
        field: "organism",
        filter: "agSetColumnFilter"
      },
      {
        headerName: "Taxonomic distance",
        field: "taxonomicProximity",
        hide: true,
        filter: "taxonomyFilter"
      },
      {
        headerName: "Organ",
        field: "organ",
        filter: "agSetColumnFilter",
        hide: false
      },
      {
        headerName: "Source",
        field: "uniprotId",
        cellRenderer: function(params) {
          return (
            '<a href="https://pax-db.org/search?q=' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            "PAXdb" +
            "</a>"
          );
        },
        filterValueGetter: () => "PAXdb",
        filter: "agSetColumnFilter"
      }
    ];
  }

  render() {
    const route = parseHistoryLocationPathname(this.props.history);
    const organism = route.organism;

    if (this.state.metadata == null) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    let title = this.state.metadata.koName[0];
    title = upperCaseFirstLetter(title);

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-protein-scene">
        <h1 className="page-title">Protein: {title}</h1>
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
                    <HashLink to="#abundance" scroll={scrollTo}>
                      Abundance
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column section">
            <MetadataSection
              metadata={this.state.metadata}
              organism={organism}
            />

            <DataTable
              id="abundance"
              title="Abundance"
              entity-type="ortholog group"
              data-type="abundance"
              get-data-url={this.getAbundanceUrl.bind(this)}
              format-data={this.formatAbundanceData.bind(this)}
              get-side-bar-def={this.getAbundanceSideBarDef}
              get-col-defs={this.getAbundanceColDefs}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Protein);
