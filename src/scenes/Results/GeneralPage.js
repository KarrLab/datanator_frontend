// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input } from 'antd';
import 'antd/dist/antd.css';
import ReactionTable from '~/components/Results/ReactionTable.js';
import GeneralSearch from '~/components/SearchField/GeneralSearch.js';
import { PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './General.css';
import InteractiveList from './SearchResultsList.js';


import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';
import { ReactionDefinition } from '~/components/Definitions/ReactionDefinition';
import { formatReactionMetadata } from '~/scenes/Results/get_reaction_rows';
import { formatProteinMetadata } from '~/scenes/Results/get_protein_rows';
import { formatMetaboliteMetadata } from '~/scenes/Results/get_metabolite_rows';



import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';


import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
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
    this.fetch_data(values.q)
  }

  componentDidUpdate(prevProps) {
    console.log(this.state.reaction_results)
    console.log('GeneralPage: Calling componentDidUpdate')
    let values = queryString.parse(this.props.location.search);
    let old_values = queryString.parse(prevProps.location.search);
    if (this.state.newResults){
      this.fetch_data(values.q)
      this.setState({ newSearch: false })
      this.setState({newResults:false})
    }
  }

  fetch_data(query){
    console.log("GeneralSearch: Calling fetch_data")
    let url = "ftx/text_search/frontend_num_of_index/?query_message=" + query + "&indices=ecmdb%2Cymdb%2Cmetabolites_meta%2Cprotein%2Csabio_rk&size=10&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=reaction_participant.substrate.substrate_name&fields=reaction_participant.substrate.substrate_synonym&fields=reaction_participant.product.product_name&fields=reaction_participant.product.substrate_synonym&fields=enzymes.enzyme.enzyme_name&fields=enzymes.subunit.canonical_sequence&fields=species"
  
    getSearchData([url])
      .then(response => {
        this.formatData(response.data);
      })
  }

  formatData(data){
    console.log("GeneralSearch: Calling FormatData")
    let values = queryString.parse(this.props.location.search);
    let reaction_data = data[4]['sabio_rk']
    let protein_data = data[3]['protein']
    let metabolite_data = data[0]['ecmdb'].concat(data[1]["ymdb"])

    let reaction_metadata = formatReactionMetadata(reaction_data)
    let protein_metadata = formatProteinMetadata(protein_data, values.organism)
    let metabolite_metadata = formatMetaboliteMetadata(metabolite_data, values.organism)
    console.log(reaction_metadata)
    this.setState({reaction_results:reaction_metadata,
      protein_results:protein_metadata,
      metabolite_results: metabolite_metadata})
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
      <Header />
      <div className="general">
      <style>{'body { background-color: #f7fdff; }'}</style>
      <GeneralSearch handleClick={this.getNewSearch} defaultQuery={values.q} defaultOrganism={values.organism}/>
      <InteractiveList 
      reaction_results = {this.state.reaction_results}
      protein_results = {this.state.protein_results}
      metabolite_results = {this.state.metabolite_results}
      />
      </div>
      </div>
      )
     
  }
}

export default withRouter(GeneralPage);
