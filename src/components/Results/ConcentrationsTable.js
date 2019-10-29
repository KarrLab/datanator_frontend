import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router';
import './ConcentrationsTable.css';
import { ResultsTable } from './ResultsTable.js';
import { TaxonFilter } from '~/components/Results/Filters/TaxonFilter';
import { TanitomoFilter } from '~/components/Results/Filters/TanitomoFilter';
import { Consensus } from './Consensus.js';
import { connect } from 'react-redux';

@connect(store => {
  return {
    columns: store.results.columns,
  };
})
class ConcentrationsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      asked_consensus: false,
      tanitomo: false,
      f_concentrations: [],
    };
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate() {
    this.setState({
      asked_consensus: true,
      consensus_prompt: 'Update Consensus',
    });
  }

  render() {
    console.log('Rendering ConcentrationsTable');

    if (!this.props.data_arrived) {
      return <div></div>;
    } else {
      return (
        <div className="total_table">
          <div className="slider">
            <TaxonFilter />
            <TanitomoFilter tanitomo={this.props.tanitomo} />
          </div>
          <div className="results">
            <div className="concTable">
              <ResultsTable
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
              />
            </div>
            <div className="consensus">
              <Consensus relevantColumn={'concentration'} />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(ConcentrationsTable);
