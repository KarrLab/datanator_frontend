import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { InputGroup } from "@blueprintjs/core";
import { MenuItem } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import axios from "axios";
import { parseHistoryLocationPathname } from "~/utils/utils";

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
      const route = parseHistoryLocationPathname(this.props.history);
      if (
        route.route === "search" &&
        route.query != null &&
        route.query !== undefined
      ) {
        const query = route.query;
        const organism = route.organism;

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
      "ftx/text_search/" +
      "?index=taxon_tree" +
      "&query_message=" +
      query +
      "&from_=0" +
      "&size=100" +
      "&fields=tax_name" +
      "&_source_includes=tax_name";
    getDataFromApi([url], { cancelToken: this.cancelTokenSource.token })
      .then(response => {
        this.setState({
          matchingOrganisms: response.data["hits"]["hits"].map(
            hit => hit["_source"]["tax_name"]
          )
        });
      })
      .catch(
        genApiErrorHandler(
          [url],
          "Unable to search for organisms that match '" + query + "'."
        )
      )
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
          aria-label="Biochemical entity (e.g., metabolite, gene, or reaction)"
          type="text"
          className="search-form-el search-form-el-entity search-input"
          leftIcon=<FontAwesomeIcon icon="atom" />
          placeholder="metabolite, gene, or reaction (e.g., glucose)"
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
            "aria-label": "Taxon (e.g., Escherichia coli)",
            className: "search-input",
            leftIcon: <FontAwesomeIcon icon="dna" />,
            placeholder: "taxon (e.g., Escherichia coli)"
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
          className="icon-button search-submit"
          icon="search"
          disabled={!this.state.queryValid || !this.state.organismValid}
          title="Search"
        />
      </form>
    );
  }
}

export default withRouter(SearchForm);
