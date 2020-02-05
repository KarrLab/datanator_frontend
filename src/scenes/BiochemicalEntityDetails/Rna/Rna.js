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
import { HalfLifeDataTable } from "./HalfLifeDataTable";

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

            <HalfLifeDataTable />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Rna);
