import React from "react";
import "~/scenes/BiochemicalEntityDetails/Metabolite/Metabolite.scss";

function formatProtein(data, organism) {
  let start = 0;
  let newProteinMetadataDict = {};
  for (var i = start; i < data.length; i++) {
    let ko_number = data[i]["key"];
    if (ko_number !== "nan") {
      ko_number =
        ko_number[0].toUpperCase() + ko_number.substring(1, ko_number.length);
      let new_dict = newProteinMetadataDict[ko_number];
      if (!new_dict) {
        new_dict = {};
      }
      let name = data[i].top_ko.hits.hits[0]._source.ko_name[0];
      let hasAbundances = "";
      if (data[i].top_ko.hits.hits[0]._source.abundances) {
        hasAbundances = "True";
      } else {
        hasAbundances = "False";
      }
      new_dict["primary_text"] =
        name[0].toUpperCase() + name.substring(1, name.length);
      let href = "https://www.genome.jp/dbget-bin/www_bget?ko:" + ko_number;
      new_dict["secondary_text"] = (
        <div className="external_links">
          <p>
            KEGG:{" "}
            <a href={href} rel="noopener">
              {" "}
              {ko_number}{" "}
            </a>
          </p>
        </div>
      );
      new_dict["url"] =
        "/protein/ko/mol/?ko=" + ko_number + "&organism=" + organism;

      newProteinMetadataDict[ko_number] = new_dict;
    }
  }

  let proteinMetadata = Object.keys(newProteinMetadataDict).map(function(key) {
    return newProteinMetadataDict[key];
  });
  return proteinMetadata;
}

export { formatProtein };
