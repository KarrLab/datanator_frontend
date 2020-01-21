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
    showLoadMoreMetabolites: PropTypes.bool,
    showLoadMoreProteins: PropTypes.bool,
    showLoadMoreReactions: PropTypes.bool,

    fetchDataHandler: PropTypes.func,

    metaboliteResults: PropTypes.array,
    proteinResults: PropTypes.array,
    reactionResults: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      metaboliteResults: null,
      proteinResults: null,
      reactionResults: null,
    };

    this.handleFetch = this.handleFetch.bind(this);
  }

  componentDidMount() {
    if (this.props.metaboliteResults != null) {
      this.addMetabolites();
    }

    if (this.props.proteinResults != null) {
      this.addProteins();
    }

    if (this.props.reactionResults != null) {
      this.addReactions();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.metaboliteResults !== prevProps.metaboliteResults &&
      this.props.metaboliteResults != null
    ) {
      this.addMetabolites();
    }

    if (
      this.props.proteinResults !== prevProps.proteinResults &&
      this.props.proteinResults != null
    ) {
      this.addProteins();
    }

    if (
      this.props.reactionResults !== prevProps.reactionResults &&
      this.props.reactionResults != null
    ) {
      this.addReactions();
    }
  }

  formatResults(results) {
    let resultsHtml = [];
    for (const result of results) {
      resultsHtml.push(formatResult(result));
    }
    return resultsHtml;
  }

  addMetabolites() {
    this.setState({
      metaboliteResults: this.formatResults(this.props.metaboliteResults)
    });
  }

  addProteins() {
    this.setState({
      proteinResults: this.formatResults(this.props.proteinResults)
    });
  }

  addReactions() {
    this.setState({
      reactionResults: this.formatResults(this.props.reactionResults)
    });
  }

  handleFetch(index) {
    this.props.fetchDataHandler(index, 10);
  }

  renderSection(id, title, results, showLoadMore, fetchKey) {
    return (
      <div className="content-block section" id={id}>
        <h2 className="content-block-heading">{title} (XXX)</h2>
        <div className="content-block-content">
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
                    this.handleFetch(fetchKey);
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

  render() {
    return (
      <div>
        {this.renderSection(
          "metabolites",
          "Metabolites",
          this.state.metaboliteResults,
          this.props.showLoadMoreMetabolites,
          "metabolites"
        )}
        {this.renderSection(
          "proteins",
          "Proteins",
          this.state.proteinResults,
          this.props.showLoadMoreProteins,
          "proteins"
        )}
        {this.renderSection(
          "reactions",
          "Reactions",
          this.state.reactionResults,
          this.props.showLoadMoreReactions,
          "reactions"
        )}
      </div>
    );
  }
}
