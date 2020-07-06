import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import ScrollableAnchor from "react-scrollable-anchor";
import { Link } from "react-router-dom";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import axios from "axios";
import { parseHistoryLocationPathname } from "~/utils/utils";

class SearchResultsList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    "get-results-url": PropTypes.func.isRequired,
    "format-results": PropTypes.func.isRequired,
    "html-anchor-id": PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    "page-size": PropTypes.number,
  };

  static defaultProps = {
    "page-size": 10,
  };

  constructor(props) {
    super(props);

    this.unlistenToHistory = null;
    this.cancelTokenSource = null;
    this.pageCount = 0;
    this.results = null;

    this.state = {
      results: null,
      numResults: null,
      locationPathname: "",
    };

    this.formatResult = this.formatResult.bind(this);
  }

  componentDidMount() {
    this.setState({ locationPathname: this.props.history.location.pathname });
    this.unlistenToHistory = this.props.history.listen((location) => {
      if (location.pathname !== this.state.locationPathname) {
        this.setState({ locationPathname: location.pathname });
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
      const route = parseHistoryLocationPathname(this.props.history);
      this.query = route.query;
      this.organism = route.organism;
      this.pageCount = 0;
      this.results = null;
      this.setState({
        results: null,
        numResults: null,
      });
      this.fetchResults();
    }
  }

  fetchResults() {
    const url = this.props["get-results-url"](
      this.query,
      this.pageCount,
      this.props["page-size"]
    );

    // cancel earlier query
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    this.cancelTokenSource = axios.CancelToken.source();

    getDataFromApi(url, { cancelToken: this.cancelTokenSource.token })
      .then((response) => {
        this.pageCount++;

        this.updateResults(
          this.props["format-results"](response.data, this.organism)
        );
      })
      .catch(
        genApiErrorHandler.bind(
          null,
          url,
          "We were unable to conduct your search for '" + this.query + "'."
        )
      )
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  updateResults(newUnformattedResults) {
    const newResults = newUnformattedResults.results.map(this.formatResult);
    let results;
    if (this.results == null) {
      results = newResults;
    } else {
      results = this.results.concat(newResults);
    }
    this.results = results;

    this.setState({
      results: results,
      numResults: newUnformattedResults.numResults,
    });
  }

  formatResult(result, iResult) {
    return (
      <li key={this.pageCount * this.props["page-size"] + iResult}>
        <div className="search-result-title">
          <Link to={result.route}>{result.title}</Link>
        </div>
        <div className="search-result-description">{result.description}</div>
      </li>
    );
  }

  render() {
    const results = this.state.results;
    const numResults = this.state.numResults;
    const pageSize = this.props["page-size"];
    const numMore = Math.min(pageSize, numResults - pageSize * this.pageCount);

    return (
      <ScrollableAnchor id={this.props["html-anchor-id"]}>
        <div className="content-block section">
          <h2 className="content-block-heading">
            {this.props.title}
            {this.state.results
              ? " (" + this.state.results.length + " of " + numResults + ")"
              : ""}
          </h2>
          <div className="content-block-content">
            {results == null && <div className="loader"></div>}

            {results != null && (
              <div>
                {results.length > 0 && (
                  <ul className="search-results-list">{results}</ul>
                )}

                {results.length === 0 && (
                  <p className="no-search-results">No results found.</p>
                )}

                {results.length > 0 && numMore > 0 && (
                  <button
                    className="more-search-results-button"
                    type="button"
                    onClick={() => {
                      this.fetchResults();
                    }}
                  >
                    Load {numMore} more of {numResults}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollableAnchor>
    );
  }
}

export default withRouter(SearchResultsList);
