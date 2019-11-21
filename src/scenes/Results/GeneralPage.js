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

import './MetabConcs.css';
import InteractiveList from './SearchResultsList.js';


import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';
import { ReactionDefinition } from '~/components/Definitions/ReactionDefinition';
import { formatReactionMetadata } from '~/scenes/Results/get_reaction_rows';



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
const results = [{primary_text: "ATP Synthetase1 ", secondary_text: "ATP + AMP ==> ADP", url:url}, {primary_text: "ATP Synthetase1 ", secondary_text: "ATP + AMP ==> ADP", url:url}]

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
      new_url: '',
      reactionMetadata: [],
      km_values:[],
      reaction_results : results
    };

    this.getNewSearch = this.getNewSearch.bind(this);
    this.fetch_data = this.fetch_data.bind(this);

    
  }

  getNewSearch(response) {
    let url = '/general/?q=' + response[0] + '&organism=' + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }

  componentDidUpdate(prevProps) {
    console.log('GeneralPage: Calling componentDidUpdate')
    let values = queryString.parse(this.props.location.search);
    let old_values = queryString.parse(prevProps.location.search);
    if (values.q != old_values.q){
      this.fetch_data(values.q)
      this.setState({ newSearch: false })
    }
  }

  fetch_data(){
    console.log("BLUEBERRYYYY")
    this.setState({reaction_results:results})
  }

  render() {
    let values = queryString.parse(this.props.location.search);

    if (this.state.newSearch == true) {
      console.log('Redirecting');
      return <Redirect to={this.state.new_url} push />;
    }


    return (
      <div>
      <GeneralSearch handleClick={this.getNewSearch} defaultQuery={values.q} defaultOrganism={values.organism}/>
      <InteractiveList 
      reaction_results = {this.state.reaction_results}
      />
      </div>
      )
     
  }
}

export default withRouter(GeneralPage);
