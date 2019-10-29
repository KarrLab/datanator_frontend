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
import {
  getTotalColumns,
  filter_taxon,
  set_lineage,
  setTotalData,
} from '~/data/actions/resultsAction';

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
      data_arrived: false,
      newSearch: false,
      new_url: '',
      tanitomo: false
    };

    this.getNewSearch = this.getNewSearch.bind(this);
    this.formatData = this.formatData.bind(this);
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
          '/true',
      });
    }

    if (!(this.props.match.params.abstract == 'true')) {
      if (this.props.moleculeAbstract==true){
      this.props.dispatch(abstractMolecule(false));
      }
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
    let abs_default = false
    if (this.props.match.params.abstract == "true")
    { 
      abs_default = true
    }
    getSearchData([
      'metabolites/concentration/?abstract=' + abs_default + '&species='
      + this.props.match.params.organism + '&metabolite=' + this.props.match.params.molecule
    ]).then(response => {
      this.formatData(response.data);
    }).catch(err => {
    alert("Nothing Found");
    this.setState({ orig_json: null })
  }

    );
  

  }

  getNewSearch(response) {
    let url = '/metabconcs/' + response[0] + '/' + response[1];
    if (
      response[0] !== this.props.match.params.molecule ||
      response[1] !== this.props.match.params.organism
    ) {
      this.setState({ new_url: url });
      this.setState({ newSearch: true });
    }
  }


  formatData(data) {
    if (data != null) {
      var f_concentrations = [];

      this.props.dispatch(set_lineage(data[2][0]));

      for (var n = data[0].length; n > 0; n--) {
        if (data[0][n - 1].tanitomo_similarity < 1) {
          this.setState({ tanitomo: true });
        } else {
          this.setState({ tanitomo: false });
        }

        var concs = data[0][n - 1].concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (var key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (concs.hasOwnProperty(key)) {
                concs[key] = [concs[key]];
              }
            }
          }
          for (var i = concs.concentration.length - 1; i >= 0; i--) {
            var growth_phase = '';
            var organism = 'Escherichia coli';

            if (concs.growth_status[i] != null) {
              if (
                concs.growth_status[i].toLowerCase().indexOf('stationary') >= 0
              ) {
                growth_phase = 'Stationary Phase';
              } else if (
                concs.growth_status[i].toLowerCase().indexOf('log') >= 0
              ) {
                growth_phase = 'Log Phase';
              }
            }
            if ('strain' in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + ' ' + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: data[0][n - 1].name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_conditions: concs.growth_system[i],
              growth_media: concs.growth_media[i],
              taxonomic_proximity: data[0][n - 1].taxon_distance,
              tanitomo_similarity: data[0][n - 1].tanitomo_similarity,
            });
          }
        }
      }

      for (var n = data[1].length; n > 0; n--) {
        if (data[1][n - 1].tanitomo_similarity < 1) {
          this.setState({ tanitomo: true });
        }

        var concs = data[1][n - 1].concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (var key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (concs.hasOwnProperty(key)) {
                concs[key] = [concs[key]];
              }
            }
          }
          for (var i = concs.concentration.length - 1; i >= 0; i--) {
            var growth_phase = '';
            var organism = data[1][n - 1].species;
            if ('strain' in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + ' ' + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: data[1][n - 1].name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_media: concs.growth_media[i],
              taxonomic_proximity: data[1][n - 1].taxon_distance,
              tanitomo_similarity: data[1][n - 1].tanitomo_similarity,
            });
          }
        }
      }

      
      this.props.dispatch(setTotalData(f_concentrations));
      this.setState({
        data_arrived: true,
        //displayed_data: f_concentrations
      });
    } else {
      //alert('Nothing Found');
    }
  }

  render() {
    console.log('Rendering MetabConcs');
    if (this.state.newSearch == true) {
      console.log('Redirecting');
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
            //json_data={this.state.orig_json}
            data_arrived = {this.state.data_arrived}
            handleAbstract={this.getAbstractSearch}
            tanitomo = {this.state.tanitomo}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(MetabConcs);
