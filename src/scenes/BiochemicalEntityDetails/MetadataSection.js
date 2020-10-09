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
    "set-scene-metadata": PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.queryCancelTokenSource = null;
    this.taxonCancelTokenSource = null;

    this.state = { sections: [] };
  }

  componentDidMount() {
    this.locationPathname = this.props.history.location.pathname;
    this.unlistenToHistory = this.props.history.listen((location) => {
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
    if (this.queryCancelTokenSource) {
      this.queryCancelTokenSource.cancel();
    }
    if (this.taxonCancelTokenSource) {
      this.taxonCancelTokenSource.cancel();
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

    if (this.queryCancelTokenSource) {
      this.queryCancelTokenSource.cancel();
    }

    if (this.taxonCancelTokenSource) {
      this.taxonCancelTokenSource.cancel();
    }

    if (!query) {
      return;
    }

    this.queryCancelTokenSource = axios.CancelToken.source();
    const queryUrl = this.props["get-metadata-url"](query, organism);
    if (!queryUrl) {
      const formattedMetadataSections = [
        {
          id: "id",
          title: "Id",
          content: query,
        },
      ];
      this.props["set-scene-metadata"]({
        error404: false,
        title: query,
        organism: organism,
        metadataSections: formattedMetadataSections,
        other: undefined,
      });
      this.setState({ sections: formattedMetadataSections });
      return;
    }

    if (organism) {
      this.taxonCancelTokenSource = axios.CancelToken.source();
    }
    const taxonUrl = "taxon/canon_rank_distance_by_name/?name=" + organism;
    axios
      .all([
        getDataFromApi(queryUrl, {
          cancelToken: this.queryCancelTokenSource.token,
        }),
        organism
          ? getDataFromApi(taxonUrl, {
              cancelToken: this.taxonCancelTokenSource.token,
            })
          : null,
      ])
      .then(
        axios.spread((...responses) => {
          const queryResponse = responses[0];
          if (
            isEmpty(queryResponse.data) ||
            queryResponse.data === "Record request exceeds limit"
          ) {
            this.props["set-scene-metadata"]({
              error404: true,
            });
          } else {
            const processedMetadata = this.props["process-metadata"](
              query,
              organism,
              queryResponse.data
            );
            if (processedMetadata == null) {
              this.props["set-scene-metadata"]({
                error404: true,
              });
            } else {
              const formattedMetadataSections = this.props["format-metadata"](
                query,
                organism,
                processedMetadata
              );
              this.props["set-scene-metadata"]({
                error404: false,
                title: this.props["format-title"](processedMetadata),
                organism: organism,
                metadataSections: formattedMetadataSections,
                other: processedMetadata.other,
              });
              this.setState({ sections: formattedMetadataSections });
            }
          }
        })
      )
      .catch((error) => {
        if (
          "response" in error &&
          error.response !== undefined &&
          "request" in error.response &&
          error.response.request.constructor.name === "XMLHttpRequest"
        ) {
          const response = error.response;
          if ([404, 500].includes(response.status)) {
            this.props["set-scene-metadata"]({
              error404: true,
            });
            return;
          }
        }

        genApiErrorHandler(
          queryUrl,
          "Unable to get metadata about " +
            this.props["entity-type"] +
            " '" +
            query +
            "'.",
          error
        );
      })
      .finally(() => {
        this.queryCancelTokenSource = null;
        this.taxonCancelTokenSource = null;
      });
  }

  render() {
    if (this.state.sections?.length) {
      return (
        <div>
          {this.state.sections.map((section) => {
            return (
              <div className="content-block" id={section.id} key={section.id}>
                <h2 className="content-block-heading">{section.title}</h2>
                <div className="content-block-content">{section.content}</div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default withRouter(MetadataSection);
