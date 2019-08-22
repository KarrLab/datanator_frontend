import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
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

import { Filters } from './Filters.js';
import { TaxonFilter } from '~/components/Results/Filters/TaxonFilter';
import { TanitomoFilter } from '~/components/Results/Filters/TanitomoFilter';

import { Consensus } from './Consensus.js';
import { connect } from 'react-redux';

import store from '~/data/Store';
import {
  getTotalColumns,
  filter_taxon,
  set_lineage,
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
      json_data: '',

      f_abundances: [],
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

    this.formatData = this.formatData.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAbstractInner = this.handleAbstractInner.bind(this);
  }

  formatData(data) {
    console.log(data);
    var f_abundances = [];
    if ((data != null) && (typeof(data) != "string")) {
      console.log(data)
      for (var i = 1; i < data.length; i++) {
        console.log(data[i])
        let uniprot = data[i]
        for (var n = 0; n < uniprot.abundances.length; n++){
          let row = {}
          row["abundance"] = uniprot.abundances[n].abundance
          row["organ"] = uniprot.abundances[n].organ
          row["gene_symbol"] = uniprot.gene_name
          row["organism"] = uniprot.species_name
          row["uniprot_id"] = uniprot.uniprot_id
          row["protein_name"] = uniprot.protein_name
          f_abundances.push(row)
        }


      }

      console.log(f_abundances)

      

      this.setState({
        f_abundances: f_abundances,
        //displayed_data: f_abundances
      });
      this.props.dispatch(setTotalData(f_abundances));
    } else {
      alert('Nothing Found');
    }
  }

  componentDidMount() {
    if (this.props.json_data) {
      this.formatData(this.props.json_data);
    }
  }

  componentDidUpdate(prevProps) {
    console.log('updating');
    if (this.props.json_data != prevProps.json_data) {
      console.log('not equal');
      console.log(this.props.json_data);
      this.formatData(this.props.json_data);
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

    if (!this.props.json_data || typeof(this.props.json_data) == "string") {
      return(<div></div>)
    }
    else{
      console.log("shubedubop")

    return (
      <div className="total_table">
        <div className="slider">
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
