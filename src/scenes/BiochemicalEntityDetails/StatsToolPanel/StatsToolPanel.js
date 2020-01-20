import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MeasurementsBoxScatterPlot from "../MeasurementsBoxScatterPlot/MeasurementsBoxScatterPlot";
import { mean, median, std } from 'mathjs';
import {
  range,
  roundToDecimal,
  jsonToCsv
} from "~/utils/utils";

import "./StatsToolPanel.scss";

/**
 * Class to render the Consensus of results, and the save the total data to CSV file
 * This class takes the data from the store, and summarizes the data with mean, median, range, standard deviation, and a chart at bottom.
 * This class mostly handles the rendering, while the logic is handled elsewhere
 */

@connect(store => {
  return {
    selectedData: store.results.selectedData,
    totalData: store.results.totalData
  };
})
class StatsToolPanel extends Component {
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
    relevantColumns: PropTypes.string.isRequired
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

      selected_column: "",

      /** What the prompt on the consensus button should be. Initially it is 'Get Consensus'*/
      consensus_prompt: "Get Consensus",

      buttonValue: 1
    };
    this.setSummaryStats = this.setSummaryStats.bind(this);
    this.recordData = this.recordData.bind(this);
    this.standardRound = this.standardRound.bind(this);
  }

  /**
   * Sets the summary statistics for consensus
   */
  setSummaryStats(data, selected_column) {
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
    var new_std_dev = this.standardRound(std(total_data));
    var new_range = range(total_data);

    this.setState({
      mean: new_mean,
      median: new_median,
      std_dev: new_std_dev,
      //selected_column: selected_column,
      range:
        roundToDecimal(new_range[0], 3) + "-" + roundToDecimal(new_range[new_range.length - 1], 3)
    });
  }

  standardRound(number) {
    let rounder = null;
    if (number > 1) {
      rounder = 3;
    } else {
      rounder = 7;
    }
    return roundToDecimal(number, rounder);
  }

  /**
   * Gets a CSV version of the table rows to then be returned as a CSV file
   */
  recordData() {
    return jsonToCsv(JSON.stringify(this.props.totalData));
  }

  /**
   * When mounted, this component should set summary stats
   * if the total data exists
   */
  componentDidMount() {
    if (this.props.totalData != null) {
      this.setSummaryStats(this.props.totalData, this.props.relevantColumns[0]);
      this.setState({ selected_column: this.props.relevantColumns[0] });
    }
  }

  /**
   * If total data gets updated, then the summary stats should update too
   */
  componentDidUpdate(prevProps) {
    if (prevProps.totalData !== this.props.totalData) {
      this.setSummaryStats(this.props.totalData, this.props.relevantColumns[0]);
      this.setState({ selected_column: this.props.relevantColumns[0] });
    } else if (prevProps.selectedData !== this.props.selectedData) {
      if (this.props.selectedData.length === 0) {
        this.setSummaryStats(
          this.props.totalData,
          this.props.relevantColumns[0]
        );
      } else {
        this.setSummaryStats(
          this.props.selectedData,
          this.state.selected_column
        );
      }
    }
  }

  render() {
    if (this.props.totalData == null) {
      return <div></div>;
    } else {
      return (
        <div className="consensus_data">
          <div>
            <p>
              <b>Concentrations</b>
            </p>

            <MeasurementsBoxScatterPlot
              allMeasurements={this.props.totalData}
              selectedMeasurements={this.props.selectedData}
              dataProperty={this.state.selected_column}
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

export { StatsToolPanel };
