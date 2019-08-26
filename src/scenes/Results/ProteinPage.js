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
      organism: '',
      dataSource: [],
      orig_json: null,
      newSearch: false,
      newRedirect: '',
      new_url: '',
    };

    this.getNewSearch = this.getNewSearch.bind(this);
      this.checkURL = this.checkURL.bind(this);

  }
  componentDidMount() {
    console.log('hello');
    this.checkURL()
  }

  componentDidUpdate(prevProps) {
    // respond to parameter change in scenario 3
    console.log('comp');

    if (
      this.props.match.params.molecule != prevProps.match.params.molecule ||
      this.props.match.params.organism != prevProps.match.params.organism ||
      this.props.match.params.searchType != prevProps.match.params.searchType
    ) {
      this.checkURL()
  }
}

  checkURL(){
    let url = "/protein/" + this.props.match.params.searchType + "/" + this.props.match.params.molecule
    if (this.props.match.params.organism){
        url = url + "/" + this.props.match.params.organism
      }
    this.setState({ newSearch: false });
    this.setState({new_url:url})
    this.getSearchData();
  }

  getSearchData() {
    if (this.props.match.params.searchType == "uniprot"){


    getSearchData([
      'proteins',
      'super/same-kegg?uniprot_id=' + this.props.match.params.molecule
    ]).then(response => {
      this.setState({ orig_json: response.data });
    });
  }
  else if (this.props.match.params.searchType == "name"){
    console.log("BUILD ME")
    getSearchData([
      'proteins',
      'super/same-kegg?uniprot_id=' + this.props.match.params.molecule
    ]).then(response => {
      this.setState({ orig_json: response.data });
    });}
  }
  

  getNewSearch(url) {
    if (url !== this.state.new_url){

      this.setState({ newSearch: true, new_url: url })
    }
  }



  render() {

    if (this.state.newSearch == true) {
      console.log("Redirecting")
      return <Redirect to={this.state.new_url} push />;
    }
    console.log("Rendering ProteinPage")

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
        <br />
        <br />
        <div className="results">
            <ProtAbundancesTable
              json_data={this.state.orig_json}
              handleAbstract={this.getAbstractSearch}
            />
        </div>
      </div>
    );
  }
}

export default withRouter(ProteinPage);
