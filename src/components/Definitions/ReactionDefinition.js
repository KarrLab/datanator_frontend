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
//import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

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







class ReactionDefinition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_columns:  [
      {
            dataField: 'reactionID',
            text: 'Reaction ID',

          },

          {
            dataField: 'equation',
            text: 'Reaction Equation',
            formatter :this.colFormatter,
          },
        
          
          ],

      total_data: []
    };
    this.colFormatter = this.colFormatter.bind(this);
  }


  componentDidMount() {
    console.log('hello');

    this.setState({total_data:this.props.reactionMetadata})
  }

  componentDidUpdate(prevProps) {
    console.log('hello');

    if (this.props.reactionMetadata !== prevProps.reactionMetadata){
      this.setState({total_data:this.props.reactionMetadata})
    }

  }

  colFormatter = (cell, row) => {
    if (cell){
      console.log(cell[1])
    let url = "/reaction/data/?substrates=" + cell[1]['sub_inchis'] + "&?products=" + cell[1]['prod_inchis']

    return (
      <Link  to={url}>
        {cell[0].toString()}
      </Link>
    )
    }
    else{
      return(<div></div>)
    }

  }


  partFormatter = (cell, row) => {
    let participants = ""
    if (cell){
      for (var i = cell.length - 1; i >= 0; i--) {
        participants = participants + cell[i] + " + "
      }
      participants = participants.substring(0,participants.length-3)
    return (

      <div>
        {participants}
      </div>
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
      return(<div></div>)
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






export {ReactionDefinition};
