import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

import * as colorPalette from "~/colors.scss";

export default class BarPlot extends Component {
  static propTypes = {
    data: PropTypes.array,
    labels: PropTypes.array,
    selected: PropTypes.array
  };

  static defaultProps = {
    selected: null
  };

  canvas = React.createRef();

  componentDidMount() {
    this.configChart();
  }

  componentDidUpdate() {
    this.configChart();
  }

  configChart() {
    let chartConfig = {
      type: "bar",
      data: {
        labels: this.props.labels,
        datasets: [
          {
            backgroundColor: colorPalette["primary-light"],
            data: this.props.data
          }
        ]
      },
      options: {
        events: [],
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        animation: null,
        title: {
          display: false
        }
      }
    };

    // all measurements

    // build chart
    let canvasContext = this.canvas.current.getContext("2d");
    new Chart(canvasContext, chartConfig);
  }

  render() {
    return (
      <canvas
        ref={this.canvas}
        className="biochemical-entity-scene-measurement-plot"
      />
    );
  }
}
