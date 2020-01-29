import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";

export default class MetaboliteSearchResultsList extends Component {
  getResultsUrl(query, pageCount, pageSize) {
    const indexQueryArg = "metabolites_meta";

    return (
      "ftx/text_search/num_of_index/" +
      "?query_message=" +
      query +
      "&index=" +
      indexQueryArg +
      "&from_=" +
      pageCount * pageSize +
      "&size=" +
      pageSize +
      "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzyme_name&fields=product_names&fields=substrate_names&fields=enzymes.subunit.canonical_sequence&fields=species"
    );
  }

  formatResults(data, organism) {
    const results = data["metabolites_meta"];
    const numResults = data["metabolites_meta_total"]["value"];

    const formattedResults = {};
    for (const result of results) {
      if (result.InChI_Key) {
        const inchiKey = result.InChI_Key;

        let formattedResult = formattedResults[inchiKey];
        if (!formattedResult) {
          formattedResult = {};
          formattedResults[inchiKey] = formattedResult;
        }

        // title
        let name = result["name"];
        if (name === "No metabolite found.") {
          name = result["synonyms"][0];
        }

        formattedResult["title"] =
          name[0].toUpperCase() + name.substring(1, name.length);

        // description
        let hrefYmdb = null;
        let hrefEcmdb = null;
        let ymdbPreface = "";
        let ecmdbPreface = "";
        let comma = "";

        if (result["ymdb_id"] != null) {
          hrefYmdb = "http://www.ymdb.ca/compounds/" + result["ymdb_id"];
          ymdbPreface = "YMDB: ";
        }

        if (result["m2m_id"] != null) {
          if (ymdbPreface !== "") {
            comma = ", ";
          }

          hrefEcmdb = "http://ecmdb.ca/compounds/" + result["m2m_id"];
          ecmdbPreface = "ECMDB: ";
        }
        formattedResult["description"] = (
          <div className="external-links">
            <p>
              {ymdbPreface}{" "}
              <a href={hrefYmdb} target="_blank" rel="noopener noreferrer">
                {result["ymdb_id"]}
              </a>
              {comma}
              {ecmdbPreface}{" "}
              <a href={hrefEcmdb} target="_blank" rel="noopener noreferrer">
                {result["m2m_id"]}
              </a>
            </p>
          </div>
        );

        //route
        formattedResult["route"] = "/metabolite/" + name;
        if (organism) {
          formattedResult["route"] += "/" + organism;
        }
      }
    }

    return {
      results: Object.values(formattedResults),
      numResults: numResults,
    };
  }

  render() {
    return (
      <SearchResultsList
        get-results-url={this.getResultsUrl}
        format-results={this.formatResults}
        html-anchor-id="metabolites"
        title="Metabolites"
      />
    );
  }
}
