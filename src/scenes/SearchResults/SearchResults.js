import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { HashLink } from "react-router-hash-link";

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
      metabolites: {
        showLoadMore: true,
        pageCount: 0,
        results: null,
      },
      proteins: {
        showLoadMore: true,
        pageCount: 0,
        results: null,
      },
      reactions: {
        showLoadMore: true,
        pageCount: 0,
        results: null,
      },
    };

    this.getFetchDataUrl = this.getFetchDataUrl.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.formatData = this.formatData.bind(this);
  }

  componentDidMount() {
    this.fetchData("metabolites", 10);
    this.fetchData("proteins", 10);
    this.fetchData("reactions", 10);
  }

  getFetchDataUrl(index, pageSize) {
    const values = queryString.parse(this.props.location.search);
    const pageCount = this.state[index].pageCount;    

    if (index === "proteins") {
      return (
        "ftx/text_search/protein_ranked_by_ko/" +
        "?query_message=" +
        values.q +
        "&from_=" +
        (pageCount * 10) +
        "&size=" +
        pageSize +
        "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzymes.enzyme.enzyme_name&fields=enzymes.subunit.canonical_sequence&fields=species");
    } else {
      let indexQueryArg = "";
      if (index === "reactions") {
        indexQueryArg = "sabio_reaction_entries";
      } else {
        indexQueryArg = "metabolites_meta";
      }

      return (
        "ftx/text_search/num_of_index/" +
        "?query_message=" +
        values.q +
        "&index=" +
        indexQueryArg +
        "&from_=" +
        (pageCount * 10) +
        "&size=" +
        pageSize +
        "&fields=protein_name&fields=synonyms&fields=enzymes&fields=ko_name&fields=gene_name&fields=name&fields=enzyme_name&fields=product_names&fields=substrate_names&fields=enzymes.subunit.canonical_sequence&fields=species");
    }
  }

  fetchData(index, pageSize) {
    const url = this.getFetchDataUrl(index, pageSize);
    getSearchData([url]).then(response => {
      this.formatData(index, response.data, pageSize);
    });

    const state = this.state[index];
    state.pageCount++;
    this.setState({ index: state });
  }

  formatData(index, data, pageSize) {
    if (index === "metabolites") {      
      this.formatSectionData('metabolites', data["metabolites_meta"], pageSize, formatMetabolite);
    
    } else if (index === 'proteins') {
      this.formatSectionData('proteins', data["top_kos"]["buckets"], pageSize, formatProtein);
    
    } else if (index === 'reactions') {
      this.formatSectionData('reactions', data["sabio_reaction_entries"], pageSize, formatReaction);
    }
  }

  formatSectionData(index, data, pageSize, formatFunc) {
    let formattedData = formatFunc(data);
    if (formattedData.length < pageSize) {
      const state = this.state[index];
      state.showLoadMore = false;
      this.setState({ index: state });
    }
    if (this.state[index].results != null) {
      formattedData = this.state[index].results.concat(
        formattedData
      );
    }

    const state = this.state[index];
    state.results = formattedData;
    this.setState({ index: state });
  }

  render() {
    const scrollTo = el => {
      window.scrollTo({ behavior: "smooth", top: el.offsetTop - 52 });
    };

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

        <div className="content-column">
          <SearchResultsList
            htmlAnchorId='metabolites'
            title='Metabolites'
            showLoadMore={this.state.metabolites.showLoadMore}
            fetchDataHandler={this.fetchData}
            fetchDataKey='metabolites'
            results={this.state.metabolites.results}
          />
          <SearchResultsList
            htmlAnchorId='proteins'
            title='Proteins'
            showLoadMore={this.state.proteins.showLoadMore}
            fetchDataHandler={this.fetchData}
            fetchDataKey='proteins'
            results={this.state.proteins.results}
          />
          <SearchResultsList
            htmlAnchorId='reactions'
            title='Reactions'
            showLoadMore={this.state.reactions.showLoadMore}
            fetchDataHandler={this.fetchData}
            fetchDataKey='reactions'
            results={this.state.reactions.results}
          />
        </div>
      </div>
    );
  }
}

export default SearchResults;
