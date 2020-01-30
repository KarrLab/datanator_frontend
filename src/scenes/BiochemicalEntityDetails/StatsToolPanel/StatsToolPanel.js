import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MeasurementsBoxScatterPlot from "../MeasurementsBoxScatterPlot/MeasurementsBoxScatterPlot";
import { mean, median, std, min, max } from "mathjs";
import { formatScientificNotation } from "~/utils/utils";

import "./StatsToolPanel.scss";

/**
 * Class to render the statistics of results
 * This class takes the data from the store, and summarizes the data with mean, median, standard deviation, minimum, maximum, and a chart at top.
 * This class mostly handles the rendering, while the logic is handled elsewhere
 */
@connect(store => {
  return {
    allData: store.results.allData,
    selectedData: store.results.selectedData
  };
})
class StatsToolPanel extends Component {
  static propTypes = {
    /**
     * REDUX: This is a list of all the data. This is recorded in the CSV file
     */
    allData: PropTypes.array.isRequired,

    /**
     * REDUX: this is a list of rows of all the selected data. This is used to generate statistics
     * only of the displayed data
     */
    selectedData: PropTypes.array,

    /**
     * This prop indicates which column contains the values that need to be summarized.
     * For example, in metabolite concentrations, we want the summarize the value of "concentration",
     * so we need to tell the compomenet to look for the column labeled "concentration"
     */
    col: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      all: {
        /**The mean of all of the data*/

        mean: null,

        /**The median of all of the data*/
        median: null,

        /**The standard deviation of all of the data*/
        stdDev: null,

        /**Minimum of all of the data*/
        min: null,

        /**Maximum of all of the data*/
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
      }
    };
  }

  /**
   * Calculate the summary statistics
   */
  calcStats(data) {
    // get values
    const vals = [];
    for (const datum of data) {
      const val = datum[this.props.col];
      if (val != null) {
        vals.push(val);
      }
    }

    // calcalate statistics
    const stats = {
      mean: null,
      median: null,
      stdDev: null,
      min: null,
      max: null
    };

    if (vals.length > 0) {
      stats.mean = formatScientificNotation(mean(vals));
      stats.median = formatScientificNotation(median(vals));
      stats.stdDev = formatScientificNotation(std(vals));
      stats.min = formatScientificNotation(min(vals));
      stats.max = formatScientificNotation(max(vals));
    }

    if (vals.length < 2) {
      stats.stdDev = null;
    }

    // return statistics
    return stats;
  }

  /**
   * When mounted, this component should set summary stats
   * if the data exists
   */
  componentDidMount() {
    if (this.props.allData != null) {
      this.setState({
        all: this.calcStats(this.props.allData)
      });
    }

    if (this.props.selectedData != null) {
      this.setState({
        selected: this.calcStats(this.props.selectedData)
      });
    }
  }

  /**
   * If all data gets updated, then the summary stats should update too
   */
  componentDidUpdate(prevProps) {
    if (prevProps.allData !== this.props.allData) {
      this.setState({
        all: this.calcStats(this.props.allData)
      });
    }

    if (prevProps.selectedData !== this.props.selectedData) {
      this.setState({
        selected: this.calcStats(this.props.selectedData)
      });
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
              data-property={this.props.col}
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
