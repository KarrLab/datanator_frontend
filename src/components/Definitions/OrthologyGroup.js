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

            dataField: 'protein_name',
            text: 'Protein',
          },

          {
            dataField: 'ec_number',
            text: 'EC Number',
          },
          
          {
            dataField: 'ko_number',
            text: 'KO Number',
          }
          ],

      total_data: []
    };
  }


  componentDidMount() {
    console.log('hello');
    let new_data= {
        protein_name:this.props.protein_name,
        ec_number:this.props.ec_number,
        ko_number:this.props.ko_number,
      }

    this.setState({total_data:[new_data]})
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
              keyField="protein_name"
              data={this.state.total_data}
              columns={this.state.total_columns}
            />
            </div>)
  }
}}


export {OrthologyGroup};
