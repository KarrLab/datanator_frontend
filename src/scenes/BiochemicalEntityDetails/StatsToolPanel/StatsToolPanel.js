import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MeasurementsBoxScatterPlot from "../MeasurementsBoxScatterPlot/MeasurementsBoxScatterPlot";
import { mean, median, std } from "mathjs";
import { range, roundToDecimal } from "~/utils/utils";
import { AgGridReact } from "@ag-grid-community/react";

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
    selectedData: PropTypes.array,

    /**
     * REDUX: This is a list of all the data. This is recorded in the CSV file
     */
    totalData: PropTypes.array.isRequired,

    /**
     * This prop tells the consensus what column contains the values that need to be summarized.
     * For example, in metabolite concentrations, we want the summarize the value of "concentration",
     * so we need to tell the compomenet to look for the column labeled "concentration"
     */
    "relevant-column": PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      /**The mean of the total data*/
      total_mean: null,

      /**The median of the total data*/
      total_median: null,

      /**The standard deviation of the total data*/
      total_stdDev: null,

      /**The range of the total data*/
      total_range: null,

      /**The mean of the selected data*/
      selected_mean: null,

      /**The median of the selected data*/
      selected_median: null,

      /**The standard deviation of the selected data*/
      selected_stdDev: null,

      /**The range of the selected data*/
      selected_range: null,

      selectedColumn: ""
    };
  }

  /**
   * Sets the summary statistics for consensus
   */
  calcStats(data, selectedColumn, total) {


    // get values
    const allVals = [];
    for (const datum of data) {
      const datumVal = parseFloat(datum[selectedColumn]);
      if (!isNaN(datumVal)) {
        allVals.push(datumVal);
      }
    }

    // calcalate statistics
    if (allVals.length > 0) {
      const newMean = this.standardRound(mean(allVals));
      const newMedian = this.standardRound(median(allVals));
      const newStdDev = this.standardRound(std(allVals));
      const newRange = range(allVals);
      if (total){
        this.setState({
          total_mean: newMean,
          total_median: newMedian,
          total_stdDev: newStdDev,
          total_range:
            roundToDecimal(newRange[0], 3) +
            "-" +
            roundToDecimal(newRange[newRange.length - 1], 3)
        })
      }
      else{
        this.setState({
          selected_mean: newMean,
          selected_median: newMedian,
          selected_stdDev: newStdDev,
          selected_range:
            roundToDecimal(newRange[0], 3) +
            "-" +
            roundToDecimal(newRange[newRange.length - 1], 3)
        })

      }
      ;
    } else {
      this.setState({
        total_mean: null,
        total_median: null,
        total_stdDev: null,
        total_range: null,
        selected_mean: null,
        selected_median: null,
        selected_stdDev: null,
        selected_range: null,
      });
    }
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
   * When mounted, this component should set summary stats
   * if the total data exists
   */
  componentDidMount() {
    if (this.props.totalData != null) {
      this.calcStats(this.props.totalData, this.props["relevant-column"], true);
      this.setState({ selectedColumn: this.props["relevant-column"] });
    }
  }

  /**
   * If total data gets updated, then the summary stats should update too
   */
  componentDidUpdate(prevProps) {
    if (prevProps.totalData !== this.props.totalData) {
      this.calcStats(this.props.totalData, this.props["relevant-column"], true);
      this.setState({ selectedColumn: this.props["relevant-column"] });
    } else if (prevProps.selectedData !== this.props.selectedData) {
      if (this.props.selectedData.length === 0) {
        //this.calcStats(this.props.totalData, this.props["relevant-column"], true);
        this.setState({
        selected_mean: null,
        selected_median: null,
        selected_stdDev: null,
        selected_range: null,
      })
      } else {
        this.calcStats(this.props.selectedData, this.state.selectedColumn, false);
      }
    }
  }

  render() {
    if (this.props.totalData == null) {
      return <div></div>;
    } else {
      return (
        <div className="biochemical-entity-scene-stats-tool-panel">
          <div className="biochemical-entity-scene-stats-tool-panel-plot">
            <MeasurementsBoxScatterPlot
              all-measurements={this.props.totalData}
              selected-measurements={this.props.selectedData}
              data-property={this.state.selectedColumn}
            />
          </div>

          <table className="summary">
            <tbody>
              <tr>
                <td></td>
                <th scope="col">Total</th>
                <th scope="col">Selected</th>
              </tr>
              <tr>
                <th scope="row">Mean</th>
                <td>{this.state.total_mean}</td>
                <td><td>{this.state.selected_mean}</td></td>
              </tr>
              <tr>
                <th scope="row">Median</th>
                <td>{this.state.total_median}</td>
                <td><td>{this.state.selected_median}</td></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export { StatsToolPanel };

/*
 <th>Total</th>
                <td>{this.state.mean}</td>
              </tr>
              <tr>
                <th>Median</th>
                <td>{this.state.median}</td>
              </tr>
              <tr>
                <th>Std dev</th>
                <td>{this.state.stdDev}</td>
              </tr>
              <tr>
                <th>Range</th>
                <td>{this.state.range}</td>
                */