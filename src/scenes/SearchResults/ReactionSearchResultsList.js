import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";
import { naturalSort } from "~/utils/utils";

export default class ReactionSearchResultsList extends Component {
  getResultsUrl(query, pageCount, pageSize) {
    const indexQueryArg = "sabio_reaction_entries";
    return (
      "ftx/text_search/num_of_index/?" +
      [
        "query_message=" + query,
        "index=" + indexQueryArg,
        "from_=" + pageCount * pageSize,
        "size=" + pageSize,

        "fields=enzyme_names",
        "fields=ec-code",

        "fields=substrates",
        "fields=substrate_names",
        "fields=products",
        "fields=product_names",

        "excludes=kinlaw_id",
        "excludes=in_metabolites",
      ].join("&")
    );
  }

  formatResults(data, organism) {
    const results = data["sabio_reaction_entries"];
    const numResults = data["sabio_reaction_entries_total"]["value"];

    const formattedResults = [];
    for (const result of results) {
      const formattedResult = {};
      formattedResults.push(formattedResult);

      // title and description
      let name = result["enzyme_names"][0];
      if (!name || name.toUpperCase() === "NULL") {
        name = null;
      }

      const substrateNames = getParticipant(result["substrate_names"]);
      const productNames = getParticipant(result["product_names"]);
      substrateNames.sort(naturalSort);
      productNames.sort(naturalSort);
      const equation =
        formatSide(substrateNames) + " → " + formatSide(productNames);
      const ecCode = result["ec-code"];

      if (name) {
        formattedResult["title"] =
          name[0].toUpperCase() + name.substring(1, name.length);
      } else {
        formattedResult["title"] = equation;
      }
      formattedResult["description"] = <div>{equation}</div>;
      if (!ecCode.startsWith("-")) {
        formattedResult["description"] = (
          <div>
            {name ? <div>{equation}</div> : null}
            <div>
              EC:{" "}
              <a
                href={"https://enzyme.expasy.org/EC/" + ecCode}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ecCode}
              </a>
            </div>
          </div>
        );
      }

      // route
      formattedResult["route"] =
        "/reaction/" +
        result["substrates"].join(",") +
        "-->" +
        result["products"].join(",") +
        "/";
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
        html-anchor-id="reactions"
        title="Reaction classes"
      />
    );
  }
}

function formatSide(parts) {
  return parts.join(" + ");
}

function getParticipant(participants) {
  const partNames = [];
  for (const participant of participants) {
    partNames.push(participant[participant.length - 1]);
  }
  return partNames;
}
