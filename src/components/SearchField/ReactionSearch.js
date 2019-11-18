import React, { Component } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import ReactDOM from 'react-dom';

import {
  Input,
  Col,
  Row,
  Select,
  InputNumber,
  DatePicker,
  AutoComplete,
  Cascade,
  Button,
  Radio,
} from 'antd';

//import 'antd/dist/antd.css';
import { PropTypes } from 'react';
import { withRouter } from 'react-router';
const queryString = require('query-string');

const InputGroup = Input.Group;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

class ReactionSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      substrates:[null, null, null],
      products: [null, null, null],
      organism: '',
      buttonValue: 1,
      selectedSearch: 'reactants',
      dataSource: [
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
      ],
    };
    this.handleClickInner = this.handleClickInner.bind(this);
    this.goBack = this.goBack.bind(this); //
    this.buttonChange = this.buttonChange.bind(this);
  }

  handleClickInner() {
    if (this.state.selectedSearch == 'reactants') {
      console.log(this.state.substrates)
      this.props.handleClick(
        '/reaction/meta/?substrates=' + this.state.substrates.filter((obj) => obj ) + 
        '&products=' + this.state.products.filter((obj) => obj ) + ''+
        '&substrates_inchi=' + //this.props.substrates_inchi.filter((obj) => obj ) + ''+
        '&products_inchi=' //+ this.props.products_inchi.filter((obj) => obj ) + '',
      );
    }
    else if(this.state.selectedSearch=="reaction_id"){
      this.props.handleClick(
        '/reaction/reaction_id/' + this.state.uniprot,
      );
    }

  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    if (!(this.props.landing)){
      const values = queryString.parse(this.props.location.search)
      this.setState({
        reactants: this.props.defaultMolecule,
        reaction_id: this.props.defaultUniprot,
        substrates: this.props.default_substrates,
        products: this.props.default_products,
      });
    }
    if (this.props.searchType=="reaction_id"){
      this.setState({selectedSearch: this.props.searchType})
      this.setState({"buttonValue":2})
    }
    else if (this.props.searchType=="reactants"){
      this.setState({selectedSearch: this.props.searchType})
      this.setState({"buttonValue":1})
    }

    //this.refs.taxonCol.applyFilter(28)
  }

  /*
  componentDidUpdate(prepProps) {
    if (
      this.props.default_substrates != prepProps.substrates ||
      this.props.default_products != prepProps.products 
    ) { 
      this.setState({substrates:[null, null, null],
      products: [null, null, null],})
      }
    }

    */

  componentDidUpdate(prepProps) {
    console.log("ReactionSearch: Products (state)" + this.state.products)
    console.log("ReactionSearch: Products (props)" + this.props.default_products)
  }




  buttonChange(e) {
    var searches = ['reactants', 'reaction_id'];
    this.setState({
      buttonValue: e.target.value,
      selectedSearch: searches[e.target.value - 1],
    });
  }

  render() {
    console.log("Rendering Search")
    const Search = Input.Search;
    let styles;

    const values = queryString.parse(this.props.location.search)

    if (this.props.landing) {
      styles = {
        'text-align': 'center',
      };
    } else {
      styles = {
        'textAlign': 'left',
        display: 'flex',
        flexDirection: 'row',
      };
    }
    let selectedSearch = this.state.selectedSearch;
    return (
      <div className="ReactionSearch" style={styles}>
        {this.props.landing && (
          <img src={require('~/images/search_logo.png')} />
        )}
        {!this.props.landing && <img src={require('~/images/DT.png')} />}

        <InputGroup compact>
          <Radio.Group
            onChange={this.buttonChange}
            value={this.state.buttonValue}
          >
            <Radio style={radioStyle} value={1}>
              Reactants
            </Radio>
            <Radio style={radioStyle} value={2}>
              Reaction ID
              {this.state.value === 2 ? (
                <Input style={{ width: 100, marginLeft: 10 }} />
              ) : null}
            </Radio>
            <Button
            type="primary"
            shape="circle"
            icon="search"
            onClick={this.handleClickInner}
            />
          </Radio.Group>



          {selectedSearch == 'reactants' && (
            <InputGroup compact style={{ width: '70%' }}>
              <InputGroup compact>
                <Input
                  style={{ width: '33%' }}
                  defaultValue={this.props.default_substrates[0]}
                  addonBefore="Substrates"
                  onChange={event => {
                    this.setState({ substrates: [event.target.value, this.state.substrates[1], this.state.substrates[2]] });
                  }}
                />
                <Input
                  style={{ width: '33%' }}
                  defaultValue={this.props.default_substrates[1]}
                  onChange={event => {
                    this.setState({ substrates:  [this.state.substrates[0], event.target.value, this.state.substrates[2]]  });
                  }}
                />
                <Input
                  style={{ width: '33%' }}
                  defaultValue={this.props.default_substrates[2]}
                  onChange={event => {
                    this.setState({ substrates: [this.state.substrates[0], this.state.substrates[1], event.target.value ]});
                  }}
                />
                <br/>

                <Input
                  style={{ width: '33%' }}
                  defaultValue={this.props.default_products[0]}
                  addonBefore="Products"
                  onChange={event => {
                    this.setState({ products: [event.target.value, this.state.products[1], this.state.products[2]] });
                  }}
                />
                <Input
                  style={{ width: '33%' }}
                  defaultValue={this.props.default_products[1]}
                  onChange={event => {
                    this.setState({ products:  [this.state.products[0], event.target.value, this.state.products[2]]  });
                  }}
                />
                <Input
                  style={{ width: '33%' }}
                  defaultValue={this.props.default_products[2]}
                  onChange={event => {
                    this.setState({ products: [this.state.products[0], this.state.products[1], event.target.value ]});
                  }}
                />
            </InputGroup>
            <br/>
            </InputGroup>


          )}
         

          {selectedSearch == 'reaction_id' && (
            <Input
              style={{ width: '30%' }}
              defaultValue={this.props.defaultMolecule}
              addonBefore="Reaction ID"
              onChange={event => {
                this.setState({ reaction_id: event.target.value });
              }}
            />
          )}

        </InputGroup>
      </div>
    );
  }
}

export default withRouter(ReactionSearch);
