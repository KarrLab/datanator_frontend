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
    if (data != null) {
      console.log(data)
      var f_abundances = [];
      let genetic_identifiers = "gene_name: "+ data["gene_name"] + "           \n" +
      "          protein_name: "+ data["protein_name"] + "\n" + "uniprot_id: "+ data["uniprot_id"]

      this.props.dispatch(set_lineage(["a", "b", "c"]));
      f_abundances["abundance"] = data["abundance"]
      f_abundances["organism"] = data["organism"]
      f_abundances["organ"] = data["organ"]
      f_abundances["taxonomic_proximity"] = data["taxonomic_proximity"]
      f_abundances["gene_symbol"] = data["gene_name"]
      f_abundances["protein_name"] = data["protein_name"]
      f_abundances["uniprot_id"] = data["uniprot_id"]
      //f_abundances["organism"] = data["organism"]

      

      this.setState({
        f_abundances: [f_abundances],
        //displayed_data: f_abundances
      });
      this.props.dispatch(setTotalData([f_abundances]));
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

    if (!this.props.json_data) {
      return(<div></div>)
    }
    else{

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
            <Consensus relevantColumn={'concentration'} />
          </div>
        </div>
      </div>
    );
  }
  }
}

export default withRouter(ProtAbundancesTable);
