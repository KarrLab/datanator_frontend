// App.js
//import './App.css';

import React, { Component } from 'react';
//import '~/../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ConcSearch from '~/components/SearchField/ConcSearch.js';
import ProtSearch from '~/components/SearchField/ProtSearch.js';
import ReactionSearch from '~/components/SearchField/ReactionSearch.js';


import { BrowserRouter, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Header } from '~/components/Layout/Header/Header';
import GeneralSearch from '~/components/SearchField/GeneralSearch.js';


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
    this.getSearchDataProt = this.getSearchDataProt.bind(this);
    this.getNewSearchMetab = this.getNewSearchMetab.bind(this);
    this.getNewSearch = this.getNewSearch.bind(this);
    this.getSearchDataReaction = this.getSearchDataReaction.bind(this);
  }

  getSearchDataProt(url) {
    this.setState({ nextUrl: url });
    console.log(url);
    this.setState({ newSearch: true });
  }
  getNewSearch(response) {
    let url = '/general/?q=' + response[0] + '&organism=' + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }

  componentDidMount() {
    this.props.history.push('/');
  }

  getNewSearchMetab(response) {
    let url = '/metabconcs/' + response[0] + '/' + response[1];
    if (url !== this.state.new_url) {
      this.setState({ nextUrl: url });
      this.setState({ newSearch: true });
    }
  }


  getSearchDataReaction(url) {
    this.setState({ nextUrl: url });
    console.log(url);
    this.setState({ newSearch: true });
  }



  render() {
    if (this.state.newSearch == true) {
      return <Redirect to={this.state.new_url} push />;
    }

    return (
      <Grid fluid>
        <style>{'body { background-color: #f7fdff; }'}</style>
        <Row center="xs">
          <Col xs={'100%'}>
            <GeneralSearch handleClick={this.getNewSearch} defaultQuery={""} defaultOrganism={""} landing={true}/>
          </Col>
        </Row>

        <Row center="xs" bottom="xs">
          <Col xs={4}>
            <img
              src={require('~/scenes/Home/images/molecule.png')}
              style={{ width: '50px' }}
              onClick={() => this.setState({ currentSearch: 'metab' })}
            />
            <p>Metabolite Concentrations</p>
          </Col>

          <Col xs={4}>
            <img
              src={require('~/scenes/Home/images/protein.png')}
              style={{ width: '60px' }}
              onClick={() => this.setState({ currentSearch: 'protein' })}
            />
            <p>Protein Concentrations</p>
          </Col>

          <Col xs={4}>
            <img
              src={require('~/scenes/Home/images/reaction.png')}
              style={{ width: '100px' }}
              onClick={() => this.setState({ currentSearch: 'reaction' })}
            />
            <p>Reaction Kinetics</p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default HomeOld;
