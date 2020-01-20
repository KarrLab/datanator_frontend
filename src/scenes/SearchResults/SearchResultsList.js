import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

function format_results(primary_text, secondary_text, url) {
  return (
    <ListItemText secondary={secondary_text} dense={true}>
      <Link to={url}>{primary_text}</Link>
    </ListItemText>
  );
}

export default class SearchResultsList extends Component {
  static propTypes = {
    loadMetabolites: PropTypes.bool,
    loadProteins: PropTypes.bool,
    loadReactions: PropTypes.bool,

    fetchDataHandler: PropTypes.func,

    metaboliteResults: PropTypes.array,
    proteinResults: PropTypes.array,
    reactionResults: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      metaboliteResults: null,
      proteinResults: null,
      reactionResults: null,

      metab_counter: 2,
      reaction_couner: 2
    };

    this.create_search_results = this.create_search_results.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.add_metabolites = this.add_metabolites.bind(this);
    this.add_proteins = this.add_proteins.bind(this);
    this.add_reactions = this.add_reactions.bind(this);
  }

  componentDidMount() {
    if (this.props.metaboliteResults != null) {
      this.add_metabolites();
    }

    if (this.props.proteinResults != null) {
      this.add_proteins();
    }

    if (this.props.reactionResults != null) {
      this.add_reactions();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.metaboliteResults !== prevProps.metaboliteResults &&
      this.props.metaboliteResults != null
    ) {
      this.add_metabolites();
    }

    if (
      this.props.proteinResults !== prevProps.proteinResults &&
      this.props.proteinResults != null
    ) {
      this.add_proteins();
    }

    if (
      this.props.reactionResults !== prevProps.reactionResults &&
      this.props.reactionResults != null
    ) {
      this.add_reactions();
    }
  }

  add_metabolites() {
    let metaboliteResults = this.props.metaboliteResults;
    let new_metabolite_results = [];
    for (let i = 0; i < metaboliteResults.length; i++) {
      new_metabolite_results.push(
        format_results(
          metaboliteResults[i]["primary_text"],
          metaboliteResults[i]["secondary_text"],
          metaboliteResults[i]["url"]
        )
      );
    }
    this.setState({ metaboliteResults: new_metabolite_results });
  }

  add_proteins() {
    let proteinResults = this.props.proteinResults;
    let new_protein_results = [];
    for (let i = proteinResults.length - 1; i >= 0; i--) {
      new_protein_results.push(
        format_results(
          proteinResults[i]["primary_text"],
          proteinResults[i]["secondary_text"],
          proteinResults[i]["url"]
        )
      );
    }
    this.setState({ proteinResults: new_protein_results });
  }

  add_reactions() {
    let reactionResults = this.props.reactionResults;
    let new_reaction_results = [];
    for (let i = 0; i < reactionResults.length; i++) {
      new_reaction_results.push(
        format_results(
          reactionResults[i]["primary_text"],
          reactionResults[i]["secondary_text"],
          reactionResults[i]["url"]
        )
      );
    }
    this.setState({ reactionResults: new_reaction_results });
  }

  handleFetch(index) {
    this.props.fetchDataHandler(index, 10);
    this.setState({ metab_counter: this.state.metab_counter + 1 });
  }

  create_search_results() {
    let metaboliteResults = this.props.metaboliteResults;
    let proteinResults = this.props.proteinResults;
    let reactionResults = this.props.reactionResults;

    let new_metabolite_results = [];
    let new_protein_results = [];
    let new_reaction_results = [];

    for (let i = metaboliteResults.length - 1; i >= 0; i--) {
      new_metabolite_results.push(
        format_results(
          metaboliteResults[i]["primary_text"],
          metaboliteResults[i]["secondary_text"],
          metaboliteResults[i]["url"]
        )
      );
    }

    for (let i = proteinResults.length - 1; i >= 0; i--) {
      new_protein_results.push(
        format_results(
          proteinResults[i]["primary_text"],
          proteinResults[i]["secondary_text"],
          proteinResults[i]["url"]
        )
      );
    }

    for (let i = reactionResults.length - 1; i >= 0; i--) {
      new_reaction_results.push(
        format_results(
          reactionResults[i]["primary_text"],
          reactionResults[i]["secondary_text"],
          reactionResults[i]["url"]
        )
      );
    }
    this.setState({
      metaboliteResults: new_metabolite_results,
      proteinResults: new_protein_results,
      reactionResults: new_reaction_results
    });
  }

  render() {
    return (
      <div className="content-column" id="features">
        {this.state.metaboliteResults != null && (
          <div className="content-block section" id="metabolites">
            <h2 className="content-block-heading">Metabolites</h2>
            <div className="content-block-content">
              {this.state.metaboliteResults.length > 0 && (
                <List disablePadding={true} dense={true}>
                  {this.state.metaboliteResults}
                </List>
              )}

              {this.state.metaboliteResults.length === 0 && (
                <p>No results found</p>
              )}

              {this.state.metaboliteResults.length > 0 &&
                this.props.loadMetabolites && (
                  <button
                    type="button"
                    onClick={() => {
                      this.handleFetch("metabolites_meta");
                    }}
                  >
                    Load 10 more
                  </button>
                )}
            </div>
          </div>
        )}

        {this.state.proteinResults != null && (
          <div className="content-block section" id="proteins">
            <h2 className="content-block-heading">Proteins</h2>
            <div className="content-block-content">
              {this.state.proteinResults.length > 0 && (
                <List disablePadding={true} dense={true}>
                  {this.state.proteinResults}
                </List>
              )}

              {this.state.proteinResults.length === 0 && (
                <p>No results found</p>
              )}

              {this.state.proteinResults.length > 0 && this.props.loadProteins && (
                <button
                  type="button"
                  onClick={() => {
                    this.handleFetch("protein");
                  }}
                >
                  Load 10 more
                </button>
              )}
            </div>
          </div>
        )}

        {this.state.reactionResults != null && (
          <div className="content-block section" id="reactions">
            <h2 className="content-block-heading">Reactions</h2>
            <div className="content-block-content">
              {this.state.reactionResults.length > 0 && (
                <List disablePadding={true} dense={true}>
                  {this.state.reactionResults}
                </List>
              )}

              {this.state.reactionResults.length === 0 && (
                <p>No results found</p>
              )}

              {this.state.reactionResults.length > 0 &&
                this.props.loadReactions && (
                  <button
                    type="button"
                    onClick={() => {
                      this.handleFetch("sabio_reaction_entries");
                    }}
                  >
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
