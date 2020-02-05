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
import { AbundanceDataTable } from "./AbundanceDataTable";

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

            <AbundanceDataTable
              uniprotIdToTaxonDist={this.state.metadata.uniprotIdToTaxonDist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Protein);
