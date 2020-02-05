import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";
import {
  parseHistoryLocationPathname,
  upperCaseFirstLetter
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

    let title = this.state.metadata.geneName;
    if (!title) {
      title = this.state.metadata.proteinName;
    }
    title = upperCaseFirstLetter(title);

    const sections = [
      {
        id: "description",
        title: "Description"
      }
    ];

    this.props["set-scene-metadata"]({
      title: title,
      metadataSections: sections
    });
  }

  render() {
    const metadata = this.state.metadata;

    if (metadata == null || metadata === undefined) {
      return <div></div>;
    }

    return (
      <div>
        <div className="content-block" id="description">
          <h2 className="content-block-heading">Description</h2>
          <div className="content-block-content">
            {(metadata.geneName || metadata.proteinName) && (
              <ul className="key-value-list">
                {metadata.geneName && (
                  <li>
                    <b>Gene:</b> {metadata.geneName}
                  </li>
                )}
                {metadata.proteinName && (
                  <li>
                    <b>Protein:</b> {metadata.proteinName}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MetadataSection);
