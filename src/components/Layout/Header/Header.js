import React, { Component } from "react";
import { Navbar, AnchorButton, InputGroup } from "@blueprintjs/core";
import { MenuItem } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./header.scss";
import { Logo } from "~/components/Layout/Logo";

const renderFilm = (film, { handleClick, modifiers }) => {
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
      organism: this.props.defaultOrganism,
      wait_for_autocomplete: true,
      show_search: false
    };

    this.handleClickInner = this.handleClickInner.bind(this);
    this.handleClickInnerAuto = this.handleClickInnerAuto.bind(this);
    this.filterFilm = this.filterFilm.bind(this);
  }

  handleClickInner() {
    this.props.handleClick([this.state.query, this.state.organism]);
  }

  handleClickInnerAuto(autocomplete_organism) {
    this.props.handleClick([this.state.query, autocomplete_organism]);
  }

  componentDidMount() {
    this.setState({
      query: this.props.defaultQuery,
      organism: this.props.defaultOrganism
    });
    //this.refs.taxonCol.applyFilter(28)
  }

  filterFilm(query, film) {
    return film.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  }

  render() {
    let show_search = this.state.show_search;
    let icon = "search";
    let search_text = "Search";
    if (show_search) {
      icon = null;
      search_text = "Hide Search";
    }

    return (
      <Navbar fixedToTop="true" className="header-component">
        <Navbar.Group className="logo-container">
          <Logo className="logo" />
        </Navbar.Group>

        {show_search && (
          <Navbar.Group className="search-container">
            <form className="search-form" onSubmit={this.handleClickInner}>
              <InputGroup
                //onKeyPress={ (event) => {if (event.key === "Enter") { (this.handleClickInner()) } }}
                //type='text'
                className="search-form-el search-form-el-entity search-input"
                leftIcon=<FontAwesomeIcon icon="atom" />
                placeholder="Metabolite, protein, or reaction (e.g., glucose)"
                defaultValue={this.state.query}
                onChange={event => {
                  this.setState({ query: event.target.value });
                }}
              />

              <div className="search-in">in</div>

              <Suggest
                className="search-form-el search-form-el-organism"
                items={ORGANISMS}
                openOnKeyDown={true}
                //itemPredicate={Films.itemPredicate}
                itemPredicate={this.filterFilm}
                itemRenderer={renderFilm}
                selectedItem={this.state.organism}
                //activeItem = {null}

                noResults={<MenuItem disabled={true} text="No results." />}
                onQueryChange={(query, event) => {
                  this.setState({ organism: query });
                  //first_enter = true
                }}
                inputValueRenderer={renderInputValue}
                //onQueryChange={() => first_enter = true}
                //activeItem={this.state.organism}
                //onKeyPress={ (event) => {if (event.key === "Enter") { this.handleClickInner() } }}

                onItemSelect={(value, event) => {
                  //if (event.key === "Enter") //{ this.handleClickInner() } }}
                  this.setState({ organism: value });
                  if (event.key === "Enter") {
                    //this.setState({wait_for_autocomplete:false})
                    this.handleClickInnerAuto(value);
                  }
                }}
                onKeyPress={event => {
                  if (
                    event.key === "Enter" &&
                    !this.state.wait_for_autocomplete
                  ) {
                    this.handleClickInner();
                  }
                }}
                inputProps={{
                  className: "search-input",
                  leftIcon: <FontAwesomeIcon icon="dna" />,
                  placeholder: "organism (e.g., Escherichia coli)",

                  onChange: event => {
                    this.setState({ query: event.target.value });
                  },

                  onKeyPress: event => {
                    if (
                      event.key === "Enter" &&
                      !this.state.wait_for_autocomplete
                    ) {
                      this.handleClickInner();
                    }
                  }
                }}
              >
                {/* children become the popover target; render value here */}
                <InputGroup
                //defaultValue={this.state.organism}
                //onKeyPress={ (event) => {if (event.key === "Enter") { this.handleClickInner() } }}
                />
              </Suggest>

              <Button
                type="submit"
                onClick={this.handleClickInner}
                style={{ display: "none" }}
              />
            </form>
          </Navbar.Group>
        )}

        <Navbar.Group align className="page-links">
          <AnchorButton
            minimal="true"
            className="navbutton"
            icon={icon}
            text={search_text}
            onClick={() =>
              this.setState({ show_search: !this.state.show_search })
            }
          />
          <AnchorButton
            minimal="true"
            className="navbutton"
            icon="info-sign"
            text="About"
            href="/about/"
          />
        </Navbar.Group>
      </Navbar>
    );
  }
}
export { Header };

/*
<Autocomplete
  {...defaultProps}
  id="disable-open-on-focus"
  disableOpenOnFocus
  renderInput={params => (
    //<TextField {...params} label="disableOpenOnFocus" margin="normal" fullWidth />
    <InputGroup
      {...params}
      label="disableOpenOnFocus"
      className="searchbar-input"
      //leftIcon="search"
      placeholder="In organism..."
      defaultValue={this.state.organism}
      onChange={event => {
        this.setState({organism:event.target.value})
      }}
    />
  )}
/>
*/
