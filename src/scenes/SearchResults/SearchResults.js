import React, { Component } from "react";
import PropTypes from "prop-types";
import { HashLink } from "react-router-hash-link";
import { scrollTo, parseHistoryLocationPathname } from "~/utils/utils";

import MetaboliteSearchResultsList from "./MetaboliteSearchResultsList";
import RnaSearchResultsList from "./RnaSearchResultsList";
import ProteinSearchResultsList from "./ProteinSearchResultsList";
import ReactionSearchResultsList from "./ReactionSearchResultsList";

import "./SearchResults.scss";

class SearchResults extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      query: null,
      organism: null
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
        organism: route.organism
      });
    }
  }

  render() {
    return (
      <div className="content-container content-container-search-results-scene">
        <h1 className="page-title">
          Search: <span className="highlight-accent">{this.state.query}</span>
          {this.state.organism && (
            <span className="highlight-text">
              {" "}
              in <span className="highlight-accent">{this.state.organism}</span>
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
                    <HashLink to="#metabolites" scroll={scrollTo}>
                      {"Metabolites"}
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#rnas" scroll={scrollTo}>
                      {"RNAs"}
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#proteins" scroll={scrollTo}>
                      {"Proteins"}
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#reactions" scroll={scrollTo}>
                      {"Reactions"}
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column">
            <MetaboliteSearchResultsList />
            <RnaSearchResultsList />
            <ProteinSearchResultsList />
            <ReactionSearchResultsList />
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResults;
