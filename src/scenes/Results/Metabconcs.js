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
import ConcentrationsTable from '~/components/Results/ConcentrationsTable.js';
import ConcSearch from '~/components/SearchField/ConcSearch.js';
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
    moleculeAbstract: store.page.moleculeAbstract,
  };
}) //the names given here will be the names of props
class MetabConcs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      orig_json: null,
      newSearch: false,
      new_url: '',
    };

    this.getNewSearch = this.getNewSearch.bind(this);

  }
  componentDidMount() {
    this.setState({
      newSearch: false,
    });
    this.getSearchData();
  }

  componentDidUpdate(prevProps) {

    if (
      this.props.moleculeAbstract == true &&
      prevProps.moleculeAbstract == false
    ) {
      this.setState({
        newSearch: true,
        new_url:
          '/metabconcs/' +
          this.props.match.params.molecule +
          '/' +
          this.props.match.params.organism +
          '/True',
      });
    } 

    if (!(this.props.match.params.abstract=="True")){
      this.props.dispatch(abstractMolecule(false))
    }

    if (
      this.props.match.params.molecule != prevProps.match.params.molecule ||
      this.props.match.params.organism != prevProps.match.params.organism ||
      this.props.match.params.abstract != prevProps.match.params.abstract
    ) {
      this.setState({ newSearch: false });
      this.getSearchData();
    }
  }



  getSearchData() {
    getSearchData([
      'search',
      'concentration',
      this.props.match.params.molecule,
      this.props.match.params.organism,
      this.props.match.params.abstract,
    ]).then(response => {
      this.setState({ orig_json: response.data });
    });
  }

  getNewSearch(response) {

    let url = '/metabconcs/' + response[0] + '/' + response[1];
    if (response[0] !== this.props.match.params.molecule || response[1] !== this.props.match.params.organism ) {
      this.setState({ new_url: url });
      this.setState({ newSearch: true });
    }

  }





  render() {
    console.log('Rendering MetabConcs');
    if (this.state.newSearch == true) {
      console.log("Redirecting")
      return <Redirect to={this.state.new_url} push />;
    }

    const Search = Input.Search;
    let styles = {
      marginTop: 50,
    };

    return (
      <div className="container" style={styles}>
        <style>{'body { background-color: #f7fdff; }'}</style>
        <div className="search">
          <ConcSearch
            handleClick={this.getNewSearch}
            landing={false}
            defaultMolecule={this.props.match.params.molecule}
            defaultOrganism={this.props.match.params.organism}
          />
        </div>
        <br />
        <br />
        <div className="results">
          <ConcentrationsTable
            json_data={this.state.orig_json}
            handleAbstract={this.getAbstractSearch}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(MetabConcs);
