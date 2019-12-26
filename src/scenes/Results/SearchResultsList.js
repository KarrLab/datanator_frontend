import React, { Component } from 'react';
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
import Divider from '@material-ui/core/Divider';
import { Link } from '@material-ui/core';

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

const results = [];

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}


function format_results(primary_text, secondary_text, url) {
  return (
      <ListItemText secondary={secondary_text} dense={true} styles = {{marginTop:0}}>
      <style>
          {'MuiListItemText-root { margin-top: 0; }'}
        </style>
        <style>{'MuiTypography-root:link { text-decoration: none; }'}</style>
        <style>{'MuiTypography-root:visited { text-decoration: none; }'}</style>
        <style>
          {'MuiTypography-root:hover { text-decoration: none; }'}
        </style>
        <style>
          {'MuiTypography-root:active {  text-decoration: none; }'}
        </style>
        <Link underline='none'>
          <a href={url}>{primary_text} </a>
        </Link>
      </ListItemText>
  );
}

export default class InteractiveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reaction_results: null,
      protein_results: null,
      metabolite_results: null,

      metab_counter:2,
      reaction_couner:2,
    };

    this.create_search_results = this.create_search_results.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.add_reactions = this.add_reactions.bind(this);
    this.add_proteins = this.add_proteins.bind(this);
    this.add_metabolites = this.add_metabolites.bind(this);
  }
  componentDidMount() {
    if (this.props.reaction_results != null){
      this.add_reactions()
    }

    if (this.props.protein_results != null){
        this.add_proteins()
    }

    if (this.props.metabolite_results != null){
        this.add_metabolites()
    }
  }

  componentDidUpdate(prevProps) {


    if ((this.props.reaction_results != prevProps.reaction_results) && this.props.reaction_results != null){
      this.add_reactions()
    }

    if ((this.props.protein_results != prevProps.protein_results) && this.props.protein_results != null){
        this.add_proteins()
    }

    if ((this.props.metabolite_results != prevProps.metabolite_results) && this.props.metabolite_results != null){
        this.add_metabolites()
    }


    
}

add_proteins(){
  let protein_results = this.props.protein_results;
      let new_protein_results = [];
      for (var i = protein_results.length - 1; i >= 0; i--) {
      new_protein_results.push(
        format_results(
          protein_results[i]['primary_text'],
          protein_results[i]['secondary_text'],
          protein_results[i]['url'],
        ),
      )
    }
    this.setState({ protein_results: new_protein_results})
}

add_reactions(){
  console.log("called add_Reactions")
  console.log(this.props.reaction_results)
  let reaction_results = this.props.reaction_results;
  let new_reaction_results = [];
    for (var i = reaction_results.length - 1; i >= 0; i--) {
      new_reaction_results.push(
        format_results(
          reaction_results[i]['primary_text'],
          reaction_results[i]['secondary_text'],
          reaction_results[i]['url'],
        ),
      );
    }
    this.setState({ reaction_results: new_reaction_results})


}

add_metabolites(){
  let metabolite_results = this.props.metabolite_results;
      let new_metabolite_results = [];
      for (var i = metabolite_results.length - 1; i >= 0; i--) {
      new_metabolite_results.push(
        format_results(
          metabolite_results[i]['primary_text'],
          metabolite_results[i]['secondary_text'],
          metabolite_results[i]['url'],
        ),
      )
    }
    this.setState({ metabolite_results: new_metabolite_results})
}




  handleFetch(index){
    console.log("pushed")
    let counter = 10*this.state.metab_counter
    this.props.handle_fetch_data(index, 10)
    this.setState({metab_counter:this.state.metab_counter+1})
  }

  create_search_results() {
    console.log('SearchResultList: Calling create_search_results');
    let reaction_results = this.props.reaction_results;
    let protein_results = this.props.protein_results;
    let metabolite_results = this.props.metabolite_results;
    let new_reaction_results = [];
    let new_protein_results = [];
    let new_metabolite_results = [];
    for (var i = reaction_results.length - 1; i >= 0; i--) {
      new_reaction_results.push(
        format_results(
          reaction_results[i]['primary_text'],
          reaction_results[i]['secondary_text'],
          reaction_results[i]['url'],
        ),
      );
    }

    for (var i = protein_results.length - 1; i >= 0; i--) {
      new_protein_results.push(
        format_results(
          protein_results[i]['primary_text'],
          protein_results[i]['secondary_text'],
          protein_results[i]['url'],
        ),
      );
    }

    for (var i = metabolite_results.length - 1; i >= 0; i--) {
      new_metabolite_results.push(
        format_results(
          metabolite_results[i]['primary_text'],
          metabolite_results[i]['secondary_text'],
          metabolite_results[i]['url'],
        ),
      );
    }
    this.setState({
      reaction_results: new_reaction_results,
      protein_results: new_protein_results,
      metabolite_results: new_metabolite_results,
    });
  }

  render() {
    console.log('SearchResultList: Calling Render');
    console.log(this.props.reaction_results);
    console.log(this.state.metabolite_results)


  if (this.state.reaction_results == null &&
      this.state.protein_results == null &&
      this.state.metabolite_results == null){
    return ( <div class="loader"></div> )
  }


    return (
      <div className="google results">
        <Grid md={6}>
        {(this.state.metabolite_results != null) && (
            <div style={{ marginTop:10}}>
              <div className="anchor" >
              <a id="metabolites"></a>
              </div><Typography variant="h6" className={'green'}>
                Metabolites
              </Typography><div className="google results"  style = {{marginLeft:20}}>
              {this.state.metabolite_results.length>0 && (<List disablePadding={true} dense={true}> {this.state.metabolite_results}</List>)}</div>
              {(this.state.metabolite_results.length == 0) && (<p> No Metabolite Results Found </p>)}
            {this.state.metabolite_results.length>0 && 
              this.props.metabolite_load && 
              <button type="button" onClick={() => {this.handleFetch('metabolites_meta')}} >Load More (+10)</button>}
            </div>
            )}
        {(this.state.reaction_results != null) && (
            <div style={{ marginTop:10}}>
             <div className="anchor">
              <a id="reactions"></a>
              </div>
              <Typography variant="h6" className={'green'}>
                Reactions
              </Typography>
              {this.state.reaction_results.length>0 && (<div className="google results" style = {{marginLeft:20}}><List disablePadding={true} dense={true}> {this.state.reaction_results}</List></div>)}
              {(this.state.reaction_results.length == 0) && (<p> No Reaction Results Found </p>)}
              {this.state.reaction_results.length>0 && 
                this.props.reactions_load &&
                <button type="button" onClick={() => {this.handleFetch('sabio_reaction_entries')}} >Load More (+10)</button>}
            </div>
          )}

          {this.state.protein_results != null && (
            <div style={{ marginTop:10}}>
             <div className="anchor">
              <a id="proteins"></a>
              </div>
              <Typography variant="h6" className={'green'}>
                Proteins
              </Typography>
              {this.state.protein_results.length>0 && (<div className="google results" style = {{marginLeft:20}}><List disablePadding={true} dense={true}> {this.state.protein_results}</List></div>)}
              {(this.state.protein_results.length == 0) && (<p> No Protein Results Found </p>)}
              {this.state.protein_results.length>0 &&
                this.props.protein_load &&
                <button type="button" onClick={() => {this.handleFetch('protein')}} >Load More (+10)</button>}

            </div>
          )}
        </Grid>
      </div>
    );
  }
}
