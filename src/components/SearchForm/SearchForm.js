import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { InputGroup } from "@blueprintjs/core";
import { MenuItem } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDataFromApi } from "~/services/MongoApi";
import axios from "axios";

import "./SearchForm.scss";

const queryString = require("query-string");

class SearchForm extends Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string
    }),
    history: PropTypes.object
  };

  constructor(props) {
    super(props);

    let query = null;
    let organism = null;
    if (props.location.search) {
      let queryArgs = queryString.parse(props.location.search);
      if ("q" in queryArgs) {
        query = queryArgs.q;
      }
      if ("organism" in queryArgs) {
        organism = queryArgs.organism;
      }
    }

    const searchFormValid = query != null;

    this.state = {
      query: query,
      organism: organism,
      matchingOrganisms: [],
      searchFormValid: searchFormValid
    };

    this.getMatchingOrganisms = this.getMatchingOrganisms.bind(this);
    this.submitSearch = this.submitSearch.bind(this);

    this.gettingMatchingOrganisms = false;
    this.cancelTokenSource = null;
  }

  getMatchingOrganisms(query, event) {
    // Blueprint appears to issue two calls per input change; ignore the one with no defined event
    if (!event) {
      return;
    }

    // cancel earlier query
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    // make new query
    this.cancelTokenSource = axios.CancelToken.source();
    const url =
      "ftx/text_search/?query_message=" +
      query +
      "&index=taxon_tree&from_=0&size=100&fields=tax_name&_source_includes=tax_name";
    getDataFromApi([url], { cancelToken: this.cancelTokenSource.token })
      .then(response => {
        this.cancelTokenSource = null;
        this.setState({
          matchingOrganisms: response.data["hits"]["hits"].map(
            hit => hit["_source"]["tax_name"]
          )
        });
        console.log("done");
      })
      .catch(function(thrown) {
        if (!axios.isCancel(thrown)) {
          // TODO: handle error
          console.log(thrown);
        }
      });
  }

  genOrganismMenuItem(organism, { handleClick, modifiers }) {
    return (
      <MenuItem
        active={modifiers.active}
        key={organism}
        onClick={event => {
          handleClick(event);
        }}
        text={organism}
      />
    );
  }

  renderOrganism(organism) {
    return organism;
  }

  submitSearch() {
    let queryArgs = "?q=" + this.state.query;
    if (this.state.organism) {
      queryArgs += "&organism=" + this.state.organism;
    }
    this.props.history.push("/search/" + queryArgs);
    /*
    this.props.history.push({
      pathname: "/search/",
      search: queryArgs,
    });
    */
  }

  render() {
    return (
      <form className="search-form" onSubmit={this.submitSearch}>
        <div className="search-label search-label-find">Find data about</div>

        <InputGroup
          type="text"
          className="search-form-el search-form-el-entity search-input"
          leftIcon=<FontAwesomeIcon icon="atom" />
          placeholder="metabolite, protein, or reaction (e.g., glucose)"
          defaultValue={this.state.query}
          onChange={event => {
            this.setState({
              query: event.target.value,
              searchFormValid:
                event.target.value && event.target.value.trim() !== ""
            });
          }}
        />

        <div className="search-label search-label-in">in</div>

        <Suggest
          ref={el => {
            this.organismSuggest = el;
          }}
          className="search-form-el search-form-el-organism"
          inputProps={{
            className: "search-input",
            leftIcon: <FontAwesomeIcon icon="dna" />,
            placeholder: "organism (e.g., Escherichia coli)"
          }}
          items={this.state.matchingOrganisms}
          openOnKeyDown={true}
          onQueryChange={this.getMatchingOrganisms}
          itemRenderer={this.genOrganismMenuItem}
          selectedItem={this.state.organism}
          activeItem={null}
          inputValueRenderer={this.renderOrganism}
          noResults={<MenuItem disabled={true} text="No matching organisms" />}
          onItemSelect={value => {
            this.setState({ organism: value });
            this.organismSuggest.input.focus();
          }}
        >
          <InputGroup />
        </Suggest>

        <Button
          type="submit"
          className="search-submit"
          icon="search"
          disabled={!this.state.searchFormValid}
          title="Search"
        />
      </form>
    );
  }
}

export default withRouter(SearchForm);
