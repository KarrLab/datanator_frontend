import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { parseHistoryLocationPathname } from "~/utils/utils";
import MetaboliteSearchResultsList from "./MetaboliteSearchResultsList";
import GeneSearchResultsList from "./GeneSearchResultsList";
import ReactionSearchResultsList from "./ReactionSearchResultsList";

import "./SearchResults.scss";

class SearchResults extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      query: null,
      organism: null,
    };
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
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      const route = parseHistoryLocationPathname(this.props.history);
      this.setState({
        query: route.query,
        organism: route.organism,
      });
    }
  }

  render() {
    return (
      <div className="content-container content-container-search-results-scene">
        <h1 className="page-title">
          Search: <span className="highlight-accent">{this.state.query}</span>
          {this.state.organism && (
            <span>
              <span className="highlight-text"> in </span>
              <span className="highlight-accent">{this.state.organism}</span>
            </span>
          )}
        </h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <a href="#metabolites">{"Metabolites"}</a>
                  </li>
                  <li>
                    <a href="#genes">{"Genes"}</a>
                  </li>
                  <li>
                    <a href="#reactions">{"Reactions"}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column">
            <MetaboliteSearchResultsList />
            <GeneSearchResultsList />
            <ReactionSearchResultsList />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SearchResults);
