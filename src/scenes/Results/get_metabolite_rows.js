// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './MetabConcs.scss';

import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';

import { Header } from '~/components/Header/Header';
import { Footer } from '~/components/Footer/Footer';
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
    let name = data[i]["name"]
    if (name == "No metabolite found."){
      name = data[i]['synonyms'][0]
    }
    let href_ymdb = null
    let href_ecmdb = null
    let ymdb_preface = ""
    let ecmdb_preface = ""
    let comma = ""

    new_dict['primary_text'] = name[0].toUpperCase() + name.substring(1,name.length)
    let description = []
    if (data[i]["ymdb_id"] != null){
      //description = description + "YMDB: " + data[i]["ymdb_id"]
      href_ymdb = "http://www.ymdb.ca/compounds/" + data[i]["ymdb_id"]
      ymdb_preface = "YMDB: " 
       //ymdb_secondary = 'YMDB: <a href={href} rel="noopener"> {data[i]["ymdb_id"] } </a>'

      //description.push(<p> YMDB: <a href={href} rel="noopener"> {data[i]["ymdb_id"] } </a></p>)
      //"YMDB ID: " + data[i]["ymdb_id"] + "ECMDB ID: " + data[i]["m2m_id"]
    }
    
    if (data[i]["m2m_id"] != null){
      
      if (ymdb_preface != ""){
        comma = ", "
      }
      
      //description = description + "ECMDB: " + data[i]["m2m_id"]
      href_ecmdb = "http://ecmdb.ca/compounds/" + data[i]["m2m_id"]
      ecmdb_preface = "ECMDB: "
      //ecmdb_secondary = 'ECMDB: <a href={href} rel="noopener"> {data[i]["m2m_id"]} </a>'
    } 
    let max_len = 150
    new_dict['secondary_text'] = 
    <div className="external_links">
    <p> 

    {ymdb_preface} <a href={href_ymdb}>{data[i]["ymdb_id"]}</a>{comma}{ecmdb_preface} <a href={href_ecmdb} rel="noopener"> {data[i]["m2m_id"]} </a>


     </p>
     </div>
    /*
    if (description.length <= max_len || description == null){
      new_dict['secondary_text'] = description
    }
    else{
      new_dict['secondary_text'] = description.substring(0, description.indexOf(" ", max_len)) + " ..."
    }
    */
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
