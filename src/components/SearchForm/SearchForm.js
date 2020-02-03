import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { InputGroup } from "@blueprintjs/core";
import { MenuItem } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDataFromApi } from "~/services/RestApi";
import axios from "axios";

import "./SearchForm.scss";

class SearchForm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.unlistenToHistory = null;

    this.state = {
      query: "",
      organism: "",
      matchingOrganisms: [],
      queryValid: false,
      organismValid: true
    };

    this.getMatchingOrganisms = this.getMatchingOrganisms.bind(this);
    this.selectOrganism = this.selectOrganism.bind(this);
    this.submitSearch = this.submitSearch.bind(this);

    this.gettingMatchingOrganisms = false;
    this.cancelTokenSource = null;
  }

  componentDidMount() {
    this.unlistenToHistory = this.props.history.listen(() => {
      this.updateStateFromLocation();
    });
    this.updateStateFromLocation();
  }

  componentWillUnmount() {
    this.unlistenToHistory();
    this.unlistenToHistory = null;
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      const pathRegex = /^\/search\/(.*?)(\/(.*?))?\/?$/;
      const match = this.props.history.location.pathname.match(pathRegex);
      if (match) {
        const query = match[1].trim();
        const organism = match[3].trim() || "";

        this.setState({
          query: query,
          queryValid: query !== ""
        });

        this.setState({
          organism: organism,
          organismValid: true
        });
      }
    }
  }

  getMatchingOrganisms(query, event, isSelectEvent = false) {
    // Blueprint appears to issue two calls per input change; ignore the one with no defined event
    if (!event) {
      return;
    }

    this.setState({
      organism: query,
      organismValid: query === "" || isSelectEvent
    });

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
    getDataFromApi(
      [url],
      { cancelToken: this.cancelTokenSource.token },
      "Unable to search for organisms that match '" + query + "'."
    )
      .then(response => {
        if (!response) return;

        this.setState({
          matchingOrganisms: response.data["hits"]["hits"].map(
            hit => hit["_source"]["tax_name"]
          )
        });
      })
      .finally(() => {
        this.cancelTokenSource = null;
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

  selectOrganism(value, event) {
    this.getMatchingOrganisms(value, event, true);
    this.organismSuggest.input.focus();
  }

  submitSearch(event) {
    event.preventDefault();

    let url = "/search/";
    url += this.state.query + "/";
    if (this.state.organism) {
      url += this.state.organism + "/";
    }
    this.props.history.push(url);
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
          value={this.state.query}
          onChange={event => {
            this.setState({
              query: event.target.value,
              queryValid: event.target.value && event.target.value.trim() !== ""
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
          inputValueRenderer={this.renderOrganism}
          noResults={<MenuItem disabled={true} text="No matching organisms" />}
          onItemSelect={this.selectOrganism}
          query={this.state.organism}
        >
          <InputGroup />
        </Suggest>

        <Button
          type="submit"
          className="search-submit"
          icon="search"
          disabled={!this.state.queryValid || !this.state.organismValid}
          title="Search"
        />
      </form>
    );
  }
}

export default withRouter(SearchForm);
