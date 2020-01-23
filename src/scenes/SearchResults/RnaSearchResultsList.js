import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";

export default class RnaSearchResultsList extends Component {
  /* Return URL for REST query for search */
  getResultsUrl(query, pageCount, pageSize) {
    const args = {
      query_message: query,
      from_: pageCount * pageSize,
      size: pageSize,
      fields: ["rna_name", "synonyms"]
    };

    // generate URL from args
    let strArgs = [];
    for (const arg in args) {
      let val = args[arg];
      if (Array.isArray(val)) {
        strArgs = strArgs.concat(
          val.map(v => {
            return arg + "=" + v;
          })
        );
      } else {
        strArgs.push(arg + "=" + val);
      }
    }
    return "ftx/text_search/num_of_index/?" + strArgs.join("&");
  }

  /* Extract array of dictionaries from result of REST call */
  getResults(data) {
    return data["search_results_field"];
  }

  /* Extract number of RNAs that match query from result of REST call */
  getNumResults(data) {
    return data["num_search_results_field"];
  }

  /* Return a list of dictionaries with content to populate the search results
  
  Each dictionary should contain three fields
  - title
  - description
  - route: URL for page with details about search result
  */
  formatResults(results, organism) {
    for (const result of results) {
      return [
        {
          title: result["title_field"],
          description: result["description_field"],
          route:
            "/rna/" +
            result["id_field"] +
            "/" +
            (organism ? organism + "/" : "")
        }
      ];
    }
  }

  render() {
    return (
      <SearchResultsList
        get-results-url={this.getResultsUrl}
        get-results={this.getResults}
        get-num-results={this.getNumResults}
        format-results={this.formatResults}
        html-anchor-id="rnas"
        title="RNA classes"
      />
    );
  }
}
