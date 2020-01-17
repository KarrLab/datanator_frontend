// App.js
//import './App.css';

import React, { Component } from "react";
//import '~/../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Redirect } from "react-router-dom";
import { Header } from "~/components/Layout/Header/Header";
import workflow_icons from "~/scenes/Home/images/workflow_icons.png";

import "~/scenes/Home/Home.scss";
import logo from "./logo.svg";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      newSearch: false,
      currentSearch: "metab",
      new_url: ""
    };
    this.getNewSearch = this.getNewSearch.bind(this);
  }

  getNewSearch(response) {
    let url = "/general/?q=" + response[0] + "&organism=" + response[1];
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
        <Header handleClick={this.getNewSearch} />
        <div className="content-container full-width-content-container content-container-home-scene">
          <div className="section intro">
            <div className="section-inner-container">
              <h1>
                <img src={logo} className="logo" />
                Datanator
              </h1>
              <h2>Discovering data for modeling cellular biochemistry</h2>
              <p>
                <i>Datanator</i> is a toolkit for discovering the data needed to
                build, calibrate, and validate mechanistic models of cells.{" "}
                <i>Datanator</i> is composed of an integrated database of genomic
                and biochemical data, this web application for identifying
                relevant data for modeling a specific organism in a specific
                environmental condition, and a REST API and Python library for
                programmatically discovering data for large models such as{" "}
                <a
                  href="https://www.wholecell.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  whole-cell models
                </a>
                .
              </p>
            </div>
          </div>
          <div className="section workflow">
            <div className="section-inner-container">
              <h2>Workflow</h2>
              <img className="workflow-icons" src={workflow_icons} />
            </div>
          </div>
          <div className="section about">
            <div className="section-inner-container">
              <h2>
                About <i>Datanator</i>
              </h2>
              <p>
                <i>Datanator</i> was developed by the{" "}
                <a
                  href="https://www.karrlab.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Karr Lab
                </a>{" "}
                at the Icahn School of Medicine at Mount Sinai in New York.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
