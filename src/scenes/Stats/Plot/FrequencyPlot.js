import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

import * as colorPalette from "~/colors.scss";
var kernel = require("kernel-smooth");
export default class FrequencyPlot extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    xAxisLabel: PropTypes.string.isRequired
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
    var f_hat = kernel.regression(
      this.props.labels,
      this.props.data,
      kernel.fun.gaussian,
      0.5
    );
    let chartConfig = {
      type: "line",
      data: {
        labels: this.props.labels,
        datasets: [
          {
            backgroundColor: colorPalette["primary-light"],
            data: f_hat(this.props.labels),
            pointRadius: 0
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
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "# Observations"
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.props.xAxisLabel
              }
            }
          ]
        }
      }
    };

    // all measurements

    //var f_hat = kernel.regression( this.props.labels, this.props.data, kernel.fun.gaussian, 0.5 );
    console.log(f_hat(this.props.labels));

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
