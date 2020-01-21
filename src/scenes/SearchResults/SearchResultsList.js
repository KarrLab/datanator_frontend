import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function formatResult(result) {
  return (
    <li>
      <div className="search-result-title">
        <Link to={result.route}>{result.title}</Link>
      </div>
      <div className="search-result-description">{result.description}</div>
    </li>
  );
}

export default class SearchResultsList extends Component {
  static propTypes = {
    htmlAnchorId: PropTypes.string,
    title: PropTypes.string,
    showLoadMore: PropTypes.bool,
    fetchDataHandler: PropTypes.func,
    fetchDataKey: PropTypes.string,
    results: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      resultsHtml: null,
      pageCount: 0,
    };

    this.handleFetch = this.handleFetch.bind(this);
  }

  componentDidMount() {
    if (this.props.results != null) {
      this.formatResults();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.results !== prevProps.results &&
      this.props.results != null
    ) {
      this.formatResults();
    }
  }

  handleFetch(index) {
    this.props.fetchDataHandler(index, 10);
  }

  formatResults() {
    const resultsHtml = [];
    for (const result of this.props.results) {
      resultsHtml.push(formatResult(result));
    }

    this.setState({
      resultsHtml: resultsHtml
    });
  }

  render() {
    const results = this.state.resultsHtml;
    const showLoadMore = this.props.showLoadMore;
          
    return (
      <div className="content-block section" id={this.props.htmlAnchorId}>
        <h2 className="content-block-heading">{this.props.title} (XXX)</h2>
        <div className="content-block-content">
          {results == null && (
            <div className="loader"></div>
          )}

          {results != null && (
            <div>
              {results.length > 0 && (
                <ul className="search-results-list">{results}</ul>
              )}

              {results.length === 0 && (
                <p className="no-search-results">No results found</p>
              )}

              {results.length > 0 && showLoadMore && (
                <button
                  className="more-search-results-button"
                  type="button"
                  onClick={() => {
                    this.handleFetch(this.props.fetchDataKey);
                  }}
                >
                  Load 10 more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
