import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";

import SearchResultsList from "./SearchResultsList.js";
import {
  getResultsUrl as getMetaboliteResultsUrl,
  getResults as getMetaboliteResults,
  formatResults as formatMetaboliteResults
} from "~/scenes/SearchResults/metabolite_functions";
import {
  getResultsUrl as getProteinResultsUrl,
  getResults as getProteinResults,
  formatResults as formatProteinResults
} from "~/scenes/SearchResults/protein_functions";
import {
  getResultsUrl as getReactionResultsUrl,
  getResults as getReactionResults,
  formatResults as formatReactionResults
} from "~/scenes/SearchResults/reaction_functions";

import "./SearchResults.scss";

class SearchResults extends Component {
  render() {
    const scrollTo = el => {
      window.scrollTo({ behavior: "smooth", top: el.offsetTop - 52 });
    };

    return (
      <div className="content-container content-container-columns content-container-search-results-scene">
        <div className="content-block table-of-contents">
          <h2 className="content-block-heading">Contents</h2>
          <div className="content-block-content">
            <ul>
              <li>
                <HashLink to="#metabolites" scroll={scrollTo}>
                  {"Metabolites (XXX)"}
                </HashLink>
              </li>
              <li>
                <HashLink to="#proteins" scroll={scrollTo}>
                  {"Proteins (XXX)"}
                </HashLink>
              </li>
              <li>
                <HashLink to="#reactions" scroll={scrollTo}>
                  {"Reactions (XXX)"}
                </HashLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="content-column">
          <SearchResultsList
            get-results-url={getMetaboliteResultsUrl}
            get-results={getMetaboliteResults}
            format-results={formatMetaboliteResults}
            html-anchor-id="metabolites"
            title="Metabolites"
          />
          <SearchResultsList
            get-results-url={getProteinResultsUrl}
            get-results={getProteinResults}
            format-results={formatProteinResults}
            html-anchor-id="proteins"
            title="Proteins"
          />
          <SearchResultsList
            get-results-url={getReactionResultsUrl}
            get-results={getReactionResults}
            format-results={formatReactionResults}
            html-anchor-id="reactions"
            title="Reactions"
          />
        </div>
      </div>
    );
  }
}

export default SearchResults;
