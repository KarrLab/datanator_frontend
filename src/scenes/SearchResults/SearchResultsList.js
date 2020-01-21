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
    loadMetabolites: PropTypes.bool,
    loadProteins: PropTypes.bool,
    loadReactions: PropTypes.bool,

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

      metab_counter: 2,
      reaction_couner: 2
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
    this.setState({ metab_counter: this.state.metab_counter + 1 });
  }

  render() {
    return (
      <div className="content-column">
        {this.state.metaboliteResults != null && (
          <div className="content-block section" id="metabolites">
            <h2 className="content-block-heading">Metabolites (XXX)</h2>
            <div className="content-block-content">
              {this.state.metaboliteResults.length > 0 && (
                <ul className="search-results-list">
                  {this.state.metaboliteResults}
                </ul>
              )}

              {this.state.metaboliteResults.length === 0 && (
                <p className="no-search-results">No results found</p>
              )}

              {this.state.metaboliteResults.length > 0 &&
                this.props.loadMetabolites && (
                  <button
                    className="more-search-results-button"
                    type="button"
                    onClick={() => {
                      this.handleFetch("metabolites");
                    }}
                  >
                    Load 10 more
                  </button>
                )}
            </div>
          </div>
        )}

        {this.state.proteinResults != null && (
          <div className="content-block section" id="proteins">
            <h2 className="content-block-heading">Proteins (XXX)</h2>
            <div className="content-block-content">
              {this.state.proteinResults.length > 0 && (
                <ul className="search-results-list">
                  {this.state.proteinResults}
                </ul>
              )}

              {this.state.proteinResults.length === 0 && (
                <p className="no-search-results">No results found</p>
              )}

              {this.state.proteinResults.length > 0 && this.props.loadProteins && (
                <button
                  className="more-search-results-button"
                  type="button"
                  onClick={() => {
                    this.handleFetch("proteins");
                  }}
                >
                  Load 10 more
                </button>
              )}
            </div>
          </div>
        )}

        {this.state.reactionResults != null && (
          <div className="content-block section" id="reactions">
            <h2 className="content-block-heading">Reactions (XXX)</h2>
            <div className="content-block-content">
              {this.state.reactionResults.length > 0 && (
                <ul className="search-results-list">
                  {this.state.reactionResults}
                </ul>
              )}

              {this.state.reactionResults.length === 0 && (
                <p className="no-search-results">No results found</p>
              )}

              {this.state.reactionResults.length > 0 &&
                this.props.loadReactions && (
                  <button
                    className="more-search-results-button"
                    type="button"
                    onClick={() => {
                      this.handleFetch("reactions");
                    }}
                  >
                    Load 10 more
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
