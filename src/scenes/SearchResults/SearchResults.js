import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { HashLink } from "react-router-hash-link";
import { withRouter } from "react-router";

import { getSearchData } from "~/services/MongoApi";
import SearchResultsList from "./SearchResultsList.js";
import { formatMetabolite } from "~/scenes/SearchResults/format_metabolite";
import { formatProtein } from "~/scenes/SearchResults/format_protein";
import { formatReaction } from "~/scenes/SearchResults/format_reaction";

import "./SearchResults.scss";

const queryString = require("query-string");

@connect(() => {
  return {};
}) //the names given here will be the names of props
class SearchResults extends Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      data_arrived: false,
      newResults: false,
      reactionMetadata: [],
      km_values: [],
      metaboliteResults: null,
      proteinResults: null,
      reactionResults: null,
      meh: false,
      page_index_counter: {
        metabolites_meta: 0,
        sabio_reaction_entries: 0,
        protein: 0
      },
      loadMetabolites: true,
      loadProteins: true,
      loadReactions: true
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatData = this.formatData.bind(this);
  }

  componentDidMount() {
    this.fetchData("metabolites_meta", 10);
    // this.fetchData("rna_halflife", 10);
    this.fetchData("protein", 10);
    this.fetchData("sabio_reaction_entries", 10);
  }

  componentDidUpdate() {
    if (this.state.newResults) {
      this.fetchData("metabolites_meta", 10);
      // this.fetchData("rna_halflife", 10);
      this.fetchData("protein", 10);
      this.fetchData("sabio_reaction_entries", 10);
      this.setState({ newResults: false });
    }
  }

  fetchData(indices, size) {
    const values = queryString.parse(this.props.location.search);

    const from_ = this.state.page_index_counter[indices] * 10;
    let new_counters = this.state.page_index_counter;
    new_counters[indices] = new_counters[indices] + 1;
    let url = "";
    if (indices === "protein") {
      url =
        "ftx/text_search/protein_ranked_by_ko/" +
        "?query_message=" +
        values.q +
        "&from_=" +
        from_ +
        "&size=" +
        size +
        "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzymes.enzyme.enzyme_name&fields=enzymes.subunit.canonical_sequence&fields=species";
    } else {
      url =
        "ftx/text_search/num_of_index/" +
        "?query_message=" +
        values.q +
        "&index=" +
        indices +
        "&from_=" +
        from_ +
        "&size=" +
        size +
        "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzyme_name&fields=product_names&fields=substrate_names&fields=enzymes.subunit.canonical_sequence&fields=species";
    }
    getSearchData([url]).then(response => {
      this.formatData(response.data, size);
    });
    this.setState({ page_index_counter: new_counters });
  }

  formatData(data, size) {
    const values = queryString.parse(this.props.location.search);

    if ("metabolites_meta" in data) {
      let metabolite_data = data["metabolites_meta"];
      let metabolite_metadata = formatMetabolite(
        metabolite_data,
        values.organism
      );
      if (metabolite_metadata.length < size) {
        this.setState({ loadMetabolites: false });
      }
      if (this.state.metaboliteResults != null) {
        metabolite_metadata = this.state.metaboliteResults.concat(
          metabolite_metadata
        );
      }
      this.setState({ metaboliteResults: metabolite_metadata });
    }

    if ("top_kos" in data) {
      let protein_data = data["top_kos"]["buckets"];
      let protein_metadata = formatProtein(protein_data, values.organism);
      if (protein_metadata.length < size) {
        this.setState({ loadProteins: false });
      }
      if (this.state.proteinResults != null) {
        protein_metadata = this.state.proteinResults.concat(protein_metadata);
      }
      this.setState({ proteinResults: protein_metadata });
    }

    if ("sabio_reaction_entries" in data) {
      let reaction_data = data["sabio_reaction_entries"];

      let reaction_metadata = formatReaction(reaction_data);
      if (reaction_metadata.length < size) {
        this.setState({ loadReactions: false });
      }
      if (this.state.reactionResults != null) {
        reaction_metadata = this.state.reactionResults.concat(
          reaction_metadata
        );
      }

      this.setState({ reactionResults: reaction_metadata });
    }
  }

  render() {
    const scrollTo = el => {
      window.scrollTo({ behavior: "smooth", top: el.offsetTop - 52 });
    };

    if (
      this.state.metaboliteResults == null &&
      this.state.proteinResults == null &&
      this.state.reactionResults == null
    ) {
      return (
        <div className="loader_container">
          <div className="loader"></div>
        </div>
      );
    }

    return (
      <div className="content-container content-container-columns content-container-search-results-scene">
        <div className="content-block table-of-contents">
          <h2 className="content-block-heading">Contents</h2>
          <div className="content-block-content">
            <ul>
              <li>
                <HashLink to="#metabolites" scroll={scrollTo}>
                  {"Metabolites (XXX)"}
                </HashLink>
              </li>
              <li>
                <HashLink to="#proteins" scroll={scrollTo}>
                  {"Proteins (XXX)"}
                </HashLink>
              </li>
              <li>
                <HashLink to="#reactions" scroll={scrollTo}>
                  {"Reactions (XXX)"}
                </HashLink>
              </li>
            </ul>
          </div>
        </div>

        <SearchResultsList
          loadMetabolites={this.state.loadMetabolites}
          loadProteins={this.state.loadProteins}
          loadReactions={this.state.loadReactions}
          fetchDataHandler={this.fetchData}
          metaboliteResults={this.state.metaboliteResults}
          proteinResults={this.state.proteinResults}
          reactionResults={this.state.reactionResults}
        />
      </div>
    );
  }
}

export default withRouter(SearchResults);
