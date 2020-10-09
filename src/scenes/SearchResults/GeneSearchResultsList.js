import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";
import { castToArray, isOrthoDbId } from "~/utils/utils";

export default class GeneSearchResultsList extends Component {
  getResultsUrl(query, pageCount, pageSize) {
    return (
      "ftx/text_search/gene_ranked_by_ko/?" +
      [
        "query_message=" + query,
        "from_=" + pageCount * pageSize,
        "size=" + pageSize,
        "fields=orthodb_id",
        "fields=orthodb_name",

        "fields=gene_name",
        "fields=gene_name_alt",
        "fields=gene_name_orf",
        "fields=gene_name_oln",
        "fields=entrez_id",

        "fields=protein_name",
        "fields=entry_name",
        "fields=uniprot_id",

        "fields=definition",

        "fields=ec_number",
      ].join("&")
    );
  }

  formatResults(data, organism) {
    const results = data["top_kos"]["buckets"];
    const numResults = data["total_buckets"]["value"];

    const formattedResults = [];
    for (const result of results) {
      const orthoDbIdArr = castToArray(
        result.top_ko.hits.hits[0]?._source?.orthodb_id
      );
      const orthoDbNameArr = castToArray(
        result.top_ko.hits.hits[0]?._source?.orthodb_name
      );
      let orthoDbId = orthoDbIdArr.length ? orthoDbIdArr[0] : null;
      let orthoDbName = orthoDbNameArr.length ? orthoDbNameArr[0] : null;
      const uniprotId = result.top_ko.hits.hits[0]._source?.uniprot_id;

      const source = result.top_ko.hits.hits[0]._source;

      if (typeof orthoDbId !== "string" || !orthoDbId) {
        orthoDbId = null;
        orthoDbName = null;
      }
      if (typeof orthoDbName !== "string" || !orthoDbName) {
        orthoDbName = null;
      }

      let id;
      if (
        orthoDbId == null ||
        ["nan", "n/a"].includes(orthoDbId.toLowerCase())
      ) {
        id = uniprotId;
        orthoDbId = null;
      } else {
        id = orthoDbId;
      }

      const formattedResult = {};
      formattedResults.push(formattedResult);

      // title
      if (orthoDbId) {
        let name = orthoDbName;
        if (!name) {
          name = orthoDbId;
        }

        formattedResult["title"] = "Ortholog group: " + name;
      } else if ("definition" in source) {
        formattedResult["title"] = "Gene: " + source.definition;
      } else if ("protein_name" in source) {
        formattedResult["title"] =
          "Gene: " + source.protein_name.split("(")[0].trim();
      } else {
        formattedResult["title"] = "Gene: " + source.uniprot_id;
      }

      // description
      const descriptions = [];
      if (orthoDbId == null) {
        if ("species_name" in source) {
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
        }

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
      } else if (isOrthoDbId(orthoDbId)) {
        descriptions.push(
          <li key="orthodb">
            OrthoDB:{" "}
            <a
              href={"https://www.orthodb.org/?query=" + orthoDbId}
              target="_blank"
              rel="noopener noreferrer"
            >
              {orthoDbId}
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
