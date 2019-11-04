import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
//import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, {
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router';

import './ConcentrationsTable.css';

import { ResultsTable, getSelectedData } from './components/ResultsTable.js';
//import { getTotalColumns } from './Columns2.js';

import { TaxonFilter } from '~/components/Results/components/Filters/TaxonFilter';

import { Consensus } from './components/Consensus.js';
import { connect } from 'react-redux';

import {
  filter_taxon,
  setTotalData,
} from '~/data/actions/resultsAction';

@connect(store => {
  return {
    columns: store.results.columns,
    //selectedData: store.results.selectedData
  };
})
class ProtAbundancesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      asked_consensus: false,
      tanitomo: false,
      consensus_prompt: 'Get Consensus',
      tanitomo_column: [
        {
          dataField: 'tanitomo_similarity',
          text: 'Tanitomo Score',
          headerStyle: (colum, colIndex) => {
            return { width: '20px', textAlign: 'left' };
          },
          filter: numberFilter({
            placeholder: 'custom placeholder',
            defaultValue: { comparator: Comparator.GE, number: 0.5 }, //ref:this.node,
            getFilter: filter => (this.tanitomo_filter = filter),
          }),
        },
      ],
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAbstractInner = this.handleAbstractInner.bind(this);
  }


  componentDidMount() {
    if (this.props.f_abundances) {
      this.props.dispatch(setTotalData(this.props.f_abundances));
    }
  }

  componentDidUpdate(prevProps) {
    console.log('updating');
    if (this.props.f_abundances != prevProps.f_abundances) {
      if (this.props.f_abundances) {
      this.props.dispatch(setTotalData(this.props.f_abundances));
    }
    }
  }

  handleUpdate() {
    this.setState({
      asked_consensus: true,
      consensus_prompt: 'Update Consensus',
    });
    //this.props.dispatch(filter_taxon(3))
  }

  handleSlider(value) {
    console.log('onChange: ', value);
    //this.filter_taxon;
  }

  handleAbstractInner() {
    this.props.handleAbstract();
  }

  render() {
    let basic_columns
    console.log("Rendering ProtAbundancesTable")
    console.log(this.props.f_abundances)
    console.log(!this.props.f_abundances)

    if (!this.props.f_abundances || typeof(this.props.f_abundances) == "string") {
      return(<div></div>)
    }
    else{
      console.log("shubedubop")

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
              advanced_columns={[
              ]}
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
