import React, { Component } from 'react';
//import 'antd/dist/antd.css';
import { withRouter } from 'react-router';
import { ResultsTable } from './components/ResultsTable.js';
import { TaxonFilter } from '~/components/Results/components/Filters/TaxonFilter';
import { TanitomoFilter } from '~/components/Results/components/Filters/TanitomoFilter';
import { Consensus } from './components/Consensus.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import './ResultsPageTemplate.css';





class ResultsPageTemplate extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log('Rendering ConcentrationsTable');

      return (
        <div className="total_table">
          <div className="slider">
            <img src={require('~/images/filter.png')} alt="results" />
            {this.props.filters}
          </div>
          <div className="table_and_consensus">
            <div className="results_table">
            {this.props.table}
            </div>
            <div className="consensus">
              <Consensus 
              relevantColumns={this.props.relevantColumns} 
              optional_columns = {this.props.optional_columns}
              />
            </div>
          </div>
        </div>
      );
    
  }
}

export {ResultsPageTemplate};








