import React, { Component } from 'react';
import { Button, Row, Col, Statistic } from 'antd';
import 'antd/dist/antd.css';
import Chart3 from './Chart3.js';
import PropTypes from 'prop-types';
import DownloadLink from 'react-download-link';
import './Consensus.css';
import { connect } from 'react-redux';
import { refreshSelectedData } from '~/data/actions/resultsAction';
import {
  mean,
  median,
  range,
  standardDeviation,
  round,
  JSONToCSVConvertor,
} from '~/components/Results/utils.js';

/**
 * Class to render the Consensus of results, and the save the total data to CSV file
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
    /**
     * REDUX: this is a list of rows of all the selected data. This is used to generate consensus
     * only of the displayed data
     */
    selectedData: PropTypes.array.isRequired,

    /**
     * REDUX: This is a list of all the data. This is recorded in the CSV file
     */
    totalData: PropTypes.array.isRequired,

    /**
     * This prop tells the consensus what column contains the values that need to be summarized.
     * For example, in metabolite concentrations, we want the summarize the value of "concentration",
     * so we need to tell the compomenet to look for the column labeled "concentration"
     */
    relevantColumn: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      /**The mean of the selected data*/
      mean: null,

      /**The median of the selected data*/
      median: null,

      /**The standard deviation of the selected data*/
      std_dev: null,

      /**The IQR of the selected data*/
      iqr: null,

      /**The range of the selected data*/
      range: null,

      /**Whether the user asked for the consensus again*/
      asked_consensus: false,

      /** What the prompt on the consensus button should be. Initially it is 'Get Consensus'*/
      consensus_prompt: 'Get Consensus',
    };
    this.setSummaryStats = this.setSummaryStats.bind(this);
    this.recordData = this.recordData.bind(this);
  }

  /**
   * Sets the summary statistics for consensus
   */
  setSummaryStats(data) {
    console.log('Consensus: Calling setSummaryStats');
    var total_conc = 0;
    let total_data = [];
    for (var i = data.length - 1; i >= 0; i--) {
      total_data.push(parseFloat(data[i][this.props.relevantColumn]));
      total_conc = total_conc + parseFloat(data[i][this.props.relevantColumn]);
    }
    var new_mean = round(mean(total_data), 3);
    var new_median = round(median(total_data), 3);
    var new_std_dev = round(standardDeviation(total_data), 3);
    var new_range = range(total_data);

    this.setState({
      mean: new_mean,
      median: new_median,
      std_dev: new_std_dev,
      range:
        round(new_range[0], 3) +
        '-' +
        round(new_range[new_range.length - 1], 3),
    });
  }

  /**
   * Gets a CSV version of the table rows to then be returned as a CSV file
   */
  recordData() {
    console.log('Consensus: Calling recordData');
    return JSONToCSVConvertor(JSON.stringify(this.props.totalData));
  }

  /**
   * When the 'Get Consensus' button is pushed, the state should know
   * the user asked for consensus, and it should update the button display
   * to 'Update Consensus'
   */
  handleUpdate() {
    console.log('Consensus: Calling handleUpdate');
    this.setState({
      asked_consensus: true,
      consensus_prompt: 'Update Consensus',
    });
    this.props.dispatch(refreshSelectedData());
  }

  /**
   * When mounted, this component should set summary stats
   * if the total data exists
   */
  componentDidMount() {
    console.log('Consensus: Calling componentDidMount');
    if (this.props.totalData != null) {
      this.setSummaryStats(this.props.totalData);
    }
  }

  /**
   * If total data gets updated, then the summary stats should update too
   */
  componentDidUpdate(prevProps) {
    console.log('Consensus: Calling componentDidUpdate');
    if (prevProps.totalData != this.props.totalData) {
      this.setSummaryStats(this.props.totalData);
    } else if (prevProps.selectedData != this.props.selectedData) {
      this.setSummaryStats(this.props.selectedData);
    }
  }

  render() {
    console.log('Rendering Consensus');
    return (
      <div className="consensus_data">
        <img src={require('~/images/consensus.png')} />
        <Button type="primary" onClick={event => this.handleUpdate()}>
          {' '}
          {this.state.consensus_prompt}{' '}
        </Button>
        <DownloadLink filename="Data.csv" exportFile={() => this.recordData()}>
          Save to disk
        </DownloadLink>
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
