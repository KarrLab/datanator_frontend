// App.js
//import './App.css';

import React, { Component } from 'react';
//import '~/../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {H1, H2, H3, H4, H5, H6, OL, UL} from "@blueprintjs/core"


import { BrowserRouter, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import {Row, Col } from 'react-flexbox-grid';
import { Header } from '~/components/Layout/Header/Header';
import GeneralSearch from '~/components/SearchField/GeneralSearch.js';
import Grid from '@material-ui/core/Grid';
import home_logo from '~/components/Layout/Logo/home_logo.png';


import '~/scenes/Home/HomeOld.css';
class HomeOld extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      newSearch: false,
      currentSearch: 'metab',
      new_url: "",
    };
    this.getNewSearch = this.getNewSearch.bind(this);
  }


  getNewSearch(response) {
    let url = '/general/?q=' + response[0] + '&organism=' + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }

  componentDidMount() {
    //this.props.history.push('/');
  }






  render() {
    if (this.state.newSearch == true) {
      return <Redirect to={this.state.new_url} push />;
    }

    return (
      <div>
      <Header 
        handleClick={this.getNewSearch}

      />
       <div className = {"home_purpose"}>
       <div>
            <H1> Welcome to Datanator </H1>
        </div>
            <p>Datanator is a tool for discovering the data needed to build, calibrate, and validate biological models. Datanator is composed of an integrated database of experimental data for whole-cell modeling and tools for identifying relevant data for modeling a specific organism and environmental condition. Datanator has a web-based graphical interface, and a REST API.</p>
        <div>
            <H2> Workflow </H2>
        </div>

        </div>
      <div className={"home_logo"}>
        <img
      src={home_logo}
    />
    </div>
    <div className = {"home_purpose"}>
            <H2> About</H2>
            <p> Datanator was created by the Karr Lab</p>
            <H2> Whole Cell Modeling</H2>
            <p> Datantor was built for the particular usecase of Whole Cell Modeling. To learn more visit the <a href="https://www.wholecell.org"> Whole Cell Website </a></p>
        </div>

      </div>
    );
  }
}

export default HomeOld;
