function getResultsUrl(query, pageCount, pageSize) {
  const indexQueryArg = "sabio_reaction_entries";
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

function getResults(data) {
  return data["sabio_reaction_entries"];
}

function formatPart(parts) {
  let participantsString = "";
  for (var i = parts.length - 1; i >= 0; i--) {
    participantsString = participantsString + parts[i] + " + ";
  }
  participantsString = participantsString.substring(
    0,
    participantsString.length - 3
  );
  return participantsString;
}

function getParticipant(participants) {
  let partNames = [];
  for (var i = 0; i < participants.length; i++) {
    partNames.push(participants[i][participants[i].length - 1]);
  }
  return partNames;
}

function formatResults(data) {
  let newReactionMetadataDict = {};
  for (var i = 0; i < data.length; i++) {
    let reactionID = data[i]["rxn_id"];
    let newDict = newReactionMetadataDict[reactionID];
    if (!newDict) {
      newDict = {};
    }
    let substrates = getParticipant(data[i]["substrate_names"]);
    let products = getParticipant(data[i]["product_names"]);
    newDict["reactionID"] = reactionID;
    newDict["substrates"] = substrates;
    newDict["products"] = products;

    let reactionName = data[i]["enzyme_names"][0];
    let reactionEq = formatPart(substrates) + " → " + formatPart(products);
    if (reactionName) {
      newDict["title"] =
        reactionName[0].toUpperCase() +
        reactionName.substring(1, reactionName.length);
    } else {
      newDict["title"] = reactionEq;
    }
    newDict["description"] = reactionEq;

    //formatPart(substrates) + ' ==> ' + formatPart(products)

    newDict["route"] =
      "/reaction/data/?substrates_inchi=" +
      substrates +
      "&products_inchi=" +
      products;

    newReactionMetadataDict[reactionID] = newDict;
    //newReactionMetadataDict.push(meta);
  }

  let reactionMetadata = Object.keys(newReactionMetadataDict).map(function(
    key
  ) {
    return newReactionMetadataDict[key];
  });
  return reactionMetadata;
}

export { getResultsUrl, getResults, formatResults };
