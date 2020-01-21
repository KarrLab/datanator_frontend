import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";

import SearchResultsList from "./SearchResultsList.js";
import * as metabolite_functions from "~/scenes/SearchResults/metabolite_functions";
import * as protein_functions from "~/scenes/SearchResults/protein_functions";
import * as reaction_functions from "~/scenes/SearchResults/reaction_functions";

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
            get-results-url={metabolite_functions.getResultsUrl}
            get-results={metabolite_functions.getResults}
            format-results={metabolite_functions.formatResults}
            html-anchor-id="metabolites"
            title="Metabolites"
          />
          <SearchResultsList
            get-results-url={protein_functions.getResultsUrl}
            get-results={protein_functions.getResults}
            format-results={protein_functions.formatResults}
            html-anchor-id="proteins"
            title="Proteins"
          />
          <SearchResultsList
            get-results-url={reaction_functions.getResultsUrl}
            get-results={reaction_functions.getResults}
            format-results={reaction_functions.formatResults}
            html-anchor-id="reactions"
            title="Reactions"
          />
        </div>
      </div>
    );
  }
}

export default SearchResults;
