import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
import ReactDOM from 'react-dom';
import { Input, Button, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import Chart3 from './Chart3.js';
import { Slider, Statistic } from 'antd';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import './Consensus.css';

import { ResultsTable, getSelectedData } from './ResultsTable.js';
//import { getTotalColumns } from './Columns2.js';

import { Filters } from './Filters.js';
import { connect } from 'react-redux';

import store from '~/data/Store';
import {
  getTotalColumns,
  filter_taxon,
  set_lineage,
  refreshSelectedData,
} from '~/data/actions/resultsAction';
import {
  mean,
  median,
  mode,
  range,
  standardDeviation,
} from '~/components/Results/mathTools.js';
function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}



/**
 * Class to render the Consensus of results. 
 * This class takes the data from the store, and summarizes the data with mean, median, range, standard deviation, and a chart at bottom. 
 * This class mostly handles the rendering, while the logic is handled elsewhere
 */


@connect(store => {
  return {
    selectedData: store.results.selectedData,
    totalData: store.results.totalData,
  };
})
class Consensus extends Component {

  static propTypes = {
    /** This prop tells the consensus what column contains the values that need to be summarized. 
     * Fo example, in metabolite concentrations, we want the summarize the value of "concentration",
     * so we need to tell the compomenet to look for the column labeled "concentration"
     */
    relevantColumn: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      consensus: [],
      mean: null,
      median: null,
      std_dev: null,
      iqr: null,
      range: null,
      asked_consensus: false,
      consensus_prompt: 'Get Consensus',
    };
    this.setMean = this.setMean.bind(this);
  }

  setMean(data) {
    var total_conc = 0;
    let total_data = [];
    for (var i = data.length - 1; i >= 0; i--) {

      total_data.push(parseFloat(data[i][this.props.relevantColumn]));
      total_conc = total_conc + parseFloat(data[i][this.props.relevantColumn]);
    }
    var average_conc = round(total_conc / data.length, 3);
    var new_mean = round(mean(total_data), 3);
    var new_median = round(median(total_data), 3);
    var new_std_dev = round(standardDeviation(total_data), 3);
    var new_range = range(total_data);
    //var new_median = round(median(total_data), 3)
    this.setState({
      mean: new_mean,
      median: new_median,
      std_dev: new_std_dev,
      range: round(new_range[0], 3) + '-' + round(new_range[1], 3),
    });
  }

  handleUpdate() {
    this.setState({
      asked_consensus: true,
      consensus_prompt: 'Update Consensus',
    });
    this.props.dispatch(refreshSelectedData());
  }

  componentDidMount() {
    if (this.props.totalData != null) {
      this.setMean(this.props.totalData);
    }
    //this.setMean(this.props.totalData);
    //this.refs.taxonCol.applyFilter(28)
  }

  componentDidUpdate(prevProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    //this.props.dispatch(refreshSelectedData())
    console.log('majorian');
    if (prevProps.totalData != this.props.totalData) {
      this.setMean(this.props.totalData);
    } else if (prevProps.selectedData != this.props.selectedData) {
      this.setMean(this.props.selectedData);
    }
  }

  render() {
    console.log('again');
    return (
      <div className="consensus_data">
        <img src={require('~/images/consensus.png')} />
        <Button type="primary" onClick={event => this.handleUpdate()}>
          {' '}
          {this.state.consensus_prompt}{' '}
        </Button>

        {this.state.asked_consensus && (
          <div className="summary">
            <Row>
              <Col span={22}>
                <Statistic title="Mean" value={this.state.mean} />
              </Col>
              <Col span={2}>
                <Statistic title="Median" value={this.state.median} />
              </Col>
            </Row>
            <Row>
              <Col span={15}>
                <Statistic
                  title="Standard Deviation"
                  value={this.state.std_dev}
                />
              </Col>
              <Col span={2}>
                <Statistic title="Range" value={this.state.range} />
              </Col>
            </Row>
          </div>
        )}
        <br />
        {this.state.asked_consensus && (
          <Chart3
            original_data={this.props.totalData}
            data={this.props.selectedData}
            relevantColumn={this.props.relevantColumn}
          />
        )}
      </div>
    );
  }
}

export { Consensus };
