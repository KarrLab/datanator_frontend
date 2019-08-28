// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
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
} from 'antd';
import 'antd/dist/antd.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

import './OrthologyGroup.css';
import {Link, Redirect } from 'react-router-dom'

import { PropTypes } from 'react';


const products = [{id:"3", name:"bob"}];
const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];







class OrthologyGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_columns:  [
      {
            dataField: 'uniprot',
            text: 'Uniprot ID',
            formatter :this.colFormatter,

          },
      

          {

            dataField: 'protein_name',
            text: 'Protein',
          },

          {
            dataField: 'gene_name',
            text: 'Gene Name',
          },
        
          
          ],

      total_data: []
    };
    this.colFormatter = this.colFormatter.bind(this);
  }


  componentDidMount() {
    console.log('hello');

    this.setState({total_data:this.props.proteinMetadata})
  }

  componentDidUpdate(prevProps) {
    console.log('hello');

    if (this.props.proteinMetadata !== prevProps.proteinMetadata){
      this.setState({total_data:this.props.proteinMetadata})
    }

  }

  colFormatter = (cell, row) => {
    console.log(cell)
    if (cell){
      console.log("grumble")
    let url = "/protein/uniprot/" + cell
    return (
      <Link to={url}>
        {cell.toString()}
      </Link>
    )
    }
    else{
      return(<div></div>)
    }

  }


  render() {
    console.log(this.state.total_data)
    console.log("man on the moon")


    if (!this.state.total_data){
      return(<div>asjasfd;jklasfd;jkla;jklsfd</div>)
    }
    else{
          return(<div className="bootstrap">
<BootstrapTable

              striped
              hover
              keyField="uniprot"
              data={this.state.total_data}
              columns={this.state.total_columns}
            />
            </div>)
  }
}}


export {OrthologyGroup};
