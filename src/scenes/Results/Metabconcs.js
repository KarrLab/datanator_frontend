// App.js

import React, {
	Component
} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import filterFactory, {
	textFilter,
	selectFilter
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
	Button
} from 'antd';
import 'antd/dist/antd.css';
import ConcentrationsTable from '~/components/Results/ConcentrationsTable.js';
import ConcSearch from '~/components/SearchField/ConcSearch.js';
import { PropTypes } from 'react'
import {BrowserRouter, Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { withRouter } from "react-router";


import './MetabConcs.css';

import { getSearchData } from '~/services/MongoApi';





const jsonfile = require('jsonfile')


class MetabConcs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			organism: '',
			dataSource: [],
			orig_json: null,
			newSearch:false,
			abstract_search:false,
			newRedirect:"",
			

		};

		this.getNewSearch = this.getNewSearch.bind(this)
		this.getAbstractSearch = this.getAbstractSearch.bind(this)
		var url = "http://localhost:5000/results/" + this.props.match.params.molecule + "/" + this.props.match.params.organism


	}
	componentDidMount(){
		var info = [this.props.match.params.molecule, this.props.match.params.organism, this.props.match.params.abstract]
		console.log("hello")
		this.setState({
			abstract_search:this.props.match.params.abstract
		})
		this.getSearchData(info)
	}


	componentDidUpdate (prevProps) {
    // respond to parameter change in scenario 3
    	if ((this.props.match.params.molecule != prevProps.match.params.molecule) || (this.props.match.params.organism != prevProps.match.params.organism) || (this.props.match.params.abstract != prevProps.match.params.abstract)){
		    var info = [this.props.match.params.molecule, this.props.match.params.organism, this.props.match.params.abstract]
			this.getSearchData()
		}

	 }



	getSearchData() {
		//var url = "http://api.datanator.info/results/" + this.props.match.params.molecule + "/" + this.props.match.params.organism + "/" + this.props.match.params.abstract
		//let response = null
		//getSearchData(["concentration", this.props.match.params.molecule, this.props.match.params.organism, this.props.match.params.abstract])
		getSearchData(["concentration", this.props.match.params.molecule, this.props.match.params.organism])
		.then(response => {this.setState({orig_json: response.data})} )


		/*

		console.log(url)

		console.log("worked!!")
		console.log(url)


		axios.get(url)
			.then(response => {
					const data = response.data;
					this.setState({
					orig_json: data
				},)
			}, )
			.catch(error => alert("Nothing Found"));

		*/

	}

	getNewSearch(url){
		console.log(url)
		url = url+"/False"
		this.setState({newSearch:true,
			newRedirect:url,
		})

	}

	getAbstractSearch(){
		//this.setState({abstract_search:true,})
		this.setState({newSearch:true,
			newRedirect: "/metabconcs/" + this.props.match.params.molecule + "/" + this.props.match.params.organism + "/True",
		})
	}


	setMean(data) {
		var total_conc = 0
		for (var i = data.length - 1; i >= 0; i--){
			total_conc = total_conc + parseFloat(data[i].concentration)
		}
		var average_conc = total_conc/data.length;
		this.setState({consensus : [{
			mean:average_conc
		}]})

	}




	handleUpdate() {
		this.setMean(this.node.table.props.data)
	};



	render() {

	//if (this.state.toMetabConc == true) {
    //  return <BrowserRouter><Redirect to='/dashboard' /></BrowserRouter>
    //}
    if (this.state.newSearch === true) {
    	this.setState({newSearch:false})
		console.log("routing")
		var url = this.state.newRedirect
		console.log(this.state.newRedirect)
		console.log("above")
		console.log(url)
      return <Redirect to={url}/>
    }



    const Search = Input.Search;
    let styles = {
    marginTop: 50,

   
  };
  console.log(this.props.match.params.molecule)
    	console.log(this.props.match.params.organism)
    return (


    <div className="container" style={ styles }>
    	<style>{'body { background-color: #f7fdff; }'}</style>
	      <div className="search">
	        <ConcSearch  handleClick={this.getNewSearch} landing={false} defaultMolecule={this.props.match.params.molecule} defaultOrganism={this.props.match.params.organism}/>
	      </div>
	      <br/>
	      <br/>
	      <div className="results">
	      {this.state.orig_json &&
			    <ConcentrationsTable json_data={ this.state.orig_json } handleAbstract={this.getAbstractSearch}/>
	      }
		  </div>
      </div>


    );
  }
}

export default withRouter(MetabConcs);