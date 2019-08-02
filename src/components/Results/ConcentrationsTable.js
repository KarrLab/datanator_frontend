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
import {
  Input,
  Button,
} from 'antd';
import 'antd/dist/antd.css';
import Chart3 from './Chart3.js';
import { Slider } from 'antd';
import { withRouter } from 'react-router';

import './ConcentrationsTable.css';

import { ResultsTable, getSelectedData } from './ResultsTable.js';
//import { getTotalColumns } from './Columns2.js';


import { Filters } from './Filters.js';
import { connect } from 'react-redux';

import store from '~/data/Store'
import { getTotalColumns, filter_taxon, set_lineage } from '~/data/actions/columnAction';

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

const selectOptions = {
  'Stationary Phase': 'Stationary Phase',
  'Log Phase': 'Log Phase',
};



class Consensus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consensus: [],

      columns_mean: [
        {
          dataField: 'mean',
          text: 'Mean Concentration (µM)',
        },
        {
          dataField: 'uncertainty',
          text: 'Uncertainty (µM)',
        },
      ],
    };
    this.setMean = this.setMean.bind(this);
  }

  setMean(data) {
    var total_conc = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      console.log(data[i]);
      total_conc = total_conc + parseFloat(data[i].concentration);
    }
    var average_conc = round(total_conc / data.length, 3);
    this.setState({
      consensus: [
        {
          mean: average_conc,
        },
      ],
    });
  }

  componentDidMount() {
    this.setMean(this.props.data);
    //this.refs.taxonCol.applyFilter(28)
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    console.log(nextProps.data);
    this.setMean(nextProps.data);
  }

  render() {
    return (
      <div className="Consensus">
        <BootstrapTable
          striped
          hover
          keyField="id"
          data={this.state.consensus}
          columns={this.state.columns_mean}
        />
      </div>
    );
  }
}



@connect(store => {
  return {
    columns: store.columns.columns,

  };
})
class ConcentrationsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      asked_consensus: false,
      tanitomo: false,
      consensus_prompt: 'Get Consensus',
      json_data: '',

      test_display_columns: [],

      f_concentrations: [],

      

      advanced_columns: [
        {
          dataField: 'growth_phase',
          text: 'Growth Phase',
          formatter: cell => selectOptions[cell],
          filter: selectFilter({
            options: selectOptions,
          }),
        },
        {
          dataField: 'growth_conditions',
          text: 'Conditions',
          filter: textFilter(),
        },
        {
          dataField: 'growth_media',
          text: 'Media',
          filter: textFilter(),
        },
      ],

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
      var f_concentrations = [];

      this.props.dispatch(set_lineage(data[2][0]))

      for (var n = data[0].length; n > 0; n--) {
        if (data[0][n - 1].tanitomo_similarity < 1) {
          this.setState({ tanitomo: true });
        } else {
          this.setState({ tanitomo: false });
        }

        var concs = data[0][n - 1].concentrations;
        console.log(concs);
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (var key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (concs.hasOwnProperty(key)) {
                concs[key] = [concs[key]];
              }
            }
          }
          for (var i = concs.concentration.length - 1; i >= 0; i--) {
            var growth_phase = '';
            var organism = 'Escherichia coli';

            if (concs.growth_status[i] != null) {
              if (
                concs.growth_status[i].toLowerCase().indexOf('stationary') >= 0
              ) {
                growth_phase = 'Stationary Phase';
              } else if (
                concs.growth_status[i].toLowerCase().indexOf('log') >= 0
              ) {
                growth_phase = 'Log Phase';
              }
            }
            if ('strain' in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + ' ' + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: data[0][n - 1].name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_conditions: concs.growth_system[i],
              growth_media: concs.growth_media[i],
              taxonomic_proximity: data[0][n - 1].taxon_distance,
              tanitomo_similarity: data[0][n - 1].tanitomo_similarity,
            });
          }
        }
      }

      for (var n = data[1].length; n > 0; n--) {
        if (data[1][n - 1].tanitomo_similarity < 1) {
          this.setState({ tanitomo: true });
        }

        var concs = data[1][n - 1].concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (var key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (concs.hasOwnProperty(key)) {
                concs[key] = [concs[key]];
              }
            }
          }
          for (var i = concs.concentration.length - 1; i >= 0; i--) {
            var growth_phase = '';
            var organism = data[1][n - 1].species;
            if ('strain' in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + ' ' + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: data[1][n - 1].name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_media: concs.growth_media[i],
              taxonomic_proximity: data[1][n - 1].taxon_distance,
              tanitomo_similarity: data[1][n - 1].tanitomo_similarity,
            });
          }
        }
      }

      this.setState({
        f_concentrations: f_concentrations,
        //displayed_data: f_concentrations
      });
    } else {
      alert('Nothing Found');
    }
  }



  componentDidMount() {
    if (this.props.json_data) {
      this.formatData(this.props.json_data);
    }
    console.log("watermellon")

    //this.props.dispatch(getTotalColumns(["concentration", "error", "molecule", "organism", "taxonomic_proximity"]));
    console.log("watermellon2")
    console.log(this.props.columns)
    //this.props.dispatch(filter_taxon(3))

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
    let display_columns = this.state.columns;

    if (this.state.tanitomo) {
      console.log('tanitomo!');
      display_columns = display_columns.concat(this.state.tanitomo_column);
    }

    //get the data for the consensus module
    let selected_data = getSelectedData();

    let test_columns = [
      {
        dataField: 'concentration',
        text: 'Conc. (µM)',
      },

      {
        dataField: 'error',
        text: 'Error',
      },
       {
        dataField: 'name',
        text: 'Molecule',
        filter: textFilter(),
      },
       {
        dataField: 'organism',
        text: 'Organism',
        filter: textFilter(),
      },


    ];


    console.log(test_columns)
    console.log(this.props.columns)
    console.log("AGAIN!!")


    return (

      <div className="total_table">
        <div className="slider">
        <Filters />
        {/*
          <Columns
            desired_columns = {["concentration", "error", "molecule"]}
            setColumns = {final_columns => {this.setState({test_display_columns: final_columns}); console.log(this.state.test_display_columns)}}
          />
        */}
        </div>
        <div className="results">
          <div className="concTable">
             
            <ResultsTable
              data={this.state.f_concentrations}
              basic_columns={["concentration", "error", "molecule", "organism", "taxonomic_proximity","growth_media"]}
              advanced_columns={["growth_phase", "growth_conditions"]}
            />



          </div>
          <div className="consensus">
            <img src={require('~/images/consensus.png')} />
            <Button type="primary" onClick={event => this.handleUpdate()}>
              {' '}
              {this.state.consensus_prompt}{' '}
            </Button>
            {this.state.asked_consensus && <Consensus data={selected_data} />}
            <br />
            {this.state.asked_consensus && (
              <Chart3
                original_data={this.state.f_concentrations}
                data={selected_data}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ConcentrationsTable);
