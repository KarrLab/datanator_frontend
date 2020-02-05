import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";
import {
  upperCaseFirstLetter,
  parseHistoryLocationPathname,
  removeDuplicates
} from "~/utils/utils";

class MetadataSection extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    "set-scene-metadata": PropTypes.func.isRequired
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
      this.props["set-scene-metadata"](null);
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

      const title = upperCaseFirstLetter(data[0].documents[0].ko_name[0]);

      const sections = [{ id: "description", title: "Description" }];

      this.props["set-scene-metadata"]({
        title: title,
        metadataSections: sections,
        uniprotIdToTaxonDist: uniprotIdToTaxonDist
      });
    }
  }

  render() {
    const metadata = this.state.metadata;

    if (metadata === undefined || metadata == null) {
      return <div></div>;
    }

    const uniprotIds = removeDuplicates(metadata.uniprotIds);
    uniprotIds.sort();

    const uniprotLinks = [];
    for (const uniprotId of uniprotIds) {
      uniprotLinks.push(
        <li key={uniprotId}>
          <a
            href={"https://www.uniprot.org/uniprot/" + uniprotId}
            target="_blank"
            rel="noopener noreferrer"
          >
            {uniprotId}
          </a>
        </li>
      );
    }

    return (
      <div>
        <div className="content-block" id="description">
          <h2 className="content-block-heading">Description</h2>
          <div className="content-block-content">
            <ul className="key-value-list link-list">
              <li>
                <b>Name:</b> {metadata.koName}
              </li>
              <li>
                <b>KEGG Orthology id:</b>{" "}
                <a
                  href={
                    "https://www.genome.jp/dbget-bin/www_bget?ko:" +
                    metadata.koNumber
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {metadata.koNumber}
                </a>
              </li>
              <li>
                <b>Proteins:</b>{" "}
                <ul className="comma-separated-list">{uniprotLinks}</ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MetadataSection);
