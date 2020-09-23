import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { InputGroup } from "@blueprintjs/core";
import { MenuItem } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import { Tooltip, Position } from "@blueprintjs/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import axios from "axios";
import { parseHistoryLocationPathname } from "~/utils/utils";

import "./SearchForm.scss";

class SearchForm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.unlistenToHistory = null;

    this.state = {
      query: "",
      organism: null,
      matchingOrganisms: [],
      queryValid: false,
      organismValid: true,
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
        const query = decodeURIComponent(route.query);
        const organism = route.organism;
        let organismItem;
        if (organism) {
          organismItem = {
            _source: {
              tax_name: decodeURIComponent(organism),
            },
          };
        } else {
          organismItem = null;
        }

        this.setState({
          query: query,
          queryValid: query !== "",
          organism: organismItem,
          organismValid: true,
        });

        this.organismSuggest.setState({ selectedItem: organismItem });
      }
    }
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

    const state = {
      organism: null,
      organismValid: query === "",
    };
    if (!query) {
      state["matchingOrganisms"] = [];
      this.organismSuggest.setState({ selectedItem: null });
    }
    this.setState(state);

    if (!query) {
      return;
    }

    // make new query
    this.cancelTokenSource = axios.CancelToken.source();
    const url =
      "ftx/text_search/?" +
      [
        "index=taxon_tree",
        "query_message=" + query,
        "from_=0",
        "size=100",
        "fields=tax_name",
        "_source_includes=tax_name",
      ].join("&");
    getDataFromApi(url, { cancelToken: this.cancelTokenSource.token })
      .then(this.setOrganismMenu.bind(this, query))
      .catch(
        genApiErrorHandler.bind(
          null,
          url,
          "Unable to search for organisms that match '" + query + "'."
        )
      )
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  setOrganismMenu(query, response) {
    this.setState({ matchingOrganisms: response.data["hits"]["hits"] });
  }

  genOrganismMenuItem(organism, { handleClick, modifiers }) {
    return (
      <MenuItem
        active={modifiers.active}
        key={organism["_id"]}
        onClick={(event) => {
          handleClick(event);
        }}
        text={organism["_source"]["tax_name"]}
      />
    );
  }

  renderOrganism(organism) {
    return organism["_source"]["tax_name"];
  }

  selectOrganism(value) {
    this.setState({
      organism: value,
      organismValid: true,
    });
    this.organismSuggest.inputEl.focus();
  }

  submitSearch(event) {
    event.preventDefault();

    let url = "/search/";
    url += encodeURIComponent(this.state.query) + "/";
    if (this.state.organism) {
      url +=
        encodeURIComponent(this.state.organism["_source"]["tax_name"]) + "/";
    }
    this.props.history.push(url);
  }

  render() {
    const entityTooltip = (
      <div>
        <p>
          Enter the id or name of a metabolite, gene, or reaction to search for
          data about such as
        </p>
        <ul>
          <li>
            <b>Metabolite:</b> name &ndash; Adenosine, ChEBI id &ndash; 16335,
            or PubChem id &ndash; 60961
          </li>
          <li>
            <b>Gene:</b> name &ndash; Glutamate dehydrogenase, symbol &ndash;
            GLUD1, UniProt id &ndash; P00367, or OrthoDB id &ndash; 692851at2759
          </li>
          <li>
            <b>Reaction:</b> name &ndash; Glucose-6-phosphatase or EC code
            &ndash; 3.1.3.9
          </li>
        </ul>
        <p>
          This input will be used to search for metabolites, genes, and
          reactions with similar ids and names for which <i>Datanator</i>{" "}
          contains potentially relevant experimental measurements.
        </p>
      </div>
    );

    const taxonTooltip = (
      <div>
        <p>
          Use this suggestion box to select a taxon such as &ldquo;Homo
          sapiens&rdquo;, &ldquo;E. coli&rdquo;, or &ldquo;Bacillus&rdquo; to
          find relevant data about.
        </p>
        <p>
          The data pages will use this input to (a) sort potentially relevant
          measurements by their taxonomic similarity to your taxon of interest
          and (b) provide you a slider for filtering these measurements by their
          taxonomic relevance.
        </p>
        <p>
          Note, due to the complexity of calculating taxonomic similarity,
          Datanator&apos;s search results display metabolites, genes, and
          reactions from all taxa. Going forward, we aim to filter and rank
          these search results by their relevance to your taxon of interest.
        </p>
        <p>Please see the help for more information.</p>
      </div>
    );

    return (
      <form className="search-form" onSubmit={this.submitSearch}>
        <div className="search-label search-label-find">Find data about</div>

        <Tooltip
          content={entityTooltip}
          className="search-form-el"
          position={Position.BOTTOM}
        >
          <InputGroup
            aria-label="Biochemical entity (e.g., metabolite, gene, or reaction)"
            type="text"
            className="search-form-el-entity search-input"
            leftIcon=<FontAwesomeIcon icon="atom" />
            placeholder="metabolite, gene, or reaction (e.g., Adenosine)"
            value={this.state.query}
            onChange={(event) => {
              this.setState({
                query: event.target.value,
                queryValid:
                  event.target.value && event.target.value.trim() !== "",
              });
            }}
          />
        </Tooltip>

        <div className="search-label search-label-in">in</div>

        <Tooltip
          content={taxonTooltip}
          className="search-form-el"
          position={Position.BOTTOM}
        >
          <Suggest
            ref={(el) => {
              this.organismSuggest = el;
            }}
            className="search-form-el-organism"
            inputProps={{
              "aria-label": "Taxon (e.g., Escherichia coli)",
              className: "search-input",
              leftIcon: <FontAwesomeIcon icon="dna" />,
              placeholder: "taxon (e.g., Escherichia coli)",
            }}
            items={this.state.matchingOrganisms}
            openOnKeyDown={true}
            onQueryChange={this.getMatchingOrganisms}
            itemRenderer={this.genOrganismMenuItem}
            inputValueRenderer={this.renderOrganism}
            noResults={
              <MenuItem disabled={true} text="No matching organisms" />
            }
            onItemSelect={this.selectOrganism}
          >
            <InputGroup />
          </Suggest>
        </Tooltip>

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
