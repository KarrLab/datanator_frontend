// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './General.css';
import InteractiveList from './SearchResultsList.js';


import { getSearchData } from '~/services/MongoApi';
import { formatReactionMetadata } from '~/scenes/Results/get_reaction_rows';
import { formatProteinMetadata } from '~/scenes/Results/get_protein_rows';
import { formatMetaboliteMetadata } from '~/scenes/Results/get_metabolite_rows';



import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';

import Grid from '@material-ui/core/Grid';
const queryString = require('query-string');








const url = "reaction/data/?substrates=AMP,ATP%20&products=%20ADP&substrates_inchi=ZKHQWZAMYRWXGA-KQYNXXCUSA-J,UDMBCSSLTHHNCD-KQYNXXCUSA-N&products_inchi=XTWYTFMLZFPYCI-KQYNXXCUSA-N"
//const results = [["ATP Synthetase1 ", "ATP + AMP ==> ADP", url], ["ATP Synthetase2 ", "ATP + AMP ==> ADP", url]]
const resultss = [{primary_text: "ATP Synthetase1 ", secondary_text: "ATP + AMP ==> ADP", url:url}, {primary_text: "ATP Synthetase1 ", secondary_text: "ATP + AMP ==> ADP", url:url}]

const results = [{primary_text: "some name",
products: [ "D-Glucose", "Phosphate" ],
reactionID: "796",
secondary_text: "D-Glucose 6-phosphate + H2O ==> Phosphate + D-Glucose",
substrates:  [ "H2O", "D-Glucose 6-phosphate" ],
url: "&substrates_inchi=XLYOFNOQVPJJNP-UHFFFAOYSA-N,NBSCHQHZLSJFNQ-GASJEMHNSA-N&products_inchi=WQZGKKKJIJFFOK-GASJEMHNSA-N,NBIIXXVUZAFLBC-UHFFFAOYSA-N"}]
@connect(store => {
  return {};
}) //the names given here will be the names of props
class GeneralPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      data_arrived: false,
      newSearch: false,
      newResults: false,
      new_url: '',
      reactionMetadata: [],
      km_values:[],
      reaction_results : [],
      protein_results : [],
      metabolite_results: [],
      meh:false,
      page_index_counter:{
        metabolites_meta : 0,
        sabio_reaction_entries : 0,
        protein : 0,
      }
    };

    this.getNewSearch = this.getNewSearch.bind(this);
    this.fetch_data = this.fetch_data.bind(this);
    this.formatData = this.formatData.bind(this);


    
  }

  getNewSearch(response) {
    let url = '/general/?q=' + response[0] + '&organism=' + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }
  componentDidMount() {
    let values = queryString.parse(this.props.location.search);
    this.fetch_data("metabolites_meta", 10)
      this.fetch_data("sabio_reaction_entries", 10)
      this.fetch_data("protein", 10)
  }

  componentDidUpdate(prevProps) {
    console.log(this.state.reaction_results)
    console.log('GeneralPage: Calling componentDidUpdate')
    let values = queryString.parse(this.props.location.search);
    let old_values = queryString.parse(prevProps.location.search);
    if (this.state.newResults){
      this.fetch_data("metabolites_meta", 10)
      this.fetch_data("sabio_reaction_entries", 10)
      this.fetch_data("protein", 10)
      this.setState({ newSearch: false })
      this.setState({newResults:false})
    }
  }

  fetch_data(indices, size,){
    let values = queryString.parse(this.props.location.search);

    let from_ = this.state.page_index_counter[indices] * 10
    let new_counters = this.state.page_index_counter
    new_counters[indices] = new_counters[indices] + 1
    let url = ""
    console.log("GeneralSearch: Calling fetch_data")
    if (indices == "protein"){
      url="ftx/text_search/protein_ranked_by_ko/?query_message=atp&from_=" + from_ + "&size=" + size + "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzymes.enzyme.enzyme_name&fields=enzymes.subunit.canonical_sequence&fields=species"
    }
    else{
      url = "ftx/text_search/num_of_index/?query_message=" + values.q +"&index=" + indices + "&from_=" + from_ + "&size=" + size + "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzyme_name&fields=product_names&fields=substrate_names&fields=enzymes.subunit.canonical_sequence&fields=species"

    }
    getSearchData([url])
      .then(response => {
        this.formatData(response.data);
      })
    this.setState({page_index_counter: new_counters})
  }

  formatData(data){
    console.log("GeneralSearch: Calling FormatData")
    let values = queryString.parse(this.props.location.search);
    console.log(data)

    if ('metabolites_meta' in data){
      console.log("corn flakes2")
      let metabolite_data = data['metabolites_meta']
      let metabolite_metadata = this.state.metabolite_results.concat(formatMetaboliteMetadata(metabolite_data, values.organism))
      this.setState({metabolite_results: metabolite_metadata})
    }

    if ('top_kos' in data){
      let protein_data = data["top_kos"]['buckets']
      let protein_metadata = this.state.protein_results.concat(formatProteinMetadata(protein_data, values.organism))
      this.setState({protein_results:protein_metadata})
    }


    if ('sabio_reaction_entries' in data){
      let reaction_data = data['sabio_reaction_entries']
      let reaction_metadata = this.state.reaction_results.concat(formatReactionMetadata(reaction_data))
      this.setState({reaction_results:reaction_metadata})
    }
  

  }

  render() {
    console.log("GeneralSearch: Calling render")
    console.log(this.state.reaction_results)
    let values = queryString.parse(this.props.location.search);
    console.log("QUERY VALUE: " + values.q)

    if (this.state.newSearch == true) {
      console.log('Redirecting');
      this.setState({newResults:true})
      return <Redirect to={this.state.new_url} push />;
    }


    return (
      <div>
      <Header 
        handleClick={this.getNewSearch}
        defaultQuery={values.q}
        defaultOrganism={values.organism}
      />
      <div className="general">
      <style>{'body { background-color: #f7fdff; }'}</style>
      <Grid md={3}>
      <div className="contents" style={{
            marginLeft: -20,
          }}>
        <h3>Contents</h3>
      <ol>
      <li><Link>
          <a href={'/general/?q=' + values.q + '&' + 'organism=' + values.organism + '#metabolites'}>{"Metabolites"} </a>
      </Link></li>
      <li><Link>
          <a href={'/general/?q=' + values.q + '&' + 'organism=' + values.organism + '#reactions'}>{"Reactions"} </a>
      </Link></li>
      <li><Link>
          <a href={'/general/?q=' + values.q + '&' + 'organism=' + values.organism + '#proteins'}>{"Proteins"} </a>
      </Link></li>
      </ol>
      </div>
      </Grid>
      <InteractiveList 
      reaction_results = {this.state.reaction_results}
      protein_results = {this.state.protein_results}
      metabolite_results = {this.state.metabolite_results}
      handle_fetch_data = {this.fetch_data}
      />
      </div>
      </div>
      )
     
  }
}

export default withRouter(GeneralPage);
