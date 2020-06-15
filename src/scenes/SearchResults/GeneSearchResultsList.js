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

        "fields=ec_number",
      ].join("&")
    );
  }

  formatResults(data, organism) {
    const results = data["top_kos"]["buckets"];
    const numResults = data["total_buckets"]["value"];

    const formattedResults = [];
    for (const result of results) {
      if (Array.isArray(result.key) && result.key.length > 0) {
        let koNumber = result.top_ko.hits.hits[0]._source.ko_number;
        const uniprotId = result.top_ko.hits.hits[0]._id.toUpperCase();

        const source = result.top_ko.hits.hits[0]._source;
        let id;
        if (
          koNumber == null ||
          ["nan", "n/a"].includes(koNumber.toLowerCase())
        ) {
          id = uniprotId;
          koNumber = null;
        } else {
          id = koNumber;
        }

        const formattedResult = {};
        formattedResults.push(formattedResult);

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
          formattedResult["title"] = source.protein_name.split("(")[0].trim();
        }

        // description
        const descriptions = [];
        if (koNumber == null) {
          const taxonName = source.species_name;
          descriptions.push(
            <li key="taxonomy">
              Organism:{" "}
              <a
                href={
                  "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=" +
                  taxonName
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {taxonName}
              </a>
            </li>
          );

          descriptions.push(
            <li key="uniprot">
              UniProt:{" "}
              <a
                href={"https://www.uniprot.org/uniprot/" + uniprotId}
                target="_blank"
                rel="noopener noreferrer"
              >
                {uniprotId}
              </a>
            </li>
          );
        } else {
          descriptions.push(
            <li key="kegg">
              KEGG:{" "}
              <a
                href={"https://www.genome.jp/dbget-bin/www_bget?ko:" + koNumber}
                target="_blank"
                rel="noopener noreferrer"
              >
                {koNumber}
              </a>
            </li>
          );
        }

        formattedResult["description"] = (
          <ul className="comma-separated-list">{descriptions}</ul>
        );

        //route
        formattedResult["route"] = "/gene/" + id + "/";
        if (organism) {
          formattedResult["route"] += organism + "/";
        }
      }
    }

    return {
      results: formattedResults,
      numResults: numResults,
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
