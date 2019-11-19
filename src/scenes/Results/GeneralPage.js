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
import SearchResultsList from './SearchResultsList.js';


import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';
import { ReactionDefinition } from '~/components/Definitions/ReactionDefinition';

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




const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}





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
    };
    
  }


  render() {


    return (
      <SearchResultsList />
      )
     
  }
}

export default withRouter(GeneralPage);
