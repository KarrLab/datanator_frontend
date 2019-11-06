import React, { Component } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
//import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
/*import filterFactory, {
	textFilter,
	selectFilter
} from 'react-bootstrap-table2-filter';
*/
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
      protein: '',
      uniprot:'',
      organism: '',
      buttonValue: 1,
      selectedSearch: 'name',
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
    //this.handleSearch = this.handleSearch.bind(this);
  }

  handleClickInner() {
    console.log("handling click!!")
    if (this.state.selectedSearch == 'name') {
      this.props.handleClick(
        '/protein/name/' + this.state.protein + '/' + this.state.organism,
      );
    }
    else if(this.state.selectedSearch=="uniprot"){
      this.props.handleClick(
        '/protein/uniprot/' + this.state.uniprot,
      );
    }
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    this.setState({
      protein: this.props.defaultMolecule,
      uniprot: this.props.defaultUniprot,
      organism: this.props.defaultOrganism,
    });
    if (this.props.searchType=="uniprot"){
      this.setState({selectedSearch: this.props.searchType})
      this.setState({"buttonValue":2})
    }
    else if (this.props.searchType=="name"){
      this.setState({selectedSearch: this.props.searchType})
      this.setState({"buttonValue":1})
    }

    //this.refs.taxonCol.applyFilter(28)
  }
  buttonChange(e) {
    var searches = ['name', 'uniprot'];
    this.setState({
      buttonValue: e.target.value,
      selectedSearch: searches[e.target.value - 1],
    });
  }

  render() {
    console.log("Rendering Search")
    const Search = Input.Search;
    let styles;

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
      <div className="ProtSearch" style={styles}>
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
              Protein Name
            </Radio>
            <Radio style={radioStyle} value={2}>
              Uniprot ID
              {this.state.value === 2 ? (
                <Input style={{ width: 100, marginLeft: 10 }} />
              ) : null}
            </Radio>
          </Radio.Group>

          {selectedSearch == 'name' && (
            <Input
              style={{ width: '30%' }}
              defaultValue={this.props.defaultMolecule}
              addonBefore="Protein"
              onChange={event => {
                this.setState({ protein: event.target.value });
              }}
            />
          )}
         

          {selectedSearch == 'uniprot' && (
            <Input
              style={{ width: '30%' }}
              defaultValue={this.props.defaultMolecule}
              addonBefore="Uniprot ID"
              onChange={event => {
                this.setState({ uniprot: event.target.value });
              }}
            />
          )}
          <Button
            type="primary"
            shape="circle"
            icon="search"
            onClick={this.handleClickInner}
          />
        </InputGroup>
      </div>
    );
  }
}

export default (ReactionSearch);
