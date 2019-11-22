import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router';
//import './ConcentrationsTable.css';
import { ResultsTable } from './components/ResultsTable.js';
import { TaxonFilter } from '~/components/Results/components/Filters/TaxonFilter';
import { Consensus } from './components/Consensus.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ResultsPageTemplate } from '~/components/Results/ResultsPageTemplate';



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
        <div >
          <ResultsPageTemplate
              filters = {[
                <TaxonFilter />
                ]}
              table = {<ResultsTable
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
              />}
              relevantColumns = {['abundance']}
          />
        </div>
      );
    }
  }
}

export default withRouter(ProtAbundancesTable);
