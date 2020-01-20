function formatPart(parts) {
  let participants_string = "";
  for (var i = parts.length - 1; i >= 0; i--) {
    participants_string = participants_string + parts[i] + " + ";
  }
  participants_string = participants_string.substring(
    0,
    participants_string.length - 3
  );
  return participants_string;
}

function getParticipant(participants) {
  let partNames = [];
  for (var i = 0; i < participants.length; i++) {
    partNames.push(participants[i][participants[i].length - 1]);
  }
  return partNames;
}

function formatReaction(data) {
  let newReactionMetadataDict = {};
  let start = 0;
  for (var i = start; i < data.length; i++) {
    let reactionID = data[i]["rxn_id"];
    let new_dict = newReactionMetadataDict[reactionID];
    if (!new_dict) {
      new_dict = {};
    }
    let substrates = getParticipant(data[i]["substrate_names"]);
    let products = getParticipant(data[i]["product_names"]);
    new_dict["reactionID"] = reactionID;
    new_dict["substrates"] = substrates;
    new_dict["products"] = products;

    let reaction_name = data[i]["enzyme_names"][0];
    let reaction_equation =
      formatPart(substrates) + " → " + formatPart(products);
    if (reaction_name) {
      new_dict["primary_text"] =
        reaction_name[0].toUpperCase() +
        reaction_name.substring(1, reaction_name.length);
    } else {
      new_dict["primary_text"] = reaction_equation;
    }
    new_dict["secondary_text"] = reaction_equation;

    //formatPart(substrates) + ' ==> ' + formatPart(products)

    new_dict["url"] =
      "/reaction/data/?substrates_inchi=" +
      substrates +
      "&products_inchi=" +
      products;

    newReactionMetadataDict[reactionID] = new_dict;
    //newReactionMetadataDict.push(meta);
  }

  let reactionMetadata = Object.keys(newReactionMetadataDict).map(function(
    key
  ) {
    return newReactionMetadataDict[key];
  });
  return reactionMetadata;
}

export { formatReaction };
