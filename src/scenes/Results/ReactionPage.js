// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input } from 'antd';
import 'antd/dist/antd.css';
import ReactionTable from '~/components/Results/ReactionTable.js';
import ReactionSearch from '~/components/SearchField/ReactionSearch.js';
import { PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './MetabConcs.css';

import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';
import { ReactionDefinition } from '~/components/Definitions/ReactionDefinition';

import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';
const queryString = require('query-string');

function getReactionID(resource) {
  for (var i = 0; i < resource.length; i++)
    if (resource[i].namespace == 'sabiork.reaction') {
      return resource[i].id;
    }
}

function getSubstrates(substrate) {
  let subNames = [];
  for (var i = 0; i < substrate.length; i++) {
    subNames.push(substrate[i].substrate_name);
  }
  return subNames;
}

function getProducts(product) {
  let subNames = [];
  for (var i = 0; i < product.length; i++) {
    subNames.push(product[i].product_name);
  }
  return subNames;
}

function formatPart(parts) {
  let participants_string = '';
  for (var i = parts.length - 1; i >= 0; i--) {
    participants_string = participants_string + parts[i] + ' + ';
  }
  participants_string = participants_string.substring(
    0,
    participants_string.length - 3,
  );
  return participants_string;
}

function getSubstrateInchiKey(substrate) {
  let inchiKeys = [];
  for (var i = 0; i < substrate.length; i++) {
    inchiKeys.push(substrate[i].substrate_structure[0].InChI_Key);
  }
  return inchiKeys;
}

function getProductInchiKey(product) {
  let inchiKeys = [];
  for (var i = 0; i < product.length; i++) {
    inchiKeys.push(product[i].product_structure[0].InChI_Key);
  }
  return inchiKeys;
}

function getKcat(parameters) {
  let kinetic_params = {};
  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].name == 'k_cat'){
      kinetic_params["kcat"] = parameters[i].value
    }
  }
  return kinetic_params;
}

function getKm(parameters, substrates) {
  let kms = {};
  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].type == '27' && substrates.includes(parameters[i]['name'])){
      kms["km_" + parameters[i]['name']] = parameters[i].value
    }
  }
  return kms;
}

