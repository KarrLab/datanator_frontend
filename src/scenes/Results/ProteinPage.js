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
import {
  UniprotDefinition,
  OrthologyDefinition,
} from '~/components/Definitions/OrthologyGroup';

import { setNewUrl, abstractMolecule } from '~/data/actions/pageAction';
import '~/scenes/Results/ProteinPage.css';
import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';
import { setTotalData } from '~/data/actions/resultsAction';

import { set_lineage } from '~/data/actions/resultsAction';
import store from '~/data/Store';
Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

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
      proteinMetadata: [],
      orthologyMetadata: [],
      f_abundances: null,
      organism: '',
      dataSource: [],
      orig_json: null,
      newSearch: false,
      new_url: '',
      isFlushed: false,
      data_arrived: false,
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
      this.setState({
        search: '',
        proteinMetadata: [],
        orthologyMetadata: [],
        f_abundances: null,
        organism: '',
        dataSource: [],
        orig_json: null,
        newSearch: false,
        new_url: '',
        isFlushed: false,
        data_arrived: false,
      });
      this.checkURL();

      console.log('chicken');
    }
  }

  checkURL() {
    console.log('Calling checkURL');
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
    console.log('yo yo man');
  }

  getSearchData() {
    console.log('Calling getSearchData');
    if (this.props.match.params.searchType == 'uniprot') {
      getSearchData([
        'proteins',
        'proximity_abundance',
        '?uniprot_id=' +
          this.props.match.params.molecule +
          '&distance=100&depth=100',
      ]).then(response => {
        this.processProteinDataUniprot(response.data);
      });
    } else if (this.props.match.params.searchType == 'name') {
      getSearchData([
        'proteins',
        'meta/meta_single/?name=' + this.props.match.params.molecule,
      ]).then(response => {
        this.formatOrthologyMetadata(response.data);
        this.setState({ proteinMetadata: null });
      });
      this.setState({ f_abundances: null });
    } else if (this.props.match.params.searchType == 'ko') {
      getSearchData([
        'proteins',
        'super/same-kegg?uniprot_id=' + this.props.match.params.molecule,
      ]).then(response => {
        this.processProteinData(response.data);
      });
    }
  }

  formatProteinMetadata(data) {
    console.log('Calling formatProteinMetadata');
    let newProteinMetadata = [];
    let start = 0;
    //console.log(data[0])
    if (data[0].length == 1) {
      start = 1;
    }
    for (var i = start; i < data.length; i++) {
      if (data[i].uniprot_id == this.props.match.params.molecule) {
        let meta = {};
        meta['uniprot'] = data[i].uniprot_id;
        meta['protein_name'] = data[i].protein_name;
        meta['gene_name'] = data[i].gene_name;
        meta['organism'] = data[i].species_name;
        newProteinMetadata.push(meta);

        getSearchData([
          'taxon',
          'canon_rank_distance/?ncbi_id=' + data[i].ncbi_taxonomy_id,
        ]).then(response => {
          this.props.dispatch(set_lineage(response.data));
        });
      }
    }
    //console.log(newProteinMetadata)
    console.log('baloon animal');
    //console.log(data)
    this.setState({ proteinMetadata: newProteinMetadata });
  }

  formatOrthologyMetadata(data) {
    console.log('Calling formatOrthologyMetadata');
    let newOrthologyMetadata = [];
    let start = 0;
    //let end_query = ""

    for (var i = start; i < data.length; i++) {
      let end_query = '';
      let meta = {};
      meta['ko_number'] = data[i].ko_number;
      console.log('TOTAL KO: ' + data[i].ko_number);
      meta['ko_name'] = data[i].ko_name;
      let uni_ids = data[i].uniprot_ids;
      //meta["uniprot_ids"] = uni_ids
      //meta["uniprot_ids"]
      let filtered_ids = Object.keys(uni_ids)
        .filter(function(k) {
          return uni_ids[k];
        })
        .map(String);
      console.log('TOTAL KO: ' + filtered_ids);
      if (filtered_ids.length > 0) {
        for (var f = filtered_ids.length - 1; f >= 0; f--) {
          end_query = end_query + 'uniprot_id=' + filtered_ids[f] + '&';
        }
        console.log('retrieving: ' + end_query);

        getSearchData(['proteins', 'meta/meta_combo?' + end_query]).then(
          response => {
            this.formatOrthologyMetadataUniprot(response.data);
            //this.formatData(response.data, uniprot_to_dist)
            newOrthologyMetadata.push(meta);
            //this.setState({proteinMetadata:null});
            //console.log(response.data)
          },
        );
      }

      //newOrthologyMetadata.push(meta)
    }
    //this.setState({orthologyMetadata:newOrthologyMetadata})
  }

  formatOrthologyMetadataUniprot(data) {
    console.log('Calling formatOrthologyMetadataUniprot');
    let newOrthologyMetadata = this.state.orthologyMetadata;
    let start = 0;
    let uni_ids = [];
    let meta = {};
    meta['ko_number'] = data[0].ko_number;
    meta['ko_name'] = data[0].ko_name;

    for (var i = start; i < data.length; i++) {
      uni_ids.push(data[i].uniprot_id + ' (' + data[i].species_name + ') ');
    }
    meta['uniprot_ids'] = uni_ids;
    //meta["uniprot_ids"] = Object.keys(uni_ids) .filter(function(k){return uni_ids[k]}) .map(String)
    console.log('corn cob');
    //console.log(meta["uniprot_ids"])
    newOrthologyMetadata.push(meta);
    this.setState({ orthologyMetadata: newOrthologyMetadata });
    //this.formatProteinMetadata(data)
  }

  processProteinData(data) {
    console.log('Calling processProteinData');
    if (typeof data != 'string') {
      this.setState({ orig_json: data });
      if (this.props.match.params.searchType == 'uniprot') {
        this.formatUniprotData(data);
      } else {
        this.formatData(data);
      }
      //this.formatData(data)
      this.formatProteinMetadata(data);
      let newOrthologyMetadata = [];
      let meta = {};
      let uniprot_id = '';
      if (Object.size(data[0]) == 1) {
        uniprot_id = data[1].uniprot_id;
      } else {
        uniprot_id = data[0].uniprot_id;
      }
      meta['ko_number'] = [data[0].ko_number, uniprot_id];
      newOrthologyMetadata.push(meta);
      //console.log(newOrthologyMetadata)
      console.log('octo');
      this.setState({ orthologyMetadata: newOrthologyMetadata });
      //console.log(data)
    } else {
      getSearchData([
        'proteins',
        'meta?uniprot_id=' + this.props.match.params.molecule,
      ]).then(response => {
        this.formatData(response.data);
        this.formatProteinMetadata(response.data);

        let newOrthologyMetadata = [];
        let meta = {};
        meta['ko_number'] = [
          response.data[0].ko_number,
          response.data[1].uniprot_id,
        ];
        newOrthologyMetadata.push(meta);
        //console.log(newOrthologyMetadata)
        console.log('octo');
        this.setState({ orthologyMetadata: newOrthologyMetadata });
      });
    }
  }

  processProteinDataUniprot(data) {
    console.log('Calling processProteinDataUniprot');
    if (typeof data != 'string') {
      this.setState({ orig_json: data });
      var f_abundances = [];
      let newProteinMetadata = [];
      let uniprot_to_dist = {};
      if (data != null && typeof data != 'string') {
        let start = 0;
        for (var i = 0; i < data.length; i++) {
          let docs = data[i].documents;
          for (var q = docs.length - 1; q >= 0; q--) {
            var uniprot = docs[q].abundances;
            for (var n = 0; n < uniprot.length; n++) {
              let row = {};
              uniprot_to_dist[docs[q].uniprot_id] = data[i].distance;
            }
          }
        }
      }
      //console.log(uniprot_to_dist)
      let total_ids = Object.keys(uniprot_to_dist);
      let end_query = '';
      for (var f = total_ids.length - 1; f >= 0; f--) {
        end_query = end_query + 'uniprot_id=' + total_ids[f] + '&';
      }
      //console.log(end_query)

      getSearchData(['proteins', 'meta/meta_combo?' + end_query]).then(
        response => {
          this.formatOrthologyMetadataUniprot(response.data);
          this.formatProteinMetadata(response.data);
          this.formatData(response.data, uniprot_to_dist);
          //this.setState({proteinMetadata:null});
          //console.log(response.data)
        },
      );
    }
  }

  formatData(data, uniprot_to_dist) {
    console.log('Calling formatData');
    var f_abundances = [];
    //console.log(data)
    if (data != null && typeof data != 'string') {
      console.log("MONKEY FARMER")
      console.log(data[0])
      if (!(data[0].uniprot_id == "Please try another input combination")) {
        let start = 0;
        if (Object.size(data[0]) == 1) {
          start = 1;
        }
        for (var i = start; i < data.length; i++) {
          //console.log(data[i])
          let uniprot = data[i];
          for (var n = 0; n < uniprot.abundances.length; n++) {
            let row = {};
            row['abundance'] = uniprot.abundances[n].abundance;
            row['organ'] = uniprot.abundances[n].organ;
            row['gene_symbol'] = uniprot.gene_name;
            row['organism'] = uniprot.species_name;
            row['uniprot_id'] = uniprot.uniprot_id;
            row['protein_name'] = uniprot.protein_name;
            row['taxonomic_proximity'] = uniprot_to_dist[uniprot.uniprot_id];
            f_abundances.push(row);
          }
        }
        //console.log(f_abundances)
        this.props.dispatch(setTotalData(f_abundances));
        this.setState({ data_arrived: true });
      }
        else {
          alert('Nothing Found');
        }
    } else {
        alert('Nothing Found');
    }
  }

  getNewSearch(url) {
    console.log('Calling getNewSearch');
    if (url !== this.state.new_url) {
      this.setState({ newSearch: true, new_url: url });
    }
  }

  render() {
    if (this.state.newSearch == true) {
      console.log('Redirecting');
      return <Redirect to={this.state.new_url} push />;
    }
    console.log('Rendering ProteinPage');

    const Search = Input.Search;
    let styles = {
      marginTop: 50,
    };
    console.log(this.props.match.params.molecule);
    console.log(this.props.match.params.organism);
    return (
      <div className="container" style={styles}>
        <Header />
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
        <div className="uniprot_definition_data">
          <UniprotDefinition proteinMetadata={this.state.proteinMetadata} />
        </div>
        <div className="orthology_definition_data">
          <OrthologyDefinition proteinMetadata={this.state.orthologyMetadata} />
        </div>
        <br />
        <br />
        <div className="results">
          <ProtAbundancesTable
            f_abundances={this.state.f_abundances}
            handleAbstract={this.getAbstractSearch}
            data_arrived={this.state.data_arrived}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(ProteinPage);
