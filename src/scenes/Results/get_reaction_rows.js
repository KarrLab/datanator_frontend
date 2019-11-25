// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input } from 'antd';
import 'antd/dist/antd.css';
import ReactionTable from '~/components/Results/ReactionTable.js';
import ReactionSearch from '~/components/SearchField/ReactionSearch.js';
import { PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './MetabConcs.css';

import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';
import { ReactionDefinition } from '~/components/Definitions/ReactionDefinition';

import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';
const queryString = require('query-string');

function getReactionID(resource) {
  for (var i = 0; i < resource.length; i++)
    if (resource[i].namespace == 'sabiork.reaction') {
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
    if (parameters[i].name == 'k_cat'){
      kinetic_params["kcat"] = parameters[i].value
    }
  }
  return kinetic_params;
}

function getKm(parameters, substrates) {
  let kms = {};
  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].type == '27' && substrates.includes(parameters[i]['name'])){
      kms["km_" + parameters[i]['name']] = parameters[i].value
    }
  }
  return kms;
}





  function formatReactionMetadata(data) {
    console.log('ReactionPage: Calling formatReactionMetadata');
    let newReactionMetadataDict = {};
    let reaction_results = []
    let start = 0;
    for (var i = start; i < data.length; i++) {
      let reactionID = getReactionID(data[i].resource);
      let new_dict = newReactionMetadataDict[reactionID];
      if (!new_dict) {
        new_dict = {};
      }
      let substrates = getSubstrates(data[i].reaction_participant[0].substrate);
      let products = getProducts(data[i].reaction_participant[1].product);
      new_dict['reactionID'] = reactionID;
      new_dict['substrates'] = substrates;
      new_dict['products'] = products;

      let reaction_name = data[i]['enzymes'][0]['enzyme'][0]['enzyme_name']
      let reaction_equation = formatPart(substrates) + ' -> ' + formatPart(products)
      if (reaction_name){
        new_dict['primary_text'] = reaction_name[0].toUpperCase() + reaction_name.substring(1,reaction_name.length)
      }
      else{
        new_dict['primary_text'] = reaction_equation
      }
      new_dict['secondary_text'] = reaction_equation



      //formatPart(substrates) + ' ==> ' + formatPart(products)

      let sub_inchis = getSubstrateInchiKey(
        data[i].reaction_participant[0].substrate,
      );
      let prod_inchis = getProductInchiKey(
        data[i].reaction_participant[1].product,
      );

      new_dict['url'] = "/reaction/data/?substrates_inchi="+ sub_inchis + "&products_inchi=" + prod_inchis


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