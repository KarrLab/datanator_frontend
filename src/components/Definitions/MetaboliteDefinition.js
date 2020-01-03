// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReactDOM from 'react-dom';

//import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

import { Link, Redirect } from 'react-router-dom';

import { PropTypes } from 'react';
import Typography from '@material-ui/core/Typography';

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

class MetaboliteDefinition extends Component {
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
    let metaboliteMetadata = this.props.metaboliteMetadata

    if (metaboliteMetadata.length == 0){
      return(<div></div>)
    }


    if (this.props.abstract=='true'){

      let names = ""
      for (var i = metaboliteMetadata.length - 1; i >= 0; i--) {
        names = names + metaboliteMetadata[i].name + ", "
      }

      let descriptions = []
      for (var i = metaboliteMetadata.length - 1; i >= 0; i--) {
        descriptions.push(
        <div  className="metadata_description_abstract" >
            <p><b>Name:</b> {metaboliteMetadata[i].name}</p>
            <p><b>Chemical Formula:</b> {metaboliteMetadata[i].chemical_formula}</p>
      </div>)
      }


      return(
      <div
        className="metabolite_definition_data"
      >

      <Typography variant="h6" className={'green'}>
        {"Molecules Similar to " + this.props.molecule}
      </Typography>

      <div
        className="photo_and_description"
      >
      {descriptions}

      </div>

      </div>
      )
    }





    console.log(metaboliteMetadata)
    console.log(metaboliteMetadata[0])
    metaboliteMetadata = metaboliteMetadata[0]

    return (
      <div
        className="metabolite_definition_data"
      >

      <Typography variant="h6" className={'green'}>
        {metaboliteMetadata.name}
      </Typography>

      <div
        className="photo_and_description"
      >

        <div  className="vertical_center" >
            <img
              border="0"
              alt="W3Schools"
              src={"https://www.ebi.ac.uk/chebi/displayImage.do;jsessionid=25AAC07D77FBB12EBEFA4D5FEE270CD4?defaultImage=true&imageIndex=0&chebiId=" + metaboliteMetadata.chebi_id}
              width="200"
              height="200"
            ></img>
        </div>

        <div  className="metadata_description" >
            <p><b>Name:</b> {metaboliteMetadata.name}</p>
            <p><b>Chemical Formula:</b> {metaboliteMetadata.chemical_formula}</p>
            <div style={{"overflow-wrap": "break-word"}}><p><b>InChI:</b> <font size="2">{metaboliteMetadata.inchi}</font></p></div>
            <p><b>InChIKey:</b> {metaboliteMetadata.inchiKey}</p>

      </div>
      </div>

      </div>
    );
  }
}

export { MetaboliteDefinition };

/*
inchi:"InChI=1S/C9H15N2O15P3/c12-5-1-2-11(9(15)10-5)8-7(14)6(13)4(24-8)3-23-28(19,20)26-29(21,22)25-27(16,17)18/h1-2,4,6-8,13-14H,3H2,(H,19,20)(H,21,22)(H,10,12,15)(H2,16,17,18)/t4-,6-,7-,8-/m1/s1",
        inchiKey:"PGAVKCOVUIYSFO-XVFCMESISA-N",
        SMILES:"O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O",
        chemical_formula: "C9H15N2O15P3"
*/