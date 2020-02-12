import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";
import { parseHistoryLocationPathname } from "~/utils/utils";
import { errorDialogRef } from "~/components/ErrorDialog/ErrorDialog";

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
      this.props["set-scene-metadata"](null);
      this.getMetadataFromApi();
    }
  }

  getMetadataFromApi() {
    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;
    const organism = route.organism;

    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }

    this.cancelDataTokenSource = axios.CancelToken.source();
    const url = this.props["get-metadata-url"](query, organism);
    getDataFromApi(
      [url],
      { cancelToken: this.cancelDataTokenSource.token },
      "Unable to get metadata about " +
        this.props["entity-type"] +
        " '" +
        query +
        "'."
    )
      .then(response => {
        if (
          response == null ||
          response === undefined ||
          typeof response === "string"
        ) {
          errorDialogRef.current.open(
            <span className="dialog-message-container">
              <span>
                We were unable to retrieve data about{" "}
                {this.props["entity-type"]} &apos;{query}&apos;
                {organism && " in " + organism}.
              </span>
              <span>
                We&apos;re sorry our server could not complete your request.
                Please try again, or contact us at{" "}
                <a href="mailto:info@karrlab.org">info@karrlab.org</a> if the
                problem persists.
              </span>
            </span>
          );
          return;
        }
        this.props["format-metadata"](response.data, organism);
      })
      .finally(() => {
        this.cancelDataTokenSource = null;
      });
  }

  render() {
    return <div></div>;
  }
}

export default withRouter(MetadataSection);
