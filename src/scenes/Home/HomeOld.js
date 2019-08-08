// App.js
//import './App.css';

import React, {
	Component
} from 'react';
//import '~/../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import ConcSearch from '~/components/SearchField/ConcSearch.js';
import { PropTypes } from 'react'
import {BrowserRouter, Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { withRouter } from "react-router";
import { Grid, Row, Col } from 'react-flexbox-grid';

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

	componentDidMount(){
		this.props.history.push("/");
	}




	render() {

	if (this.state.enactSearch === true) {
		console.log("routing!!!")
		console.log(this.state.nextUrl)
      return <Redirect to={this.state.nextUrl}/>
    }


    return (

		  
    <div className="container" >
    <Grid fluid>
    	<Row center="xs">
    	<style>{'body { background-color: #f7fdff; }'}</style>
	      <div className="search">
	        <ConcSearch  handleClick={this.getSearchData} landing={true}/>
	      </div>
	      </Row>
	      <div className="menu">
	    
		<Row center="xs">
		<Col xs={6}>
		        <img src={require('~/scenes/Home/images/molecule.png')} style={{ width: '10%' }}/>
		        <p>Metabolite Concentrations</p>

		</Col>

		<Col xs={6}>
		        <img src={require('~/scenes/Home/images/reaction.png')} style={{ width: '20%' }}/>
		        <p>Reaction Kinetics</p>
		</Col>

	</Row>
	      </div>
	      
</Grid>

      </div>

    );
  }
}

export default withRouter(HomeOld);