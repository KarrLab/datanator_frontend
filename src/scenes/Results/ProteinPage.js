// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import filterFactory, {
  textFilter,
  selectFilter,
} from 'react-bootstrap-table2-filter';
import ReactDOM from 'react-dom';
import {
  Input,
  Col,
  Row,
  Select,
  InputNumber,
  DatePicker,
  AutoComplete,
  Cascade,
  Button,
} from 'antd';
import 'antd/dist/antd.css';
import ProtAbundancesTable from '~/components/Results/ProtAbundancesTable.js';
import ProtSearch from '~/components/SearchField/ProtSearch.js';
import { PropTypes } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import './MetabConcs.css';

import { getSearchData } from '~/services/MongoApi';
import { MetaboliteInput } from '~/components/SearchField/MetaboliteInput';
import { OrganismInput } from '~/components/SearchField/OrganismInput';
import { OrthologyGroup } from '~/components/Definitions/OrthologyGroup';

import { setNewUrl, abstractMolecule } from '~/data/actions/pageAction';

import store from '~/data/Store';

@connect(store => {
  return {
    //currentUrl: store.page.url,
    moleculeAbstract: store.page.moleculeAbstract,
  };
}) //the names given here will be the names of props
class ProteinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      proteinMetadata:[
        ],
      f_abundances:null,
      organism: '',
      dataSource: [],
      orig_json: null,
      newSearch: false,
      new_url: '',
    };

    this.getNewSearch = this.getNewSearch.bind(this);
    this.formatProteinMetadata = this.formatProteinMetadata.bind(this);
    this.processProteinData = this.processProteinData.bind(this);
    this.formatData = this.formatData.bind(this);


    this.checkURL = this.checkURL.bind(this);
  }
  componentDidMount() {
    console.log('hello');
    this.checkURL();
  }

  componentDidUpdate(prevProps) {
    // respond to parameter change in scenario 3
    console.log('comp');

    if (
      this.props.match.params.molecule != prevProps.match.params.molecule ||
      this.props.match.params.organism != prevProps.match.params.organism ||
      this.props.match.params.searchType != prevProps.match.params.searchType
    ) {
      this.checkURL();
    }
  }

  checkURL() {
    let url =
      '/protein/' +
      this.props.match.params.searchType +
      '/' +
      this.props.match.params.molecule;
    if (this.props.match.params.organism) {
      url = url + '/' + this.props.match.params.organism;
    }
    this.setState({ newSearch: false });
    this.setState({ new_url: url });
    this.getSearchData();
  }

  getSearchData() {
    if (this.props.match.params.searchType == 'uniprot') {
      getSearchData([
        'proteins',
        'super/same-kegg?uniprot_id=' + this.props.match.params.molecule,
      ]).then(response => {
        this.processProteinData(response.data)
      });
    } else if (this.props.match.params.searchType == 'name') {
      console.log('BUILD ME');
      let uniprot_id = "";
      console.log(this.props.match.params.organism)
      console.log(this.props.match.params.molecule)
      getSearchData([
        'proteins',
        'meta?protein_name=' + this.props.match.params.molecule +  '&species_name=' + this.props.match.params.organism,
      ]).then(response => {this.formatProteinMetadata(response.data);
        uniprot_id = response.data;
        console.log(response.data)
      });
      console.log(uniprot_id)
      this.setState({f_abundances:null})
    }
  }

  formatProteinMetadata(data){
    let newProteinMetadata = []
    let start = 0
      if ("ko_number" in data[0]){
        start = 1
      }
    for (var i = start; i < data.length; i++) {
      let meta = {}
      meta["uniprot"] = data[i].uniprot_id
      meta["protein_name"] = data[i].protein_name
      meta["gene_name"] = data[i].gene_name
      newProteinMetadata.push(meta)
    }
    console.log(newProteinMetadata)
    console.log(data)
    this.setState({proteinMetadata:newProteinMetadata})

  }

  processProteinData(data){
    if (typeof(data) != "string"){
      this.setState({ orig_json: data })
      this.formatData(data)
      this.formatProteinMetadata(data)
    }
    else{

      getSearchData([
        'proteins',
        'meta?uniprot_id=' + this.props.match.params.molecule
      ]).then(response => {
        this.formatData(response.data);
        this.formatProteinMetadata(response.data)
        });

    }
  }

  formatData(data) {
    var f_abundances = [];
    console.log(data)
    if ((data != null) && (typeof(data) != "string")) {
      console.log(data)
      let start = 0
      if ("ko_number" in data[0]){
        start = 1
      }
      for (var i = start; i < data.length; i++) {
        console.log(data[i])
        let uniprot = data[i]
        for (var n = 0; n < uniprot.abundances.length; n++){
          let row = {}
          row["abundance"] = uniprot.abundances[n].abundance
          row["organ"] = uniprot.abundances[n].organ
          row["gene_symbol"] = uniprot.gene_name
          row["organism"] = uniprot.species_name
          row["uniprot_id"] = uniprot.uniprot_id
          row["protein_name"] = uniprot.protein_name
          f_abundances.push(row)
        }
      }
      console.log(f_abundances)
      this.setState({
        f_abundances: f_abundances,
      });
    } else {
      alert('Nothing Found');
    }
  }



  getNewSearch(url) {
    if (url !== this.state.new_url) {
      this.setState({ newSearch: true, new_url: url });
    }
  }

  render() {
    if (this.state.newSearch == true) {
      console.log('Redirecting');
      return <Redirect to={this.state.new_url} push />;
    }
    console.log(this.state.proteinMetadata)
    console.log('Rendering ProteinPage');

    const Search = Input.Search;
    let styles = {
      marginTop: 50,
    };
    console.log(this.props.match.params.molecule);
    console.log(this.props.match.params.organism);
    return (
      <div className="container" style={styles}>
        <style>{'body { background-color: #f7fdff; }'}</style>
        <div className="search">
          <ProtSearch
            handleClick={this.getNewSearch}
            landing={false}
            defaultMolecule={this.props.match.params.molecule}
            defaultUniprot={this.props.match.params.molecule}
            defaultOrganism={this.props.match.params.organism}
            searchType={this.props.match.params.searchType}
          />
        </div>
        <div className="definition_data">
          <OrthologyGroup
          proteinMetadata={this.state.proteinMetadata}
          />
        </div>
        <br />
        <br />
        <div className="results">
          <ProtAbundancesTable
            f_abundances = {this.state.f_abundances}
            handleAbstract={this.getAbstractSearch}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(ProteinPage);
