import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";
import { upperCaseFirstLetter } from "~/utils/utils";

export default class ProteinSearchResultsList extends Component {
  getResultsUrl(query, pageCount, pageSize) {
    return (
      "ftx/text_search/protein_ranked_by_ko/" +
      "?query_message=" +
      query +
      "&from_=" +
      pageCount * pageSize +
      "&size=" +
      pageSize +
      "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzymes.enzyme.enzyme_name&fields=enzymes.subunit.canonical_sequence&fields=species"
    );
  }

  formatResults(data, organism) {
    const results = data["top_kos"]["buckets"];
    const numResults = data["total_buckets"]["value"];

    const formattedResults = {};
    for (const result of results) {
      if (Array.isArray(result.key) && result.key.length > 0) {
        const koNumber = upperCaseFirstLetter(result.key[0]);
        let formattedResult = formattedResults[koNumber];
        if (!formattedResult) {
          formattedResult = {};
          formattedResults[koNumber] = formattedResult;
        }

        // title
        const name = result.top_ko.hits.hits[0]._source.ko_name[0];
        if (name) {
          formattedResult["title"] =
            name[0].toUpperCase() + name.substring(1, name.length);
        } else {
          formattedResult["title"] = koNumber;
        }

        // description
        const href = "https://www.genome.jp/dbget-bin/www_bget?ko:" + koNumber;
        formattedResult["description"] = (
          <div>
            KEGG:{" "}
            <a href={href} target="_blank" rel="noopener noreferrer">
              {koNumber}
            </a>
          </div>
        );

        //route
        formattedResult["route"] = "/protein/" + koNumber;
        if (organism) {
          formattedResult["route"] += "/" + organism;
        }
      }
    }

    return {
      results: Object.values(formattedResults),
      numResults: numResults
    };
  }

  render() {
    return (
      <SearchResultsList
        get-results-url={this.getResultsUrl}
        get-results={this.getResults}
        get-num-results={this.getNumResults}
        format-results={this.formatResults}
        html-anchor-id="proteins"
        title="Protein ortholog groups"
      />
    );
  }
}
