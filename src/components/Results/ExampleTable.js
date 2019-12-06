import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router';
import { ResultsTable } from './components/ResultsTable.js';
import { TaxonFilter } from '~/components/Results/components/Filters/TaxonFilter';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ResultsPageTemplate } from '~/components/Results/ResultsPageTemplate';

@connect(store => {
  return {
    columns: store.results.columns,
  };
})
class ExampleTable extends Component {
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
    if (!this.props.data_arrived) {
      return (
        <div>
          <p>
            Nothing Found. Either our database has no data, or we have it
            recoreded under a different name
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <ResultsPageTemplate
            filters={[<TaxonFilter />]}
            table={
              <ResultsTable
                basic_columns={['molecule', 'concentration', 'abundance', 'gene_symbol']}
                advanced_columns={[]}
                potential_columns={{}}
              />
            }
            relevantColumns={['concentration', 'abundance']}
          />
        </div>
      );
    }
  }
}

export default withRouter(ExampleTable);
