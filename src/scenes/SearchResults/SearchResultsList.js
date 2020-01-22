import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import { getDataFromApi } from "~/services/RestApi";
import axios from "axios";
const queryString = require("query-string");

class SearchResultsList extends Component {
  static propTypes = {
    history: PropTypes.object,
    "get-results-url": PropTypes.func,
    "get-results": PropTypes.func,
    "get-num-results": PropTypes.func,
    "format-results": PropTypes.func,
    "html-anchor-id": PropTypes.string,
    title: PropTypes.string,
    "page-size": PropTypes.number
  };

  static defaultProps = {
    "page-size": 10
  };

  constructor(props) {
    super(props);

    this.unlistenToHistory = null;
    this.cancelTokenSource = null;

    this.state = {
      formattedResults: null,
      numResults: null,
      pageCount: 0
    };

    this.updateStateFromLocation = this.updateStateFromLocation.bind(this);
    this.formatResults = this.formatResults.bind(this);
    this.formatResult = this.formatResult.bind(this);
  }

  componentDidMount() {
    this.unlistenToHistory = this.props.history.listen(() => {
      this.updateStateFromLocation();
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
      const values = queryString.parse(this.props.history.location.search);
      this.query = values.q;
      this.organism = values.organism;
      this.setState({
        formattedResults: null,
        numResults: null,
        pageCount: 0
      });
      this.fetchResults();
    }
  }

  fetchResults() {
    const url = this.props["get-results-url"](
      this.query,
      this.state.pageCount,
      this.props["page-size"]
    );

    // cancel earlier query
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    this.cancelTokenSource = axios.CancelToken.source();
    getDataFromApi([url], { cancelToken: this.cancelTokenSource.token })
      .then(response => {
        const results = this.props["get-results"](response.data);
        this.formatResults(results);

        this.setState({
          numResults: this.props["get-num-results"](response.data)
        });
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          // TODO: handle error
          console.log(error);
        }
      })
      .finally(() => {
        this.cancelTokenSource = null;
      });
    this.setState({ pageCount: this.state.pageCount + 1 });
  }

  formatResults(newResults) {
    const newFormattedResults = this.props["format-results"](
      newResults,
      this.organism
    ).map(this.formatResult);

    let formattedResults;
    if (this.state.formattedResults == null) {
      formattedResults = newFormattedResults;
    } else {
      formattedResults = this.state.formattedResults.concat(
        newFormattedResults
      );
    }
    this.setState({ formattedResults: formattedResults });
  }

  formatResult(result, iResult) {
    return (
      <li key={this.state.pageCount * this.props["page-size"] + iResult}>
        <div className="search-result-title">
          <Link to={result.route}>{result.title}</Link>
        </div>
        <div className="search-result-description">{result.description}</div>
      </li>
    );
  }

  render() {
    const results = this.state.formattedResults;
    const numResults = this.state.numResults;
    const pageSize = this.props["page-size"];
    const numMore = Math.min(
      pageSize,
      numResults - pageSize * this.state.pageCount
    );

    return (
      <div className="content-block section" id={this.props["html-anchor-id"]}>
        <h2 className="content-block-heading">
          {this.props.title} ({numResults})
        </h2>
        <div className="content-block-content">
          {results == null && <div className="loader"></div>}

          {results != null && (
            <div>
              {results.length > 0 && (
                <ul className="search-results-list">{results}</ul>
              )}

              {results.length === 0 && (
                <p className="no-search-results">No results found</p>
              )}

              {results.length > 0 && numMore > 0 && (
                <button
                  className="more-search-results-button"
                  type="button"
                  onClick={() => {
                    this.fetchResults();
                  }}
                >
                  Load {numMore} more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(SearchResultsList);
