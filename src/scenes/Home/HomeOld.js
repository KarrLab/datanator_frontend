// App.js
//import './App.css';

import React, {
	Component
} from 'react';
import '~/../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import ConcSearch from '~/components/SearchField/ConcSearch.js';
import { PropTypes } from 'react'
import {BrowserRouter, Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { withRouter } from "react-router";
import '~/scenes/Home/HomeOld.css';



class HomeOld extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			orig_json: null,
			enactSearch:false,
			nextUrl:"",
		};

		this.getSearchData = this.getSearchData.bind(this);
	}


	getSearchData(url) {
		this.setState({nextUrl:url})
		this.setState({enactSearch:true})

	}



	render() {

	if (this.state.enactSearch === true) {
		console.log("routing!!!")
		console.log(this.state.nextUrl)
      return <Redirect to={this.state.nextUrl}/>
    }


    return (

		  
    <div className="container" >
    	<style>{'body { background-color: #f7fdff; }'}</style>
	      <div className="search">
	        <ConcSearch  handleClick={this.getSearchData} landing={true}/>
	      </div>

	      <div className="menu">

	      	<div className="molecule">
		        <img src={require('~/scenes/Home/images/molecule.png')} style={{ width: '5%' }}/>
		        <p>Metabolite Concentrations</p>

		    </div>
		    <div className="reaction">
		        <img src={require('~/scenes/Home/images/reaction.png')} style={{ width: '40%' }}/>
		        <p>Reaction Kinetics</p>
		    </div>
	      </div>


      </div>

    );
  }
}

export {HomeOld};