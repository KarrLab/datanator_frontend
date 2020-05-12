import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";

export default class MetaboliteSearchResultsList extends Component {
  getResultsUrl(query, pageCount, pageSize) {
    const indexQueryArg = "metabolites_meta";

    return (
      "ftx/text_search/num_of_index/" +
      "?index=" +
      indexQueryArg +
      "&query_message=" +
      query +
      "&from_=" +
      pageCount * pageSize +
      "&size=" +
      pageSize +
      "&fields=inchi&fields=m2m_id&fields=ymdb_id&fields=reaction_participants&fields=synonyms&fields=InChI_Key&fields=name&fields=chebi_id&fields=hmdb_id&fields=kegg_id"
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

        let inchikey = result["InChI_Key"]

        formattedResult["title"] =
          name[0].toUpperCase() + name.substring(1, name.length);

        // description
        const linkTypes = [
          {
            label: "ChEBI",
            url: "https://www.ebi.ac.uk/chebi/searchId.do?chebiId=",
            attribute: "chebi_id"
          },
          // {
          //   label: "ECMDB",
          //   url: "http://ecmdb.ca/compounds/",
          //   attribute: "m2m_id"
          // },
          // {
          //   label: "HMDB",
          //   url: "http://www.hmdb.ca/metabolites/",
          //   attribute: "hmdb_id"
          // },
          {
            label: "KEGG",
            url: "https://www.genome.jp/dbget-bin/www_bget?cpd:",
            attribute: "kegg_id"
          }
          // {
          //   label: "YMDB",
          //   url: "http://www.ymdb.ca/compounds/",
          //   attribute: "ymdb_id"
          // }
        ];
        const links = [];
        for (const linkType of linkTypes) {
          const linkId = result[linkType.attribute];
          if (linkId != null && linkId !== undefined) {
            links.push(
              <li key={linkType.label}>
                {linkType.label}:{" "}
                <a
                  href={linkType.url + linkId}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkId}
                </a>
              </li>
            );
          }
        }

        formattedResult["description"] = (
          <ul className="comma-separated-list">{links}</ul>
        );

        //route
        formattedResult["route"] = "/metabolite/" + inchikey;
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
        format-results={this.formatResults}
        html-anchor-id="metabolites"
        title="Metabolites"
      />
    );
  }
}
