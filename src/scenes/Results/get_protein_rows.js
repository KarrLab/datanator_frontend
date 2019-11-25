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

function formatProteinMetadata(data, organism) {
  console.log('Calling formatOrthologyMetadataUniprot');
  let start = 0;
  let newProteinMetadataDict = {};
  for (var i = start; i < data.length; i++) {
    if (data[i].ko_number){
    let ko_number = data[i].ko_number;
    console.log(ko_number)
    let new_dict = newProteinMetadataDict[ko_number];
    if (!new_dict) {
      new_dict = {};
    }

    new_dict['primary_text'] = ko_number + ": " + data[i]["ko_name"][0]
    new_dict['secondary_text'] = ""
    new_dict["url"] = "/protein/ko/mol/?ko=" + ko_number + "&organism=" + organism

    newProteinMetadataDict[ko_number] = new_dict;}
  }

    let proteinMetadata = Object.keys(newProteinMetadataDict).map(function(key) {
    return newProteinMetadataDict[key];});
    console.log("HERE!!!!")
    console.log(proteinMetadata)
  return proteinMetadata;


  
}


export { formatProteinMetadata };
