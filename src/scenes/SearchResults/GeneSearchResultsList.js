import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";
import { upperCaseFirstLetter } from "~/utils/utils";

export default class GeneSearchResultsList extends Component {
  getResultsUrl(query, pageCount, pageSize) {
    return (
      "ftx/text_search/gene_ranked_by_ko/?" +
      [
        "query_message=" + query,
        "from_=" + pageCount * pageSize,
        "size=" + pageSize,
        "fields=ko_name",
        "fields=ko_number",

        "fields=gene_name",
        "fields=gene_name_alt",
        "fields=gene_name_orf",
        "fields=gene_name_oln",
        "fields=entrez_id",

        "fields=protein_name",
        "fields=entry_name",
        "fields=uniprot_id",

        "fields=ec_number"
      ].join("&")
    );
  }

  formatResults(data, organism) {
    const results = data["top_kos"]["buckets"];
    const numResults = data["total_buckets"]["value"];

    const formattedResults = {};
    for (const result of results) {
      if (Array.isArray(result.key) && result.key.length > 0) {
        let koNumber = upperCaseFirstLetter(result.key[0]);
        const uniprotId = result.top_ko.hits.hits[0]._id;

        const source = result.top_ko.hits.hits[0]._source;
        let id;
        if (koNumber.toLowerCase() === "nan") {
          id = uniprotId;
          koNumber = null;
        } else {
          id = koNumber;
        }

        let formattedResult = formattedResults[id];
        if (!formattedResult) {
          formattedResult = {};
          formattedResults[id] = formattedResult;
        }

        // title
        if (
          "ko_name" in source &&
          Array.isArray(source.ko_name) &&
          source.ko_name.length &&
          source.ko_name[0]
        ) {
          formattedResult["title"] = upperCaseFirstLetter(source.ko_name[0]);
        } else if ("definition" in source) {
          formattedResult["title"] = source.definition;
        } else {
          formattedResult["title"] = source.protein_name;
        }

        // description
        if (koNumber == null) {
          formattedResult["description"] = (
            <div>
              UniProt:{" "}
              <a
                href={"https://www.uniprot.org/uniprot/" + uniprotId}
                target="_blank"
                rel="noopener noreferrer"
              >
                {uniprotId}
              </a>
            </div>
          );
        } else {
          formattedResult["description"] = (
            <div>
              KEGG:{" "}
              <a
                href={"https://www.genome.jp/dbget-bin/www_bget?ko:" + koNumber}
                target="_blank"
                rel="noopener noreferrer"
              >
                {koNumber}
              </a>
            </div>
          );
        }

        //route
        formattedResult["route"] = "/gene/" + id;
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
        html-anchor-id="genes"
        title="Genes"
      />
    );
  }
}
