// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Input,
} from 'antd';
import 'antd/dist/antd.css';
import ReactionTable from '~/components/Results/ReactionTable.js';
import ReactionSearch from '~/components/SearchField/ReactionSearch.js';
import { PropTypes } from 'react';
import {Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './MetabConcs.css';

import { getSearchData } from '~/services/MongoApi';
import {
  set_lineage,
  setTotalData,
} from '~/data/actions/resultsAction';

import {Header} from '~/components/Layout/Header/Header';
import {Footer} from '~/components/Layout/Footer/Footer';
const queryString = require('query-string');


@connect(store => {
  return {
  };
}) //the names given here will be the names of props
class ReactionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      data_arrived: false,
      newSearch: false,
      new_url: '',
      tanitomo: false,
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
      this.props.match.params.molecule != prevProps.match.params.molecule ||
      this.props.match.params.organism != prevProps.match.params.organism 
    ) {
      this.setState({ newSearch: false });
      this.getSearchData();
    }
  }

  getSearchData() {

    getSearchData([
      'metabolites/concentration/?abstract=' +
        false +
        '&species=' + 'Escherichia coli' +
        '&metabolite=' +
        'ATP',
    ])
      .then(response => {
        this.formatData(response.data);
      })
      .catch(err => {
        alert('Nothing Found');
        this.setState({ orig_json: null });
      });
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

      //this.props.dispatch(set_lineage(data[2][0]));
      getSearchData([
          'taxon',
          'canon_rank_distance_by_name/?name=' + 'Escherichia coli'
        ]).then(

        response => {
          this.props.dispatch(set_lineage(response.data))
        });

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
    const values = queryString.parse(this.props.location.search)
    console.log(values.substrates.split(",")[0])


    if (this.state.newSearch == true) {
      console.log('Redirecting');
      return <Redirect to={this.state.new_url} push />;
    }

    let styles = {
      marginTop: 50,
    };

    return (
      <div className="container" style={styles}>
      <Header />
        <style>{'body { background-color: #f7fdff; }'}</style>
        <div className="search">
          <ReactionSearch
            handleClick={this.getNewSearch}
            landing={false}
            defaultMolecule={this.props.match.params.molecule}
            defaultOrganism={this.props.match.params.organism}
          />
        </div>
        <br />
        <br />
        <div className="results">
          <ReactionTable
            data_arrived={this.state.data_arrived}
            tanitomo={this.state.tanitomo}
            km_values = {["km_ATP", "km_AMP"]}
          />
        </div>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(ReactionPage);
