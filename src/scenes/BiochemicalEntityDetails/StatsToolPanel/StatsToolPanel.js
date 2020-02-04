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
    allData: store.results.allData
  };
})
class StatsToolPanel extends Component {
  static propTypes = {
    /**
     * REDUX: This is a list of all the data. This is recorded in the CSV file
     */
    allData: PropTypes.array.isRequired,

    /* AG-Grid API */
    api: PropTypes.shape({
      addEventListener: PropTypes.func.isRequired,
      removeEventListener: PropTypes.func.isRequired
    }).isRequired,

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
        /* values of all of the data */
        values: null,

        /* The count of all of the data */
        count: null,

        /* The mean of all of the data */
        mean: null,

        /* The median of all of the data */
        median: null,

        /* The standard deviation of all of the data */
        stdDev: null,

        /* Minimum of all of the data */
        min: null,

        /* Maximum of all of the data */
        max: null
      },
      selected: {
        /* selected values */
        values: null,

        /* The count of the selected data */
        count: null,

        /* The mean of the selected data */
        mean: null,

        /* The median of the selected data */
        median: null,

        /* The standard deviation of the selected data */
        stdDev: null,

        /* Minimum of the selected data */
        min: null,

        /* Maximum of the selected data */
        max: null
      }
    };

    this.updateSelectedStats = this.updateSelectedStats.bind(this);
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

    if (this.props.api != null) {
      this.props.api.addEventListener(
        "filterChanged",
        this.updateSelectedStats
      );
      this.props.api.addEventListener(
        "selectionChanged",
        this.updateSelectedStats
      );
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

    if (prevProps.api !== this.props.api) {
      prevProps.api.removeEventListener(
        "filterChanged",
        this.updateSelectedStats
      );
      prevProps.api.removeEventListener(
        "selectionChanged",
        this.updateSelectedStats
      );
      if (this.props.api != null) {
        this.props.api.addEventListener(
          "filterChanged",
          this.updateSelectedStats
        );
        this.props.api.addEventListener(
          "selectionChanged",
          this.updateSelectedStats
        );
      }
    }
  }

  updateSelectedStats(event) {
    const dataPoints = [];
    event.api.forEachNodeAfterFilter(node => {
      if (node.selected) {
        dataPoints.push(node.data);
      }
    });

    this.setState({
      selected: this.calcStats(dataPoints)
    });
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
      values: vals,
      count: null,
      mean: null,
      median: null,
      stdDev: null,
      min: null,
      max: null
    };

    if (vals.length > 0) {
      stats.count = vals.length;
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

  render() {
    if (this.props.allData == null) {
      return <div></div>;
    } else {
      return (
        <div className="biochemical-entity-scene-stats-tool-panel">
          <div className="biochemical-entity-scene-stats-tool-panel-plot">
            <MeasurementsBoxScatterPlot
              all={this.state.all.values}
              selected={this.state.selected.values}
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
                <th scope="row">Count</th>
                <td>{this.state.all.count}</td>
                <td>{this.state.selected.count}</td>
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
