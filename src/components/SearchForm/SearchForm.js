import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { InputGroup } from "@blueprintjs/core";
import { MenuItem } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./SearchForm.scss";

const queryString = require('query-string');

const ORGANISMS = [
  "Aliivibrio fischeri",
  "Ambystoma mexicanum",
  "Amphimedon queenslandica",
  "Anolis carolinensis",
  "AplysiaBranchiostoma floridae",
  "Arabidopsis thaliana",
  "Arbacia punctulata",
  "Ashbya gossypii",
  "Aspergillus nidulans",
  "Azotobacter vinelandii",
  "Bacillus subtilis",
  "Bombina variegata",
  "Brachypodium distachyon",
  "Caenorhabditis elegans",
  "Caledia captiva",
  "Callosobruchus maculatus",
  "Canis lupus familiaris",
  "Caulobacter crescentus",
  "Cavia porcellus",
  "Chlamydomonas reinhardtii",
  "Chorthippus parallelus",
  "Ciona intestinalis",
  "Columba livia domestica",
  "Coprinus cinereus",
  "Cryptococcus neoformans",
  "Danio rerio",
  "Daphnia spp.",
  "Dictyostelium discoideum",
  "Drosophila melanogaster",
  "Emiliania huxleyi",
  "Escherichia coli",
  "etromyzon marinus",
  "Euprymna scolopes",
  "Felis sylvestris catus",
  "Galleria mellonella",
  "Gallus gallus domesticus",
  "Gasterosteus aculeatus",
  "Gryllus bimaculatus",
  "Heterocephalus glaber",
  "Homo sapiens",
  "Lemna gibba",
  "Loligo pealei",
  "Lotus japonicus",
  "Macaca mulatta",
  "Macrostomum lignano",
  "Marchantia polymorpha",
  "Medicago truncatula",
  "Mesocricetus auratus",
  "Mimulus guttatus",
  "Mnemiopsis leidyi",
  "Mus musculus",
  "Mycoplasma genitalium",
  "Myotis lucifugus",
  "Nematostella vectensis",
  "Neurospora crassa",
  "Nicotiana benthamiana",
  "Nothobranchius furzeri",
  "Oikopleura dioica",
  "Oryza sativa",
  "Oryzias latipes",
  "Oscarella carmela",
  "Parhyale hawaiensis",
  "Physcomitrella patens",
  "Platynereis dumerilii",
  "Poecilia reticulata",
  "Populus trichocarpa",
  "Pristionchus pacificus",
  "Pseudomonas fluorescens",
  "Rattus norvegicus",
  "Saccharomyces cerevisiae",
  "Scathophaga stercoraria",
  "Schizophyllum commune",
  "Schizosaccharomyces pombe",
  "Schmidtea mediterranea",
  "Selaginella moellendorffii",
  "Setaria viridis",
  "Stomatogastric ganglion",
  "Streptomyces coelicolor",
  "Strongylocentrotus purpuratus",
  "Symsagittifera roscoffensis",
  "Synechocystis",
  "Taeniopygia guttata",
  "Takifugu rubripes",
  "Tetrahymena thermophila",
  "Thalassiosira pseudonana",
  "Tribolium castaneum",
  "Trichoplax adhaerens",
  "Tubifex tubifex",
  "Ustilago maydis",
  "Xenopus laevis"
];

const renderOrganism = (film, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      key={film}
      onClick={event => {
        handleClick(event);
      }}
      text={film}
    />
  );
};

const renderInputValue = organism => organism;

class SearchForm extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        query: PropTypes.string,
        organism: PropTypes.string
      })
    }),
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);

    let query = null;
    let organism = null;
    if (props.location.search) {
      let queryArgs = queryString.parse(props.location.search);
      if ('q' in queryArgs) {
        query = queryArgs.q;
      }
      if ('organism' in queryArgs) {
        organism = queryArgs.organism;
      }
    }

    const searchFormValid = query != null;
    
    this.state = {
      query: query,
      organism: organism,
      searchFormValid: searchFormValid
    };

    this.filterOrganisms = this.filterOrganisms.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  filterOrganisms(query, film) {
    return film.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  }

  submitSearch() {
    let queryArgs = "?q=" + this.state.query;
    if (this.state.organism) {
      queryArgs += "&organism=" + this.state.organism;
    }
    this.props.history.push('/search/' + queryArgs)
    /*
    this.props.history.push({
      pathname: "/search/",
      search: queryArgs,
      state: {
        query: this.state.query,
        organism: this.state.organism
      }
    });
    */
  }

  render() {
    return (
      <form className="search-form" onSubmit={this.submitSearch}>
        <InputGroup
          type="text"
          className="search-form-el search-form-el-entity search-input"
          leftIcon=<FontAwesomeIcon icon="atom" />
          placeholder="Metabolite, protein, or reaction (e.g., glucose)"
          defaultValue={this.state.query}
          onChange={event => {
            this.setState({
              query: event.target.value,
              searchFormValid:
                event.target.value && event.target.value.trim() !== ""
            });
          }}
        />

        <div className="search-in">in</div>

        <Suggest
          ref={el => {
            this.organismSuggest = el;
          }}
          className="search-form-el search-form-el-organism"
          inputProps={{
            className: "search-input",
            leftIcon: <FontAwesomeIcon icon="dna" />,
            placeholder: "Organism (e.g., Escherichia coli)",
            onChange: event => {
              this.setState({ query: event.target.value });
            }
          }}
          items={ORGANISMS}
          openOnKeyDown={true}
          //itemPredicate={Films.itemPredicate}
          itemPredicate={this.filterOrganisms}
          itemRenderer={renderOrganism}
          selectedItem={this.state.organism}
          activeItem={null}
          inputValueRenderer={renderInputValue}
          noResults={<MenuItem disabled={true} text="No matching organisms." />}
          onQueryChange={query => {
            this.setState({ organism: query });
          }}
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
        />
      </form>
    );
  }
}
export default withRouter(SearchForm);
