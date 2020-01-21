import React from "react";

function getResultsUrl(query, pageCount, pageSize) {
  return (
    "ftx/text_search/protein_ranked_by_ko/" +
    "?query_message=" +
    query +
    "&from_=" +
    pageCount * 10 +
    "&size=" +
    pageSize +
    "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzymes.enzyme.enzyme_name&fields=enzymes.subunit.canonical_sequence&fields=species"
  );
}

function getResults(data) {
  return data["top_kos"]["buckets"];
}

function formatResults(data, organism) {
  let newProteinMetadataDict = {};
  for (var i = 0; i < data.length; i++) {
    let koNumber = data[i]["key"];
    if (koNumber !== "nan") {
      koNumber =
        koNumber[0].toUpperCase() + koNumber.substring(1, koNumber.length);
      let newDict = newProteinMetadataDict[koNumber];
      if (!newDict) {
        newDict = {};
      }
      let name = data[i].top_ko.hits.hits[0]._source.ko_name[0];
      newDict["title"] = name[0].toUpperCase() + name.substring(1, name.length);
      let href = "https://www.genome.jp/dbget-bin/www_bget?ko:" + koNumber;
      newDict["description"] = (
        <div className="external-links">
          <p>
            KEGG:{" "}
            <a href={href} target="_blank" rel="noopener noreferrer">
              {" "}
              {koNumber}{" "}
            </a>
          </p>
        </div>
      );
      newDict["route"] =
        "/protein/ko/mol/?ko=" + koNumber + "&organism=" + organism;

      newProteinMetadataDict[koNumber] = newDict;
    }
  }

  let proteinMetadata = Object.keys(newProteinMetadataDict).map(function(key) {
    return newProteinMetadataDict[key];
  });
  return proteinMetadata;
}

export { getResultsUrl, getResults, formatResults };
