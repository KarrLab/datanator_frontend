import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { HashLink } from "react-router-hash-link";
import { withRouter } from "react-router";

import { getSearchData } from "~/services/MongoApi";
import { formatMetaboliteMetadata } from "~/scenes/Results/get_metabolite_rows";
import { formatProteinMetadata } from "~/scenes/Results/get_protein_rows";
import { formatReactionMetadata } from "~/scenes/Results/get_reaction_rows";

import { Header } from "~/components/Header/Header";
import { Footer } from "~/components/Footer/Footer";
import SearchResultsList from "../Results/SearchResultsList.js";

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
      metabolite_results: null,
      protein_results: null,
      reaction_results: null,
      meh: false,
      page_index_counter: {
        metabolites_meta: 0,
        sabio_reaction_entries: 0,
        protein: 0
      },
      metabolite_load: true,
      protein_load: true,
      reactions_load: true
    };

    this.fetch_data = this.fetch_data.bind(this);
    this.formatData = this.formatData.bind(this);
  }

  componentDidMount() {
    this.fetch_data("metabolites_meta", 10);
    // this.fetch_data("rna_halflife", 10);
    this.fetch_data("protein", 10);
    this.fetch_data("sabio_reaction_entries", 10);
  }

  componentDidUpdate() {
    if (this.state.newResults) {
      this.fetch_data("metabolites_meta", 10);
      // this.fetch_data("rna_halflife", 10);
      this.fetch_data("protein", 10);
      this.fetch_data("sabio_reaction_entries", 10);
      this.setState({ newResults: false });
    }
  }

  fetch_data(indices, size) {
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
      let metabolite_metadata = formatMetaboliteMetadata(
        metabolite_data,
        values.organism
      );
      if (metabolite_metadata.length < size) {
        this.setState({ metabolite_load: false });
      }
      if (this.state.metabolite_results != null) {
        metabolite_metadata = this.state.metabolite_results.concat(
          metabolite_metadata
        );
      }
      //let metabolite_metadata = this.state.metabolite_results.concat(formatMetaboliteMetadata(metabolite_data, values.organism))
      this.setState({ metabolite_results: metabolite_metadata });
    }

    if ("top_kos" in data) {
      let protein_data = data["top_kos"]["buckets"];
      //let protein_metadata = this.state.protein_results.concat(formatProteinMetadata(protein_data, values.organism))
      let protein_metadata = formatProteinMetadata(
        protein_data,
        values.organism
      );
      if (protein_metadata.length < size) {
        this.setState({ protein_load: false });
      }
      if (this.state.protein_results != null) {
        protein_metadata = this.state.protein_results.concat(protein_metadata);
      }
      this.setState({ protein_results: protein_metadata });
    }

    if ("sabio_reaction_entries" in data) {
      let reaction_data = data["sabio_reaction_entries"];

      let reaction_metadata = formatReactionMetadata(reaction_data);
      if (reaction_metadata.length < size) {
        this.setState({ reactions_load: false });
      }
      if (this.state.reaction_results != null) {
        reaction_metadata = this.state.reaction_results.concat(
          reaction_metadata
        );
      }

      //let reaction_metadata = this.state.reaction_results.concat(formatReactionMetadata(reaction_data))
      this.setState({ reaction_results: reaction_metadata });
    }
  }

  render() {
    const scrollTo = el => {
      window.scrollTo({ behavior: "smooth", top: el.offsetTop - 52 });
    };

    if (
      this.state.metabolite_results == null &&
      this.state.protein_results == null &&
      this.state.reaction_results == null
    ) {
      return (
        <div>
          <Header />
          <div className="loader_container">
            <div className="loader"></div>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div>
        <Header />

        <div className="content-container content-container-columns">
          <div className="content-block table-of-contents">
            <h2 className="content-block-heading">Contents</h2>
            <div className="content-block-content">
              <ul>
                <li>
                  <HashLink to="#metabolites" scroll={scrollTo}>
                    {"Metabolites"}
                  </HashLink>
                </li>
                <li>
                  <HashLink to="#proteins" scroll={scrollTo}>
                    {"Proteins"}
                  </HashLink>
                </li>
                <li>
                  <HashLink to="#reactions" scroll={scrollTo}>
                    {"Reactions"}
                  </HashLink>
                </li>
              </ul>
            </div>
          </div>

          <SearchResultsList
            metabolite_results={this.state.metabolite_results}
            protein_results={this.state.protein_results}
            reaction_results={this.state.reaction_results}
            handle_fetch_data={this.fetch_data}
            metabolite_load={this.state.metabolite_load}
            protein_load={this.state.protein_load}
            reactions_load={this.state.reactions_load}
          />
        </div>

        <Footer />
      </div>
    );
  }
}

export default withRouter(SearchResults);
