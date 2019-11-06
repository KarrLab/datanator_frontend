import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router';
//import './ConcentrationsTable.css';
import { ResultsTable } from './components/ResultsTable.js';
import { TaxonFilter } from '~/components/Results/components/Filters/TaxonFilter';
import { TanitomoFilter } from '~/components/Results/components/Filters/TanitomoFilter';
import { Consensus } from './components/Consensus.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ResultsPageTemplate } from '~/components/Results/ResultsPageTemplate';


@connect(store => {
  return {
    columns: store.results.columns,
  };
})

/**
 * Class putting together the components of Results to construct the 
 * correct table for metabolite concentrations
 */
class ConcentrationsTable extends Component {
  static propTypes = {
    /**
     * Value to keep track of whether the JSON data has arrived
     * If this value is false, then the render should return a blank div 
     */
    data_arrived: PropTypes.bool.isRequired,

    /**
     * Value to keep track of whether the tanitomo column should be displayed
     */
    tanitomo: PropTypes.bool.isRequired,

  };
  constructor(props) {
    super(props);
  }


  render() {
    console.log('Rendering ConcentrationsTable');

    if (!this.props.data_arrived) {
      return <div></div>;
    } else {
      return (
        <div >
          <ResultsPageTemplate
              filters = {[
                <TaxonFilter />,
                <TanitomoFilter tanitomo={this.props.tanitomo} />
                ]}
              table = {<ResultsTable
                basic_columns={[
                  'concentration',
                  'error',
                  'molecule',
                  'organism',
                  'taxonomic_proximity',
                ]}
                advanced_columns={[
                  'growth_phase',
                  'growth_conditions',
                  'growth_media',
                ]}
                potential_columns={{ tanitomo: this.props.tanitomo }}
              />}
              relevantColumns = {['concentration']}
          />
        </div>
      );
    }
  }
}

export default withRouter(ConcentrationsTable);

