import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import { parseHistoryLocationPathname } from "~/utils/utils";

class MetadataSection extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    "entity-type": PropTypes.string.isRequired,
    "get-metadata-url": PropTypes.func.isRequired,
    "format-metadata": PropTypes.func.isRequired,
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

    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    this.cancelTokenSource = axios.CancelToken.source();
    const url = this.props["get-metadata-url"](query, organism);
    getDataFromApi([url], { cancelToken: this.cancelTokenSource.token })
      .then(response => {
        this.props["format-metadata"](response.data, organism);
      })
      .catch(
        genApiErrorHandler(
          [url],
          "Unable to get metadata about " +
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

  render() {
    return <div></div>;
  }
}

export default withRouter(MetadataSection);
