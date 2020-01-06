// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReactDOM from 'react-dom';

//import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

import { Link, Redirect } from 'react-router-dom';

import { PropTypes } from 'react';
import Typography from '@material-ui/core/Typography';
import { abstractMolecule } from '~/data/actions/pageAction';

const products = [{ id: '3', name: 'bob' }];
const columns = [
  {
    dataField: 'id',
    text: 'Product ID',
  },
  {
    dataField: 'name',
    text: 'Product Name',
  },
  {
    dataField: 'price',
    text: 'Product Price',
  },
];


@connect(store => {
  return {};
})
class ProteinDefinition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_columns: [
        {
          dataField: 'reactionID',
          text: 'Reaction ID',
        },

        {
          dataField: 'equation',
          text: 'Reaction Equation',
          formatter: this.colFormatter,
        },
      ],

      total_data: [],
    };
    this.colFormatter = this.colFormatter.bind(this);
  }

  componentDidMount() {
    console.log('hello');

    this.setState({ total_data: this.props.reactionMetadata });
  }

  componentDidUpdate(prevProps) {
    console.log('hello');

    if (this.props.reactionMetadata !== prevProps.reactionMetadata) {
      this.setState({ total_data: this.props.reactionMetadata });
    }
  }

  colFormatter = (cell, row) => {
    if (cell) {
      console.log(cell[1]);
      let substrates = cell[0]
        .toString()
        .split('==>')[0]
        .split(' + ');
      let products = cell[0]
        .toString()
        .split('==>')[1]
        .split(' + ');
      let url =
        '/reaction/data/?substrates=' +
        substrates +
        '&products=' +
        products +
        '&substrates_inchi=' +
        cell[1]['sub_inchis'] +
        '&products_inchi=' +
        cell[1]['prod_inchis'];

      return <Link to={url}>{cell[0].toString()}</Link>;
    } else {
      return <div></div>;
    }
  };

  partFormatter = (cell, row) => {
    let participants = '';
    if (cell) {
      for (var i = cell.length - 1; i >= 0; i--) {
        participants = participants + cell[i] + ' + ';
      }
      participants = participants.substring(0, participants.length - 3);
      return <div>{participants}</div>;
    } else {
      return <div></div>;
    }
  };

  render() {
    let proteinMetadata = this.props.proteinMetadata
    
    console.log(proteinMetadata)
    console.log("baloonanimal")
    console.log(proteinMetadata.length)
    //console.log(proteinMetadata[0].length)
  if (proteinMetadata[0] === undefined || proteinMetadata[0].length == 0) {
      return(<div></div>)
    }
    proteinMetadata = proteinMetadata[0]
    console.log("towerpower2")


    //proteinMetadata = proteinMetadata[0]

    let uniprot_ids = proteinMetadata.uniprot_ids
    let uniprot_links = []
    for (var i = uniprot_ids.length - 1; i >= 0; i--) {
     let a =  uniprot_ids[i]
     let link = ""
     link = <a href={"https://www.uniprot.org/uniprot/" + uniprot_ids[i]} > {uniprot_ids[i]}, </a>
     uniprot_links.push(link)
    }

    return (
      <div
        className="metabolite_definition_data"
      >

      <Typography variant="h6" className={'green'}>
        {proteinMetadata.ko_name[0]}
      </Typography>

      <div
        className="photo_and_description"
      >

        <div  className="vertical_center" >
            <img
              border="0"
              alt="W3Schools"
              src={"https://image.flaticon.com/icons/png/512/1951/1951420.png"}
              width="180"
              height="180"
            ></img>
        </div>

        <div  className="metadata_description" >
            <p><b>Name:</b> {proteinMetadata.ko_name[0]}</p>
            <p><b>KO Number:</b> <a href={"https://www.genome.jp/dbget-bin/www_bget?ko:" + proteinMetadata.ko_number}> {proteinMetadata.ko_number}</a></p>
            <p><b>Uniprot IDs:</b> {uniprot_links}</p>

      </div>
      </div>

      </div>
    );
  }
}

export { ProteinDefinition };

/*
inchi:"InChI=1S/C9H15N2O15P3/c12-5-1-2-11(9(15)10-5)8-7(14)6(13)4(24-8)3-23-28(19,20)26-29(21,22)25-27(16,17)18/h1-2,4,6-8,13-14H,3H2,(H,19,20)(H,21,22)(H,10,12,15)(H2,16,17,18)/t4-,6-,7-,8-/m1/s1",
        inchiKey:"PGAVKCOVUIYSFO-XVFCMESISA-N",
        SMILES:"O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O",
        chemical_formula: "C9H15N2O15P3"
*/