@connect(store => {
  return {};
}) //the names given here will be the names of props
class ReactionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      data_arrived: false,
      newSearch: false,
      new_url: '',
      reactionMetadata: [],
      km_values:[],
    };

    this.formatReactionData = this.formatReactionData.bind(this);
    this.getSearchDataReaction = this.getSearchDataReaction.bind(this);
  }
  componentDidMount() {
    console.log("ReactionPage: Calling componentDidMount")
    this.setState({
      newSearch: false,
    });
    if (this.props.match.params.dataType == 'meta') {
      this.getMetaData();
    }

    if (this.props.match.params.dataType == 'data') {
      this.getResultsData();
    }
  }

  componentDidUpdate(prevProps) {
    console.log('ReactionPage: Calling componentDidUpdate')
    let values = queryString.parse(this.props.location.search);
    let old_values = queryString.parse(prevProps.location.search);
    //console.log('Here yo: ');
    //console.log(values);
    //console.log(values.substrates)
    //console.log(old_values.substrates)
    if (
      values.substrates != old_values.substrates ||
      values.products != old_values.products ||
      this.props.match.params.dataType != prevProps.match.params.dataType
    ) {
      console.log("blue")
      console.log("Substrate values: " + values.substrates != old_values.substrates)
      console.log("Substrate values: "+ (values.substrates != old_values.substrates))
      console.log(values.substrates)
      console.log(old_values.substrates)
      console.log("Redirect value: "+ this.state.redirect)
      this.setState({
      dataSource: [],
      data_arrived: false,
      newSearch: false,
      new_url: '',
      reactionMetadata: [],
      km_values:[],
    })
    //console.log("RE-UP")
      if (this.props.match.params.dataType == 'meta') {
        this.setState({ newSearch: false });
        this.getMetaData();
      }
      if (this.props.match.params.dataType == 'data') {
        this.setState({ newSearch: false });
        this.getResultsData();
      }
    }
  }

  getMetaData() {
    console.log('ReactionPage: Calling getMetaData');
    let values = queryString.parse(this.props.location.search)
    getSearchData([
      'reactions/kinlaw_by_name/?products=' + values.products + '&substrates='+ values.substrates + '&_from=0&size=1000&bound=loose',
    ])
      .then(response => {
        this.formatReactionMetadata(response.data);
      })
      .catch(err => {
        alert('Nothing Found');
        this.setState({ orig_json: null });
      });
  }

  getResultsData() {
    console.log('ReactionPage: Calling getResultsData');
    let values = queryString.parse(this.props.location.search);

    getSearchData([
      'reactions/kinlaw_by_rxn/?products=' +
        values.products +
        '&substrates=' +
        values.substrates +
        '&_from=0&size=1000&dof=0&bound=tight',
    ])
      .then(response => {
        this.formatReactionMetadata(response.data);
        this.formatReactionData(response.data);
      })
      //.catch(err => {
        //alert('Nothing Found');
        //this.setState({ orig_json: null });
      //});
  }

  formatReactionData(data) {
    console.log('ReactionPage: Calling formatReactionData');
    if (data != null) {
      var total_rows = [];
      let substrates = getSubstrates(data[0].reaction_participant[0].substrate);
      let km_values = []
      for (var k = substrates.length - 1; k >= 0; k--) {
        km_values.push("km_" + substrates[k])
      }
      this.setState({km_values:km_values})

      let start = 0;
      for (var i = start; i < data.length; i++) {
        let wildtype_mutant = null
        if (data[i]['taxon_wildtype'] == '1'){
          wildtype_mutant = "wildtype"
        }
        else if (data[i]['taxon_wildtype'] == '0'){
          wildtype_mutant = "mutant"
        }
        let row = {
          reaction_id: data[i]['kinlaw_id'],
          kcat: getKcat(data[i].parameter)["kcat"],
          wildtype_mutant:wildtype_mutant,
          organism: data[i].taxon_name,
          ph: data[i].ph,
          temperature: data[i].temperature
        }
        let row_with_km = Object.assign({}, row, getKm(data[i].parameter, substrates))
        //console.log(row_with_km)
        total_rows.push(row_with_km)
      }

      this.props.dispatch(setTotalData(total_rows));
      this.setState({
        data_arrived: true,
      });
    } else {
    }
  }

  getSearchDataReaction(url) {
    console.log('ReactionPage: Calling getSearchDataReaction');
    console.log('ReactionPageLoc: ' + ( '/reaction' + window.location.toString().split('/reaction')[1]))
    console.log('ReactionPageLoc: ' + url)
    if (url != ( '/reaction' + window.location.toString().split('/reaction')[1])){
      this.setState({ new_url: url});
    //console.log(url);
    this.setState({ newSearch: true });
    }
  }

  formatReactionMetadata(data) {
    console.log('ReactionPage: Calling formatReactionMetadata');
    let newReactionMetadataDict = {};
    let start = 0;
    for (var i = start; i < data.length; i++) {
      let reactionID = getReactionID(data[i].resource);
      let new_dict = newReactionMetadataDict[reactionID];
      if (!new_dict) {
        new_dict = {};
      }
      let substrates = getSubstrates(data[i].reaction_participant[0].substrate);
      let products = getProducts(data[i].reaction_participant[1].product);
      new_dict['reactionID'] = reactionID;
      new_dict['substrates'] = substrates;
      new_dict['products'] = products;

      let sub_inchis = getSubstrateInchiKey(
        data[i].reaction_participant[0].substrate,
      );
      let prod_inchis = getProductInchiKey(
        data[i].reaction_participant[1].product,
      );

      new_dict['equation'] = [
        formatPart(substrates) + ' ==> ' + formatPart(products),
        { sub_inchis: sub_inchis, prod_inchis: prod_inchis },
      ];
      newReactionMetadataDict[reactionID] = new_dict;
      //console.log(new_dict);
      //newReactionMetadataDict.push(meta);
    }

    this.setState({
      reactionMetadata: Object.keys(newReactionMetadataDict).map(function(key) {
        return newReactionMetadataDict[key];
      }),
    });
  }

  render() {
    console.log('ReactionPage: Rendering ReactionPage');
    const values = queryString.parse(this.props.location.search);
    //console.log(values.substrates.split(',')[0]);

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
          <ReactionSearch handleClick={this.getSearchDataReaction} landing={false} />
        </div>
        <br />
        <div className="uniprot_definition_data">
          <ReactionDefinition reactionMetadata={this.state.reactionMetadata} />
        </div>
        <br />
        <div className="results">
          <ReactionTable
            data_arrived={this.state.data_arrived}
            km_values={this.state.km_values}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(ReactionPage);
