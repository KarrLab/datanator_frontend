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
    currentUrl: store.page.url,
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
    };

    this.getNewSearch = this.getNewSearch.bind(this);
    this.getAbstractSearch = this.getAbstractSearch.bind(this);
    var url =
      'http://localhost:5000/results/' +
      this.props.match.params.molecule +
      '/' +
      this.props.match.params.organism;
  }
  componentDidMount() {
    console.log('hello');
    this.setState({
      abstract_search: this.props.match.params.abstract,
    });
    this.getSearchData();
  }

  componentDidUpdate(prevProps) {
    // respond to parameter change in scenario 3
    console.log('comp');

    if (this.props.currentUrl != prevProps.currentUrl) {
      console.log('yipikayee');
      console.log(this.props.currentUrl);
      console.log(prevProps.currentUrl);
      this.props.history.push(this.props.currentUrl);
      //return <Redirect to={this.props.newRedirect}/>
    }
    if (
      this.props.moleculeAbstract == true &&
      prevProps.moleculeAbstract == false
    ) {
      this.props.history.push(
        '/metabconcs/' +
          this.props.match.params.molecule +
          '/' +
          this.props.match.params.organism +
          '/True',
      );
    }
    if (
      this.props.match.params.molecule != prevProps.match.params.molecule ||
      this.props.match.params.organism != prevProps.match.params.organism
    ) {
      console.log('UPDATIONG!!!');
      this.getSearchData();
    }
  }

  getSearchData() {
    getSearchData([
      'proteins',
      'abundance?uniprot_id=P08237'
    ]).then(response => {
      this.setState({ orig_json: response.data });
    });
  }

  getNewSearch(url) {
    console.log(url);
    //url = url + '/False';
    this.props.dispatch(abstractMolecule(false));
    this.props.dispatch(setNewUrl(url));
    //this.setState({ newSearch: true, newRedirect: url });
  }

  getAbstractSearch() {
    //this.setState({abstract_search:true,})
    this.setState({
      newSearch: true,
      newRedirect:
        '/metabconcs/' +
        this.props.match.params.molecule +
        '/' +
        this.props.match.params.organism +
        '/True',
    });
  }

  render() {
    //if (this.state.toMetabConc == true) {
    //  return <BrowserRouter><Redirect to='/dashboard' /></BrowserRouter>
    //}
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
            defaultOrganism={this.props.match.params.organism}
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

export default withRouter(ProteinPage); //
