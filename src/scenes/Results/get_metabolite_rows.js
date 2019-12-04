// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input } from 'antd';
import 'antd/dist/antd.css';

import { PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './MetabConcs.css';

import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';

import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';
const queryString = require('query-string');

function formatMetaboliteMetadata(data, organism) {
  console.log('Calling formatMetaboliteMetadata');
  console.log(data)
  let start = 0;
  let newMetaboliteMetadataDict = {};
  for (var i = start; i < data.length; i++) {
    if (data[i].InChI_Key){
    let inchi_key = data[i].InChI_Key;
    console.log("INCHI: " + inchi_key)
    let new_dict = newMetaboliteMetadataDict[inchi_key];
    if (!new_dict) {
      new_dict = {};
    }
    let name = data[i]["synonyms"][0]
    new_dict['primary_text'] = name[0].toUpperCase() + name.substring(1,name.length)
    let description = "YMDB ID: " + data[i]["ymdb_id"] + "ECMDB ID: " + data[i]["m2m_id"]
    let max_len = 150
    if (description.length <= max_len || description == null){
      new_dict['secondary_text'] = description
    }
    else{
      new_dict['secondary_text'] = description.substring(0, description.indexOf(" ", max_len)) + " ..."
    }
    new_dict["url"] = "/metabconcs/" + name + "/" + organism
    newMetaboliteMetadataDict[inchi_key] = new_dict;}
  }

    let metaboliteMetadata = Object.keys(newMetaboliteMetadataDict).map(function(key) {
    return newMetaboliteMetadataDict[key];});
    console.log("HERE!!!!")
    console.log(metaboliteMetadata)
  return metaboliteMetadata;


  
}


export { formatMetaboliteMetadata };
