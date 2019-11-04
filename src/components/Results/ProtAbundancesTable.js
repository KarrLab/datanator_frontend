import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router';
import './ConcentrationsTable.css';
import { ResultsTable } from './components/ResultsTable.js';
import { TaxonFilter } from '~/components/Results/components/Filters/TaxonFilter';
import { Consensus } from './components/Consensus.js';
import { connect } from 'react-redux';

@connect(store => {
  return {
    columns: store.results.columns,
  };
})
class ProtAbundancesTable extends Component {
  static propTypes = {
    /**
     * Value to keep track of whether the JSON data has arrived
     * If this value is false, then the render should return a blank div
     */
    data_arrived: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);
  }

  render() {
    console.log('Rendering ProtAbundancesTable');

    if (!this.props.data_arrived) {
      return <div></div>;
    } else {
      return (
        <div className="total_table">
          <div className="slider">
            <img src={require('~/images/filter.png')} alt="results" />
            <TaxonFilter />
          </div>
          <div className="results">
            <div className="concTable">
              <ResultsTable
                basic_columns={[
                  'protein_name',
                  'uniprot_id',
                  'gene_symbol',
                  'abundance',
                  'organism',
                  'taxonomic_proximity',
                  'organ',
                ]}
                advanced_columns={[]}
                potential_columns={{}}
              />
            </div>
            <div className="consensus">
              <Consensus relevantColumn={'abundance'} />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(ProtAbundancesTable);
