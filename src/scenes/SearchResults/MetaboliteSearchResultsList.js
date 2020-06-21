import React, { Component } from "react";
import SearchResultsList from "./SearchResultsList.js";

export default class MetaboliteSearchResultsList extends Component {
  getResultsUrl(query, pageCount, pageSize) {
    const indexQueryArg = "metabolites_meta";

    return (
      "ftx/text_search/num_of_index/?" +
      [
        "index=" + indexQueryArg,
        "query_message=" + query,
        "from_=" + pageCount * pageSize,
        "size=" + pageSize,

        "fields=inchi",
        "fields=InChI_Key",
        "fields=smiles",
        "fields=chemical_formula",

        "fields=name",
        "fields=synonyms",
        "fields=description",

        "fields=biocyc_id",
        "fields=cas_registry_number",
        "fields=chebi_id",
        "fields=chemspider_id",
        "fields=hmdb_id",
        "fields=kegg_id",
        "fields=m2m_id",
        "fields=pubchem_compound_id",
        "fields=ymdb_id",

        "fields=pathways.pathway.name",
        "fields=pathways.pathway.description",
        "fields=pathways.pathway.ecocyc_pathway_id",
        "fields=pathways.pathway.kegg_map_id",
        "fields=pathways.pathway.pathwhiz_id",

        "includes=InChI_Key",
        "includes=name",
        "includes=chebi_id"
      ].join("&")
    );
  }

  formatResults(data, organism) {
    const results = data["metabolites_meta"];
    const numResults = data["metabolites_meta_total"]["value"];

    const formattedResults = [];
    for (const result of results) {
      const formattedResult = {};
      formattedResults.push(formattedResult);

      // title
      let name = result["name"];
      if (name === "No metabolite found.") {
        name = result["synonyms"][0];
      }

      let inchikey = result["InChI_Key"];

      formattedResult["title"] =
        name[0].toUpperCase() + name.substring(1, name.length);

      // description
      const linkTypes = [
        {
          label: "InChI key",
          url: "https://www.ebi.ac.uk/chebi/advancedSearchFT.do?searchString=",
          attribute: "InChI_Key",
        },
        {
          label: "ChEBI",
          url: "https://www.ebi.ac.uk/chebi/searchId.do?chebiId=",
          attribute: "chebi_id",
        },
        {
          label: "KEGG",
          url: "https://www.genome.jp/dbget-bin/www_bget?cpd:",
          attribute: "kegg_id",
        },
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

    return {
      results: formattedResults,
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
