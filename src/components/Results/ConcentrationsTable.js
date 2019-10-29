import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
//import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
import ReactDOM from 'react-dom';
import { Input, Button } from 'antd';
import 'antd/dist/antd.css';
import Chart3 from './Chart3.js';
import { Slider } from 'antd';
import { withRouter } from 'react-router';

import './ConcentrationsTable.css';

import { ResultsTable, getSelectedData } from './ResultsTable.js';
//import { getTotalColumns } from './Columns2.js';

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
    //this.props.dispatch(filter_taxon(3))
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
