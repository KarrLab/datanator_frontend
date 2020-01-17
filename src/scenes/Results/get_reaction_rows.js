import './MetabConcs.scss';

function getReactionID(resource) {
  for (var i = 0; i < resource.length; i++)
    if (resource[i].namespace === 'sabiork.reaction') {
      return resource[i].id;
    }
}

function getSubstrates(substrate) {
  let subNames = [];
  for (var i = 0; i < substrate.length; i++) {
    subNames.push(substrate[i].substrate_name);
  }
  return subNames;
}

function getProducts(product) {
  let subNames = [];
  for (var i = 0; i < product.length; i++) {
    subNames.push(product[i].product_name);
  }
  return subNames;
}

function formatPart(parts) {
  let participants_string = '';
  for (var i = parts.length - 1; i >= 0; i--) {
    participants_string = participants_string + parts[i] + ' + ';
  }
  participants_string = participants_string.substring(
    0,
    participants_string.length - 3,
  );
  return participants_string;
}

function getSubstrateInchiKey(substrate) {
  let inchiKeys = [];
  for (var i = 0; i < substrate.length; i++) {
    inchiKeys.push(substrate[i].substrate_structure[0].InChI_Key);
  }
  return inchiKeys;
}

function getProductInchiKey(product) {
  let inchiKeys = [];
  for (var i = 0; i < product.length; i++) {
    inchiKeys.push(product[i].product_structure[0].InChI_Key);
  }
  return inchiKeys;
}

function getKcat(parameters) {
  let kinetic_params = {};
  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].name === 'k_cat'){
      kinetic_params["kcat"] = parameters[i].value
    }
  }
  return kinetic_params;
}

function getKm(parameters, substrates) {
  let kms = {};
  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].type === '27' && substrates.includes(parameters[i]['name'])){
      kms["km_" + parameters[i]['name']] = parameters[i].value
    }
  }
  return kms;
}


function getParticipant(participants) {
  let partNames = [];
  console.log("REACTION STUFF " + participants.toString())
  for (var i = 0; i < participants.length; i++) {
    console.log("REACTION STUFF " + participants[i][participants[i].length-1])
    partNames.push(participants[i][participants[i].length-1]);
  }
  console.log("REACTION STUFF " + partNames.toString())
  return partNames;
}




  function formatReactionMetadata(data) {
    console.log('ReactionPage: Calling formatReactionMetadata');
    let newReactionMetadataDict = {};
    let reaction_results = []
    let start = 0;
    for (var i = start; i < data.length; i++) {
      let reactionID = data[i]['rxn_id']//getReactionID(data[i].resource);
      let new_dict = newReactionMetadataDict[reactionID];
      if (!new_dict) {
        new_dict = {};
      }
      let substrates = getParticipant(data[i]['substrate_names'])
      //getSubstrates(data[i].reaction_participant[0].substrate);
      let products =  getParticipant(data[i]['product_names']);
      new_dict['reactionID'] = reactionID;
      new_dict['substrates'] = substrates
      new_dict['products'] = products

      let reaction_name = data[i]['enzyme_names'][0]
      let reaction_equation = formatPart(substrates) + ' → ' + formatPart(products)
      if (reaction_name){
        new_dict['primary_text'] = reaction_name[0].toUpperCase() + reaction_name.substring(1,reaction_name.length)
      }
      else{
        new_dict['primary_text'] = reaction_equation
      }
      new_dict['secondary_text'] = reaction_equation



      //formatPart(substrates) + ' ==> ' + formatPart(products)

      let sub_inchis = data[i]["substrates"];
      let prod_inchis = data[i]["products"];

      new_dict['url'] = "/reaction/data/?substrates_inchi="+ substrates + "&products_inchi=" + products


      newReactionMetadataDict[reactionID] = new_dict;
      //console.log(new_dict);
      //newReactionMetadataDict.push(meta);
    }

    let reactionMetadata = Object.keys(newReactionMetadataDict).map(function(key) {
        return newReactionMetadataDict[key];
      })
    return(reactionMetadata)
  }



export {formatReactionMetadata}