import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import { parseHistoryLocationPathname, isEmpty } from "~/utils/utils";

class MetadataSection extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    "entity-type": PropTypes.string.isRequired,
    "get-metadata-url": PropTypes.func.isRequired,
    "process-metadata": PropTypes.func.isRequired,
    "format-title": PropTypes.func.isRequired,
    "format-metadata": PropTypes.func.isRequired,
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.cancelTokenSource = null;

    this.state = { sections: [] };
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
        if (isEmpty(response.data)) {
          this.props.history.push("/*");
        } else {
          const processedMetadata = this.props["process-metadata"](
            response.data
          );
          const formattedMetadataSections = this.props["format-metadata"](
            processedMetadata,
            organism
          );
          this.props["set-scene-metadata"]({
            title: this.props["format-title"](processedMetadata),
            organism: organism,
            metadataSections: formattedMetadataSections,
            other: processedMetadata.other
          });
          this.setState({ sections: formattedMetadataSections });
        }
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
    return (
      <div>
        {this.state.sections.map(section => {
          return (
            <div className="content-block" id={section.id} key={section.id}>
              <h2 className="content-block-heading">{section.title}</h2>
              <div className="content-block-content">{section.content}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withRouter(MetadataSection);
