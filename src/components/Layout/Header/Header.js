import React, { Component } from 'react';
import { Navbar, AnchorButton, InputGroup } from '@blueprintjs/core';
import { Classes, MenuItem } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { Suggest, ISelectItemRendererProps, Select,  } from '@blueprintjs/select';

import './header.css';
import { Logo } from '~/components/Layout/Logo';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Playground from '~/components/Layout/Header/test_auto'

const filterFilm = (query, film) => {
    return film.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderFilm = (film, { handleClick, modifiers }) => {

    if (!modifiers.matchesPredicate) {
        return null;
    }
    return (
        <MenuItem
            active={modifiers.active}
            key={film}
            onClick={(event) => {handleClick(event); console.log(event)}}
            text={film}
        />
    );
};
const renderInputValue = (organism) => organism;

  //const [value, setValue] = React.useState(null);

const ORGANISMS = [
        'Escherichia coli',
        'Bacillus subtilis',
        'Caulobacter crescentus',
        'Mycoplasma genitalium',
        'Aliivibrio fischeri',
        'Synechocystis',
        'Pseudomonas fluorescens',
        'Azotobacter vinelandii',
        'Streptomyces coelicolor',
        'Chlamydomonas reinhardtii',
        'Dictyostelium discoideum',
        'Tetrahymena thermophila',
        'Emiliania huxleyi',
        'Thalassiosira pseudonana',
        'Ashbya gossypii',
        'Aspergillus nidulans',
        'Coprinus cinereus',
        'Cryptococcus neoformans',
        'Neurospora crassa',
        'Saccharomyces cerevisiae',
        'Schizophyllum commune',
        'Schizosaccharomyces pombe',
        'Ustilago maydis',
        'Arabidopsis thaliana',
        'Selaginella moellendorffii',
        'Brachypodium distachyon',
        'Setaria viridis',
        'Lotus japonicus',
        'Lemna gibba',
        'Medicago truncatula',
        'Mimulus guttatus',
        'Nicotiana benthamiana',
        'Oryza sativa',
        'Physcomitrella patens',
        'Marchantia polymorpha',
        'Populus trichocarpa',
        'Amphimedon queenslandica',
        'Arbacia punctulata',
        'Aplysia,Branchiostoma floridae',
        'Caenorhabditis elegans',
        'Caledia captiva',
        'Callosobruchus maculatus',
        'Chorthippus parallelus',
        'Ciona intestinalis',
        'Daphnia spp.',
        'Drosophila melanogaster',
        'Euprymna scolopes',
        'Galleria mellonella',
        'Gryllus bimaculatus',
        'Loligo pealei',
        'Macrostomum lignano',
        'Mnemiopsis leidyi',
        'Nematostella vectensis',
        'Oikopleura dioica',
        'Oscarella carmela',
        'Parhyale hawaiensis',
        'Platynereis dumerilii',
        'Pristionchus pacificus',
        'Scathophaga stercoraria',
        'Schmidtea mediterranea',
        'Stomatogastric ganglion',
        'Strongylocentrotus purpuratus',
        'Symsagittifera roscoffensis',
        'Tribolium castaneum',
        'Trichoplax adhaerens',
        'Tubifex tubifex',
        'Ambystoma mexicanum',
        'Bombina variegata',
        'Anolis carolinensis',
        'Felis sylvestris catus',
        'Gallus gallus domesticus',
        'Canis lupus familiaris',
        'Mesocricetus auratus',
        'Cavia porcellus',
        'Myotis lucifugus',
        'Oryzias latipes',
        'Mus musculus',
        'Heterocephalus glaber',
        'Nothobranchius furzeri',
        'Columba livia domestica',
        'Poecilia reticulata',
        'Rattus norvegicus',
        'Macaca mulatta',
        'etromyzon marinus',
        'Takifugu rubripes',
        'Gasterosteus aculeatus',
        'Xenopus laevis',
        'Taeniopygia guttata',
        'Danio rerio',
        'Homo sapiens',
      ]

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.defaultQuery,
      organism: this.props.defaultOrganism,
      wait_for_autocomplete:true,
      show_search:false,
    }

    this.handleClickInner = this.handleClickInner.bind(this);
    this.handleClickInnerAuto = this.handleClickInnerAuto.bind(this);
    this.filterFilm = this.filterFilm.bind(this);



  }

  handleClickInner() {
    this.props.handleClick([this.state.query, this.state.organism])

  }

  handleClickInnerAuto(autocomplete_organism) {
    this.props.handleClick([this.state.query, autocomplete_organism])

  }

  componentDidMount() {
    this.setState({
      query: this.props.defaultQuery,
      organism: this.props.defaultOrganism,

    });
    //this.refs.taxonCol.applyFilter(28)
  }



   filterFilm(query, film) {
    return film.toLowerCase().indexOf(query.toLowerCase()) >= 0;};   











  render() {

    let show_search = this.state.show_search
    let icon = "search"
    let search_text = "Search"
    if (show_search){
      icon = null
      search_text = "Hide Search"
    }

  return (
     <Navbar fixedToTop="true" className="bp3-dark navbar">
      <Navbar.Group className="logo-holder">
        <Logo className="logo" />
      </Navbar.Group>

      { show_search &&
      <Navbar.Group className="searchbar">
      <form className="searchbar-input"  onSubmit={this.handleClickInner} >

        <Button type="submit" onClick={this.handleClickInner} style={{display: "none"}}/>
        
        <InputGroup
          //onKeyPress={ (event) => {if (event.key === "Enter") { (this.handleClickInner()) } }}
          //type='text'
          className="searchbar-input"
          leftIcon="search"
          placeholder="Search for..."
          
          defaultValue={this.state.query}
          onChange={event => {
            console.log("hello")
              this.setState({query:event.target.value});
            }}
        />


        </form>

        <div className="in">
        <p>in</p>
        </div>

        <Suggest
        className="searchbar-input"
        items={ORGANISMS}
        openOnKeyDown={true}
        //itemPredicate={Films.itemPredicate}
        itemPredicate={this.filterFilm} 
        itemRenderer={renderFilm}
        selectedItem={this.state.organism}
        //activeItem = {null}

        noResults={<MenuItem disabled={true} text="No results." 
      />}
        onQueryChange={(query, event) => {
            console.log(event)
              this.setState({organism:query});
              //first_enter = true
            }}
        inputValueRenderer={renderInputValue}
        //onQueryChange={() => first_enter = true}
        //activeItem={this.state.organism}
        //onKeyPress={ (event) => {if (event.key === "Enter") { this.handleClickInner() } }}

        
        onItemSelect={(value, event) => {
          console.log(event)
          //if (event.key === "Enter") //{ this.handleClickInner() } }}
              this.setState({organism:value})
              if (event.key === "Enter"){
                console.log("woooooo")
                //this.setState({wait_for_autocomplete:false})
                this.handleClickInnerAuto(value)
              }
            }
          }


        onKeyPress= {(event) => {
          //console.log(this.state.wait_for_autocomplete)
          if ((event.key === "Enter") && (!this.state.wait_for_autocomplete)) { (this.handleClickInner()) }

        }}

        inputProps={{placeholder:"organism...",

        onChange:((event) => {
            console.log("hello")
              this.setState({query:event.target.value});
            }),

         

        onKeyPress:((event) => {
          //console.log(this.state.wait_for_autocomplete)
          if ((event.key === "Enter") && (!this.state.wait_for_autocomplete)) { (this.handleClickInner()) }

        })

      

          }}
            
        
    >


        {/* children become the popover target; render value here */}
         <InputGroup
          //className="searchbar-input"
          leftIcon="search"
          //placeholder="Search for..."
          //defaultValue={this.state.organism}
          //onKeyPress={ (event) => {if (event.key === "Enter") { this.handleClickInner() } }}
        />
    </Suggest>

        
      </Navbar.Group>
    }
      <Navbar.Group align className="page-links">

      <AnchorButton
          minimal="true"
          className="navbutton"
          icon={icon}
          text={search_text}
          onClick={() => this.setState({show_search:!this.state.show_search})}
      />
        <AnchorButton
          minimal="true"
          className="navbutton"
          icon="home"
          text="Home"
          href="/"
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
};}
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

