import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";
import { formatParticipantsForUrl } from "~/utils/utils";

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
        "fields=product_names"
      ].join("&")
    );
  }

  formatResults(data, organism) {
    const results = data["sabio_reaction_entries"];
    const numResults = data["sabio_reaction_entries_total"]["value"];

    const formattedResults = {};
    for (const result of results) {
      const id = result["rxn_id"];
      let formattedResult = formattedResults[id];
      if (!formattedResult) {
        formattedResult = {};
        formattedResults[id] = formattedResult;
      }

      // title and description
      const name = result["enzyme_names"][0];
      const substrates = getParticipant(result["substrate_names"]);
      const products = getParticipant(result["product_names"]);
      const equation = formatSide(substrates) + " → " + formatSide(products);
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
            <div>{equation}</div>
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
        formatParticipantsForUrl(substrates) +
        "-->" +
        formatParticipantsForUrl(products);
      if (organism) {
        formattedResult["route"] += "/" + organism;
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
