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
      pageCount * 10 +
      "&size=" +
      pageSize +
      "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzyme_name&fields=product_names&fields=substrate_names&fields=enzymes.subunit.canonical_sequence&fields=species"
    );
  }

  getResults(data) {
    return data["metabolites_meta"];
  }

  formatResults(data, organism) {
    let newMetaboliteMetadataDict = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i].InChI_Key) {
        let inchiKey = data[i].InChI_Key;
        let newDict = newMetaboliteMetadataDict[inchiKey];
        if (!newDict) {
          newDict = {};
        }
        let name = data[i]["name"];
        if (name === "No metabolite found.") {
          name = data[i]["synonyms"][0];
        }
        let hrefYmdb = null;
        let hrefEcmdb = null;
        let ymdbPreface = "";
        let ecmdbPreface = "";
        let comma = "";

        newDict["title"] =
          name[0].toUpperCase() + name.substring(1, name.length);
        if (data[i]["ymdb_id"] != null) {
          hrefYmdb = "http://www.ymdb.ca/compounds/" + data[i]["ymdb_id"];
          ymdbPreface = "YMDB: ";
        }

        if (data[i]["m2m_id"] != null) {
          if (ymdbPreface !== "") {
            comma = ", ";
          }

          hrefEcmdb = "http://ecmdb.ca/compounds/" + data[i]["m2m_id"];
          ecmdbPreface = "ECMDB: ";
        }
        newDict["description"] = (
          <div className="external-links">
            <p>
              {ymdbPreface}{" "}
              <a href={hrefYmdb} target="_blank" rel="noopener noreferrer">
                {data[i]["ymdb_id"]}
              </a>
              {comma}
              {ecmdbPreface}{" "}
              <a href={hrefEcmdb} target="_blank" rel="noopener noreferrer">
                {data[i]["m2m_id"]}
              </a>
            </p>
          </div>
        );
        newDict["route"] = "/metabolite/" + name + "/" + organism;
        newMetaboliteMetadataDict[inchiKey] = newDict;
      }
    }

    let metaboliteMetadata = Object.keys(newMetaboliteMetadataDict).map(
      function(key) {
        return newMetaboliteMetadataDict[key];
      }
    );
    return metaboliteMetadata;
  }

  render() {
    return (
      <SearchResultsList
        get-results-url={this.getResultsUrl}
        get-results={this.getResults}
        format-results={this.formatResults}
        html-anchor-id="metabolites"
        title="Metabolites"
      />
    );
  }
}
