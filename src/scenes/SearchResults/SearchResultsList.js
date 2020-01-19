import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';

function format_results(primary_text, secondary_text, url) {
  return (
    <ListItemText secondary={secondary_text} dense={true}>
      <Link to={url}>{primary_text}</Link>
    </ListItemText>
  );
}

export default class SearchResultsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      metabolite_results: null,
      protein_results: null,
      reaction_results: null,

      metab_counter: 2,
      reaction_couner: 2,
    };

    this.create_search_results = this.create_search_results.bind(this);
    this.handleFetch = this.handleFetch.bind(this);    
    this.add_metabolites = this.add_metabolites.bind(this);    
    this.add_proteins = this.add_proteins.bind(this);
    this.add_reactions = this.add_reactions.bind(this);
  }

  componentDidMount() {
    if (this.props.metabolite_results != null){
        this.add_metabolites()
    }    

    if (this.props.protein_results != null){
        this.add_proteins()
    }

    if (this.props.reaction_results != null){
      this.add_reactions()
    }
  }

  componentDidUpdate(prevProps) {
    if ((this.props.metabolite_results !== prevProps.metabolite_results) && this.props.metabolite_results != null){
        this.add_metabolites()
    }

    if ((this.props.protein_results !== prevProps.protein_results) && this.props.protein_results != null){
        this.add_proteins()
    }

    if ((this.props.reaction_results !== prevProps.reaction_results) && this.props.reaction_results != null){
      this.add_reactions()
    }
  }

  add_metabolites(){
    let metabolite_results = this.props.metabolite_results;
    let new_metabolite_results = [];
    for (var i = 0; i < metabolite_results.length ; i++) {
      new_metabolite_results.push(
        format_results(
          metabolite_results[i]['primary_text'],
          metabolite_results[i]['secondary_text'],
          metabolite_results[i]['url'],
        ),
      );
    }
    this.setState({ metabolite_results: new_metabolite_results})
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
      );
    }
    this.setState({ protein_results: new_protein_results})
  }

  add_reactions(){
    let reaction_results = this.props.reaction_results;
    let new_reaction_results = [];
    for (var i = 0; i < reaction_results.length ; i++) {
      new_reaction_results.push(
        format_results(
          reaction_results[i]['primary_text'],
          reaction_results[i]['secondary_text'],
          reaction_results[i]['url'],
        ),
      );
    }
    this.setState({reaction_results: new_reaction_results})
  }

  handleFetch(index){
    let counter = 10 * this.state.metab_counter;
    this.props.handle_fetch_data(index, 10);
    this.setState({metab_counter: this.state.metab_counter + 1});
  }

  create_search_results() {
    let metabolite_results = this.props.metabolite_results;
    let protein_results = this.props.protein_results;
    let reaction_results = this.props.reaction_results;    
    
    let new_metabolite_results = [];
    let new_protein_results = [];
    let new_reaction_results = [];

    for (var i = metabolite_results.length - 1; i >= 0; i--) {
      new_metabolite_results.push(
        format_results(
          metabolite_results[i]['primary_text'],
          metabolite_results[i]['secondary_text'],
          metabolite_results[i]['url'],
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

    for (var i = reaction_results.length - 1; i >= 0; i--) {
      new_reaction_results.push(
        format_results(
          reaction_results[i]['primary_text'],
          reaction_results[i]['secondary_text'],
          reaction_results[i]['url'],
        ),
      );
    }
    this.setState({
      metabolite_results: new_metabolite_results,
      protein_results: new_protein_results,
      reaction_results: new_reaction_results,
    });
  }

  render() {
    return (
      <div className="content-column" id="features">
        {(this.state.metabolite_results != null) && (
        <div className="content-block section" id="metabolites">
          <h2 className="content-block-heading">
            Metabolites
          </h2>
          <div className="content-block-content">
            {this.state.metabolite_results.length>0 && (
            <List disablePadding={true} dense={true}>
              {this.state.metabolite_results}
            </List>
            )}

            {(this.state.metabolite_results.length === 0) && (
            <p>No results found</p>
            )}
            
            {this.state.metabolite_results.length>0 && this.props.metabolite_load && (
            <button type="button" onClick={() => {this.handleFetch('metabolites_meta')}}>
              Load 10 more
            </button>
            )}
          </div>
        </div>
        )}

        {this.state.protein_results != null && (
        <div className="content-block section" id="proteins">
          <h2 className="content-block-heading">
            Proteins
          </h2>
          <div className="content-block-content">
            {this.state.protein_results.length>0 && (
            <List disablePadding={true} dense={true}>
              {this.state.protein_results}
            </List>
            )}

            {(this.state.protein_results.length === 0) && (
            <p>No results found</p>
            )}
        
            {this.state.protein_results.length>0 && this.props.protein_load && (
            <button type="button" onClick={() => {this.handleFetch('protein')}}>
              Load 10 more
            </button>
            )}
          </div>
        </div>
        )}

        {(this.state.reaction_results != null) && (
        <div className="content-block section" id="reactions">
          <h2 className="content-block-heading">
            Reactions
          </h2>
          <div className="content-block-content">
            {this.state.reaction_results.length>0 && (
            <List disablePadding={true} dense={true}>
              {this.state.reaction_results}
            </List>
            )}
    
            {(this.state.reaction_results.length === 0) && (
            <p>No results found</p>
            )}

            {this.state.reaction_results.length>0 && this.props.reactions_load && (
            <button type="button" onClick={() => {this.handleFetch('sabio_reaction_entries')}}>
              Load 10 more
            </button>
            )}
          </div>
        </div>
        )}
      </div>
    );
  }
}
