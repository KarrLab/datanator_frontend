import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";

export default class RnaSearchResultsList extends Component {
  /* Return URL for REST query for search */
  getResultsUrl(query, pageCount, pageSize) {
    const args = {
      query_message: query,
      index:'rna_halflife',
      from_: pageCount * pageSize,
      size: pageSize,
      fields: ["protein_name", "synonyms", "gene_name", "name", "enzymes.enzyme.enzyme_name"]
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
    return data["rna_halflife"];
  }

  /* Extract number of RNAs that match query from result of REST call */
  getNumResults(data) {
    return data["rna_halflife_total"]['value'];
  }

  /* Return a list of dictionaries with content to populate the search results
  
  Each dictionary should contain three fields
  - title
  - description
  - route: URL for page with details about search result
  */
  formatResults(results, organism) {
    console.log(results)
    const formattedResults = []
    for (var i = results.length - 1; i >= 0; i--) {
      let result = results[i]
      console.log(result)
      let description = ""
      description = "Gene Name: " + result["gene_name"]
      formattedResults.push(
        {
          title: result["protein_name"],
          description: description,
          route:
            "/rna/" +
            result["protein_name"] //+
            //"/" +
            //(organism ? organism + "/" : "")
        }
      );
    }
    return(formattedResults)
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
