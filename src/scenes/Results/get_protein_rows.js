// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './MetabConcs.css';

import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';

import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';
const queryString = require('query-string');

function formatProteinMetadata(data, organism) {
  console.log('Calling formatOrthologyMetadataUniprot');
  let start = 0;
  let newProteinMetadataDict = {};
  for (var i = start; i < data.length; i++) {
    let ko_number = data[i]['key'];
    if (ko_number != "nan"){

      let new_dict = newProteinMetadataDict[ko_number];
    if (!new_dict) {
      new_dict = {};
    }
    let name = data[i].top_ko.hits.hits[0]._source.ko_name[0]
    console.log(name)
    new_dict['primary_text'] = name[0].toUpperCase() + name.substring(1,name.length)
    let href = "https://www.genome.jp/dbget-bin/www_bget?ko:" + ko_number
    new_dict['secondary_text'] = 
    <p> 

    KEGG: <a href={href} rel="noopener"> {ko_number} </a>


     </p>
    new_dict["url"] = "/protein/ko/mol/?ko=" + ko_number + "&organism=" + organism

    newProteinMetadataDict[ko_number] = new_dict;

    }

  }

    let proteinMetadata = Object.keys(newProteinMetadataDict).map(function(key) {
    return newProteinMetadataDict[key];});
    console.log("HERE!!!!")
  return proteinMetadata;


  
}


export { formatProteinMetadata };
