// App.js
//import './App.css';

import React, {
	Component
} from 'react';
//import '~/../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ConcSearch from '~/components/SearchField/ConcSearch.js';
import ProtSearch from '~/components/SearchField/ProtSearch.js';

import {BrowserRouter, Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { withRouter } from "react-router";
import { Grid, Row, Col } from 'react-flexbox-grid';
//import { setNewUrl } from '~/data/actions/pageAction';

import '~/scenes/Home/HomeOld.css';



class HomeOld extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			newSearch:false,
			currentSearch: "metab",
			nextUrl:"",
		};

		this.getSearchDataProt = this.getSearchDataProt.bind(this);
		this.getNewSearchMetab = this.getNewSearchMetab.bind(this);
	}


	getSearchDataProt(url) {
		this.setState({nextUrl:url})
		this.setState({enactSearch:true})
		//this.props.dispatch(setNewUrl(url))

	}

	componentDidMount(){
		this.props.history.push("/");
	}

	getNewSearchMetab(response) {

    let url = '/metabconcs/' + response[0] + '/' + response[1];
    if (url !== this.state.new_url) {
      this.setState({ nextUrl: url });
      this.setState({ newSearch: true });
    }
  }




	render() {

	if (this.state.newSearch == true) {
      return <Redirect to={this.state.nextUrl} push />;
    }


    return (

		  
    <Grid fluid>
    	<Row center="xs">
    	<Col  xs={"100%"}>
    	{this.state.currentSearch == "metab" &&
	        <ConcSearch  handleClick={this.getNewSearchMetab} landing={true}/>
	    }
	    {this.state.currentSearch == "protein" &&
	        <ProtSearch  handleClick={this.getSearchDataProt} landing={true}/>
	    }
	        </Col>
	     </Row>
	      

		<Row center="xs" bottom="xs">
		<Col xs={4} >
		        <img src={require('~/scenes/Home/images/molecule.png')} style={{ width: '50px' }}
		     onClick={() => this.setState({currentSearch:"metab"})} />
		        <p>Metabolite Concentrations</p>

		</Col>

		<Col xs={4} >
		        <img src={require('~/scenes/Home/images/protein.png')} style={{ width: '60px' }}
		        onClick={() => this.setState({currentSearch:"protein"})} />
		        <p>Protein Concentrations</p>

		</Col>

		<Col xs={4}>
		        <img src={require('~/scenes/Home/images/reaction.png')} style={{ width: '100px' }}/>
		        <p>Reaction Kinetics</p>
		</Col>

	</Row>
	      
</Grid>


    );
  }
}

export default withRouter(HomeOld);