import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MeasurementsBoxScatterPlot from "../MeasurementsBoxScatterPlot/MeasurementsBoxScatterPlot";
import { mean, median, std } from "mathjs";
import { range, roundToDecimal } from "~/utils/utils";

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
    "relevant-column": PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      /**The mean of the selected data*/
      mean: null,

      /**The median of the selected data*/
      median: null,

      /**The standard deviation of the selected data*/
      stdDev: null,

      /**The range of the selected data*/
      range: null,

      selectedColumn: ""
    };
  }

  /**
   * Sets the summary statistics for consensus
   */
  calcStats(data, selectedColumn) {
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

      this.setState({
        mean: newMean,
        median: newMedian,
        stdDev: newStdDev,
        range:
          roundToDecimal(newRange[0], 3) +
          "-" +
          roundToDecimal(newRange[newRange.length - 1], 3)
      });
    } else {
      this.setState({
        mean: null,
        median: null,
        stdDev: null,
        range: null
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
      this.calcStats(this.props.totalData, this.props["relevant-column"]);
      this.setState({ selectedColumn: this.props["relevant-column"] });
    }
  }

  /**
   * If total data gets updated, then the summary stats should update too
   */
  componentDidUpdate(prevProps) {
    if (prevProps.totalData !== this.props.totalData) {
      this.calcStats(this.props.totalData, this.props["relevant-column"]);
      this.setState({ selectedColumn: this.props["relevant-column"] });
    } else if (prevProps.selectedData !== this.props.selectedData) {
      if (this.props.selectedData.length === 0) {
        this.calcStats(this.props.totalData, this.props["relevant-column"]);
      } else {
        this.calcStats(this.props.selectedData, this.state.selectedColumn);
      }
    }
  }

  render() {
    if (this.props.totalData == null) {
      return <div></div>;
    } else {
      return (
        <div className="biochemical-entity-scene-stats-tool-panel">
          <MeasurementsBoxScatterPlot
            all-measurements={this.props.totalData}
            selected-seasurements={this.props.selectedData}
            data-property={this.state.selectedColumn}
          />

          <div className="summary">
            <p>
              <b>Mean: </b>
              {this.state.mean}
            </p>
            <p>
              <b>Median: </b>
              {this.state.median}
            </p>
            <p>
              <b>Standard Deviation: </b>
              {this.state.stdDev}
            </p>
            <p>
              <b>Range: </b>
              {this.state.range}
            </p>
          </div>
        </div>
      );
    }
  }
}

export { StatsToolPanel };
