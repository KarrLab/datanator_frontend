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
import { RateConstantsDataTable } from "./RateConstantsDataTable";

import "../BiochemicalEntityDetails.scss";

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
      const ecNumber = Reaction.getEcNum(data[0].resource);
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

  static getEcNum(resources) {
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

            <RateConstantsDataTable />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Reaction);
