import React, { Component } from "react";
import PropTypes from "prop-types";
import MeasurementsBoxScatterPlot from "../MeasurementsBoxScatterPlot/MeasurementsBoxScatterPlot";
import { mean, median, std, min, max } from "mathjs";
import { formatScientificNotation } from "~/utils/utils";

import "./StatsToolPanel.scss";

/**
 * Class to render the statistics of results
 * This class takes the data from the store, and summarizes the data with mean, median, standard deviation, minimum, maximum, and a chart at top.
 * This class mostly handles the rendering, while the logic is handled elsewhere
 */
class StatsToolPanel extends Component {
  static propTypes = {
    /* AG-Grid API */
    api: PropTypes.shape({
      addEventListener: PropTypes.func.isRequired,
      removeEventListener: PropTypes.func.isRequired,
    }).isRequired,

    /**
     * This prop indicates which column contains the values that need to be summarized.
     * For example, in metabolite concentrations, we want the summarize the value of "concentration",
     * so we need to tell the compomenet to look for the column labeled "concentration"
     */
    col: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      all: {
        values: null,
        count: null,
        mean: null,
        median: null,
        stdDev: null,
        min: null,
        max: null,
      },
      filtered: {
        values: null,
        count: null,
        mean: null,
        median: null,
        stdDev: null,
        min: null,
        max: null,
      },
      selected: {
        values: null,
        count: null,
        mean: null,
        median: null,
        stdDev: null,
        min: null,
        max: null,
      },
    };

    this.updateStats = this.updateStats.bind(this);
    this.updateSelectedStats = this.updateSelectedStats.bind(this);
  }

  /**
   * When mounted, setup listeners to update stats
   */
  componentDidMount() {
    this.updateStats(this.props);
    this.props.api.addEventListener("rowDataChanged", this.updateStats);
    this.props.api.addEventListener("filterChanged", this.updateSelectedStats);
    this.props.api.addEventListener(
      "selectionChanged",
      this.updateSelectedStats
    );
  }

  /**
   * When component updates, update listeners to update stats
   */
  componentDidUpdate(prevProps) {
    /* istanbul ignore next */
    /* Never reached because the application never changes the 'api' property */
    if (prevProps.api !== this.props.api) {
      prevProps.api.removeEventListener("rowDataChanged", this.updateStats);
      prevProps.api.removeEventListener(
        "filterChanged",
        this.updateSelectedStats
      );
      prevProps.api.removeEventListener(
        "selectionChanged",
        this.updateSelectedStats
      );

      this.props.api.addEventListener("rowDataChanged", this.updateStats);
      this.props.api.addEventListener(
        "filterChanged",
        this.updateSelectedStats
      );
      this.props.api.addEventListener(
        "selectionChanged",
        this.updateSelectedStats
      );
    }

    /* istanbul ignore next */
    /* Never reached because the application never changes the 'api' or 'col' properties */
    if (prevProps.api !== this.props.api || prevProps.col !== this.props.col) {
      this.updateStats(this.props);
    }
  }

  updateStats(event) {
    const dataPoints = [];
    event.api.forEachNode((node) => {
      dataPoints.push(node);
    });

    this.setState({
      all: this.calcStats(dataPoints),
    });

    this.updateSelectedStats(event);
  }

  updateSelectedStats(event) {
    const filteredDataPoints = [];
    const selectedDataPoints = [];
    event.api.forEachNodeAfterFilter((node) => {
      filteredDataPoints.push(node);
      if (node.selected) {
        selectedDataPoints.push(node);
      }
    });

    this.setState({
      filtered: this.calcStats(filteredDataPoints),
      selected: this.calcStats(selectedDataPoints),
    });
  }

  /**
   * Calculate the summary statistics
   */
  calcStats(nodes) {
    // get values
    const vals = [];
    const nonNullVals = [];
    for (const node of nodes) {
      let val = node.data;
      for (const col of this.props.col) {
        if (val != null && val !== undefined && col in val) {
          val = val[col];
        } else {
          val = null;
          break;
        }
      }

      vals.push(val);
      if (val != null) {
        nonNullVals.push(val);
      }
    }

    // calcalate statistics
    const stats = {
      nodes: nodes,
      values: vals,
      count: null,
      mean: null,
      median: null,
      stdDev: null,
      min: null,
      max: null,
    };

    if (nonNullVals.length > 0) {
      stats.count = nonNullVals.length;
      stats.mean = formatScientificNotation(mean(nonNullVals));
      stats.median = formatScientificNotation(median(nonNullVals));
      stats.stdDev = formatScientificNotation(std(nonNullVals));
      stats.min = formatScientificNotation(min(nonNullVals));
      stats.max = formatScientificNotation(max(nonNullVals));
    }

    if (nonNullVals.length < 2) {
      stats.stdDev = null;
    }

    // return statistics
    return stats;
  }

  render() {
    if (this.state.all.values == null) {
      return <div></div>;
    } else {
      return (
        <div className="biochemical-entity-scene-stats-tool-panel">
          <div className="biochemical-entity-scene-stats-tool-panel-plot">
            <MeasurementsBoxScatterPlot
              all={{
                nodes: this.state.all.nodes,
                values: this.state.all.values,
              }}
              filtered={{
                nodes: this.state.filtered.nodes,
                values: this.state.filtered.values,
              }}
              selected={{
                nodes: this.state.selected.nodes,
                values: this.state.selected.values,
              }}
            />
          </div>

          <table className="summary">
            <tbody>
              <tr>
                <th></th>
                <th scope="col">All</th>
                <th scope="col">Filtered</th>
                <th scope="col">Selected</th>
              </tr>
              <tr>
                <th scope="row">Count</th>
                <td>{this.state.all.count}</td>
                <td>{this.state.filtered.count}</td>
                <td>{this.state.selected.count}</td>
              </tr>
              <tr>
                <th scope="row">Mean</th>
                <td>{this.state.all.mean}</td>
                <td>{this.state.filtered.mean}</td>
                <td>{this.state.selected.mean}</td>
              </tr>
              <tr>
                <th scope="row">Median</th>
                <td>{this.state.all.median}</td>
                <td>{this.state.filtered.median}</td>
                <td>{this.state.selected.median}</td>
              </tr>
              <tr>
                <th scope="row">Std dev</th>
                <td>{this.state.all.stdDev}</td>
                <td>{this.state.filtered.stdDev}</td>
                <td>{this.state.selected.stdDev}</td>
              </tr>
              <tr>
                <th scope="row">Min</th>
                <td>{this.state.all.min}</td>
                <td>{this.state.filtered.min}</td>
                <td>{this.state.selected.min}</td>
              </tr>
              <tr>
                <th scope="row">Max</th>
                <td>{this.state.all.max}</td>
                <td>{this.state.filtered.max}</td>
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
