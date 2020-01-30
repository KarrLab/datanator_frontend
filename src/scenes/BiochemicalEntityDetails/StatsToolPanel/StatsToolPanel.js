import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MeasurementsBoxScatterPlot from "../MeasurementsBoxScatterPlot/MeasurementsBoxScatterPlot";
import { mean, median, std, min, max } from "mathjs";
import { formatScientificNotation } from "~/utils/utils";

import "./StatsToolPanel.scss";

/**
 * Class to render the Consensus of results, and the save the total data to CSV file
 * This class takes the data from the store, and summarizes the data with mean, median, standard deviation, minimum, maximum, and a chart at bottom.
 * This class mostly handles the rendering, while the logic is handled elsewhere
 */
@connect(store => {
  return {
    selectedData: store.results.selectedData,
    allData: store.results.allData
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
    allData: PropTypes.array.isRequired,

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
      all: {
        /**The mean of the total data*/

        mean: null,

        /**The median of the total data*/
        median: null,

        /**The standard deviation of the total data*/
        stdDev: null,

        /**Minimum of the total data*/
        min: null,

        /**Maximum of the total data*/
        max: null
      },
      selected: {
        /**The mean of the selected data*/

        mean: null,

        /**The median of the selected data*/
        median: null,

        /**The standard deviation of the selected data*/
        stdDev: null,

        /**Minimum of the selected data*/
        min: null,

        /**Maximum of the selected data*/
        max: null
      },

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
      let newMean = mean(allVals);
      let newMedian = median(allVals);
      let newStdDev = std(allVals);
      let newMin = min(allVals);
      let newMax = max(allVals);

      newMean = formatScientificNotation(newMean);
      newMedian = formatScientificNotation(newMedian);
      newStdDev = formatScientificNotation(newStdDev);
      newMin = formatScientificNotation(newMin);
      newMax = formatScientificNotation(newMax);

      if (allVals.length < 2) {
        newStdDev = null;
      }

      if (total) {
        this.setState({
          all: {
            mean: newMean,
            median: newMedian,
            stdDev: newStdDev,
            min: newMin,
            max: newMax
          }
        });
      } else {
        this.setState({
          selected: {
            mean: newMean,
            median: newMedian,
            stdDev: newStdDev,
            min: newMin,
            max: newMax
          }
        });
      }
    } else {
      this.setState({
        all: {
          mean: null,
          median: null,
          stdDev: null,
          min: null,
          max: null
        },
        selected: {
          mean: null,
          median: null,
          stdDev: null,
          min: null,
          max: null
        }
      });
    }
  }

  /**
   * When mounted, this component should set summary stats
   * if the total data exists
   */
  componentDidMount() {
    if (this.props.allData != null) {
      this.calcStats(this.props.allData, this.props["relevant-column"], true);
      this.setState({ selectedColumn: this.props["relevant-column"] });
    }
  }

  /**
   * If total data gets updated, then the summary stats should update too
   */
  componentDidUpdate(prevProps) {
    if (prevProps.allData !== this.props.allData) {
      this.calcStats(this.props.allData, this.props["relevant-column"], true);
      this.setState({ selectedColumn: this.props["relevant-column"] });
    } else if (prevProps.selectedData !== this.props.selectedData) {
      if (this.props.selectedData.length === 0) {
        //this.calcStats(this.props.allData, this.props["relevant-column"], true);
        this.setState({
          selected: {
            mean: null,
            median: null,
            stdDev: null,
            min: null,
            max: null
          }
        });
      } else {
        this.calcStats(
          this.props.selectedData,
          this.state.selectedColumn,
          false
        );
      }
    }
  }

  render() {
    if (this.props.allData == null) {
      return <div></div>;
    } else {
      return (
        <div className="biochemical-entity-scene-stats-tool-panel">
          <div className="biochemical-entity-scene-stats-tool-panel-plot">
            <MeasurementsBoxScatterPlot
              all-measurements={this.props.allData}
              selected-measurements={this.props.selectedData}
              data-property={this.state.selectedColumn}
            />
          </div>

          <table className="summary">
            <tbody>
              <tr>
                <th></th>
                <th scope="col">All</th>
                <th scope="col">Selected</th>
              </tr>
              <tr>
                <th scope="row">Mean</th>
                <td>{this.state.all.mean}</td>
                <td>{this.state.selected.mean}</td>
              </tr>
              <tr>
                <th scope="row">Median</th>
                <td>{this.state.all.median}</td>
                <td>{this.state.selected.median}</td>
              </tr>
              <tr>
                <th scope="row">Std dev</th>
                <td>{this.state.all.stdDev}</td>
                <td>{this.state.selected.stdDev}</td>
              </tr>
              <tr>
                <th scope="row">Min</th>
                <td>{this.state.all.min}</td>
                <td>{this.state.selected.min}</td>
              </tr>
              <tr>
                <th scope="row">Max</th>
                <td>{this.state.all.max}</td>
                <td>{this.state.selected.max}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export { StatsToolPanel };
