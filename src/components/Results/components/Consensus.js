import React, { Component } from 'react';
import 'antd/dist/antd.css';
import Chart3 from './Chart3.js';
import Chart_JS from './Chart_JS.js';

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
} from '~/components/Results/components/utils.js';

import {
  Input,
  Col,
  Row,
  Select,
  InputNumber,
  DatePicker,
  AutoComplete,
  Cascade,
  Button,
  Radio,
  Statistic,
} from 'antd';

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

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
    relevantColumns: PropTypes.string.isRequired,
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

      selected_column: '',

      /** What the prompt on the consensus button should be. Initially it is 'Get Consensus'*/
      consensus_prompt: 'Get Consensus',

      buttonValue: 1,
    };
    this.setSummaryStats = this.setSummaryStats.bind(this);
    this.recordData = this.recordData.bind(this);
    this.buttonChange = this.buttonChange.bind(this);
    this.standardRound = this.standardRound.bind(this);
  }

  /**
   * Sets the summary statistics for consensus
   */
  setSummaryStats(data, selected_column) {
    console.log('Consensus: Calling setSummaryStats');
    console.log('Consensus: ' + this.props.relevantColumns[1]);
    console.log('Consensus: ' + selected_column);
    var total_conc = 0;
    let total_data = [];
    for (var i = data.length - 1; i >= 0; i--) {
      total_data.push(parseFloat(data[i][selected_column]));
      total_conc = total_conc + parseFloat(data[i][selected_column]);
    }
    total_data = total_data.filter(function(el) {
      return !isNaN(el);
    });
    var new_mean = this.standardRound(mean(total_data));
    var new_median = this.standardRound(median(total_data));
    var new_std_dev = this.standardRound(standardDeviation(total_data));
    var new_range = range(total_data);

    this.setState({
      mean: new_mean,
      median: new_median,
      std_dev: new_std_dev,
      //selected_column: selected_column,
      range:
        round(new_range[0], 3) +
        '-' +
        round(new_range[new_range.length - 1], 3),
    });
  }

  standardRound(number) {
    let rounder = null;
    if (number > 1) {
      rounder = 3;
    } else {
      rounder = 7;
    }
    return round(number, rounder);
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

  buttonChange(e) {
    console.log('Consensus: Calling buttonChange');
    var searches = ['reactants', 'reaction_id'];
    console.log('Consensus: ' + e.target.value);
    this.setSummaryStats(
      this.props.selectedData,
      this.props.relevantColumns[e.target.value - 1],
    );
    this.handleUpdate();
    this.setState({
      buttonValue: e.target.value,
      selected_column: this.props.relevantColumns[e.target.value - 1],
    });
  }

  /**
   * When mounted, this component should set summary stats
   * if the total data exists
   */
  componentDidMount() {
    console.log('Consensus: Calling componentDidMount');
    if (this.props.totalData != null) {
      this.setSummaryStats(this.props.totalData, this.props.relevantColumns[0]);
      this.setState({ selected_column: this.props.relevantColumns[0] });
    }
  }

  /**
   * If total data gets updated, then the summary stats should update too
   */
  componentDidUpdate(prevProps) {
    console.log('Consensus: Calling componentDidUpdate');
    console.log(this.props.totalData);
    console.log(this.props.selectedData);
    if (prevProps.totalData != this.props.totalData) {
      this.setSummaryStats(this.props.totalData, this.props.relevantColumns[0]);
      this.setState({ selected_column: this.props.relevantColumns[0] });
    } else if (prevProps.selectedData != this.props.selectedData) {
      console.log('Consensus: Calling blueblueblueblue');
      console.log(
        'Consensus: Calling greengreengreen' + this.state.selected_column,
      );
      this.setSummaryStats(this.props.selectedData, this.state.selected_column);
    }
  }

  render() {
    console.log('Rendering Consensus');
    if (this.props.totalData == null) {
      return <div></div>;
    } else {
      return (
        <div className="consensus_data">
          <div>
            <p>
              <b>Consensus</b>
            </p>
            <Chart_JS
              original_data={this.props.totalData}
              data={this.props.selectedData}
              relevantColumn={this.state.selected_column}
            />

            <div className="summary" style={{ marginTop: 10 }}>
              <p>
                <b>Mean: </b>
                {this.state.mean}
                <br />
                <b>Median: </b>
                {this.state.median}
                <br />
                <b>Standard Deviation: </b>
                {this.state.std_dev}
                <br />
                <b>Range: </b>
                {this.state.range}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }
}

export { Consensus };
