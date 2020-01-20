import React from "react";

function formatMetabolite(data, organism) {
  let start = 0;
  let newMetaboliteMetadataDict = {};
  for (var i = start; i < data.length; i++) {
    if (data[i].InChI_Key) {
      let inchi_key = data[i].InChI_Key;
      let new_dict = newMetaboliteMetadataDict[inchi_key];
      if (!new_dict) {
        new_dict = {};
      }
      let name = data[i]["name"];
      if (name === "No metabolite found.") {
        name = data[i]["synonyms"][0];
      }
      let href_ymdb = null;
      let href_ecmdb = null;
      let ymdb_preface = "";
      let ecmdb_preface = "";
      let comma = "";

      new_dict["primary_text"] =
        name[0].toUpperCase() + name.substring(1, name.length);
      if (data[i]["ymdb_id"] != null) {
        href_ymdb = "http://www.ymdb.ca/compounds/" + data[i]["ymdb_id"];
        ymdb_preface = "YMDB: ";
        //ymdb_secondary = 'YMDB: <a href={href} rel="noopener"> {data[i]["ymdb_id"] } </a>'

        //"YMDB ID: " + data[i]["ymdb_id"] + "ECMDB ID: " + data[i]["m2m_id"]
      }

      if (data[i]["m2m_id"] != null) {
        if (ymdb_preface !== "") {
          comma = ", ";
        }

        href_ecmdb = "http://ecmdb.ca/compounds/" + data[i]["m2m_id"];
        ecmdb_preface = "ECMDB: ";
        //ecmdb_secondary = 'ECMDB: <a href={href} rel="noopener"> {data[i]["m2m_id"]} </a>';
      }
      new_dict["secondary_text"] = (
        <div className="external-links">
          <p>
            {ymdb_preface} <a href={href_ymdb}>{data[i]["ymdb_id"]}</a>
            {comma}
            {ecmdb_preface}{" "}
            <a href={href_ecmdb} rel="noopener">
              {" "}
              {data[i]["m2m_id"]}{" "}
            </a>
          </p>
        </div>
      );
      new_dict["url"] = "/metabolite/" + name + "/" + organism;
      newMetaboliteMetadataDict[inchi_key] = new_dict;
    }
  }

  let metaboliteMetadata = Object.keys(newMetaboliteMetadataDict).map(function(
    key
  ) {
    return newMetaboliteMetadataDict[key];
  });
  return metaboliteMetadata;
}

export { formatMetabolite };
