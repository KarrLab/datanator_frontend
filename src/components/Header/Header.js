import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Navbar, InputGroup } from "@blueprintjs/core";
import { MenuItem } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Header.scss";
import { Logo } from "./Logo/Logo";

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

//const [value, setValue] = React.useState(null);

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

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.defaultQuery,
      organism: this.props.defaultOrganism || "",
      searchFormValid:
        this.props.defaultQuery && this.props.defaultQuery.trim() !== "",
      showSearch: true
    };

    this.filterOrganisms = this.filterOrganisms.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  static get propTypes() {
    return {
      defaultQuery: PropTypes.string,
      defaultOrganism: PropTypes.string,
      handleClick: PropTypes.func
    };
  }

  componentDidMount() {
    this.setState({
      query: this.props.defaultQuery,
      organism: this.props.defaultOrganism || ""
    });
  }

  filterOrganisms(query, film) {
    return film.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  }

  submitSearch() {
    this.props.handleClick([this.state.query, this.state.organism]);
  }

  render() {
    let showSearch = this.state.showSearch;
    let icon = "search";
    let search_text = "Search";
    if (showSearch) {
      icon = null;
      search_text = "Hide Search";
    }

    return (
      <Navbar fixedToTop="true" className="header-component">
        <Navbar.Group className="logo-title-container">
          <Logo />
          <div className="titles">
            <div className="title">Datanator</div>
            <div className="subtitle">Data for modeling cells</div>
          </div>
        </Navbar.Group>

        {showSearch && (
          <Navbar.Group className="search-container">
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
                noResults={
                  <MenuItem disabled={true} text="No matching organisms." />
                }
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
          </Navbar.Group>
        )}

        <Navbar.Group align className="page-links">
          <Button
            minimal="true"
            className="navbutton"
            icon={icon}
            text={search_text}
            onClick={() =>
              this.setState({ showSearch: !this.state.showSearch })
            }
          />
          <Link to="/about">
            <Button
              minimal="true"
              className="navbutton"
              icon="info-sign"
              text="About"
            />
          </Link>
        </Navbar.Group>
      </Navbar>
    );
  }
}
export { Header };
