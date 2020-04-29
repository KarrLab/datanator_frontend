import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

import * as colorPalette from "~/colors.scss";
var kernel = require("kernel-smooth");
export default class FrequencyPlot extends Component {
  static propTypes = {
    data: PropTypes.shape({
      labels: PropTypes.array.isRequired,
      values: PropTypes.array.isRequired
    }).isRequired,
    xAxisLabel: PropTypes.string.isRequired,
    xMin: PropTypes.number,
    xMax: PropTypes.number,
    yAxisLabel: PropTypes.string.isRequired,
    kernelBandwidth: PropTypes.number
  };

  static defaultProps = {
    xMin: null,
    xMax: null,
    kernelBandwidth: 0.5
  };

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.chart = null;
  }

  componentDidMount() {
    this.configChart();
  }

  componentDidUpdate() {
    this.configChart();
  }

  configChart() {
    if (!this.props.data.labels.length) {
      return;
    }

    let xData = this.props.data.labels;
    let yData = this.props.data.values;
    let fHat = kernel.regression(
      xData,
      yData,
      kernel.fun.gaussian,
      this.props.kernelBandwidth
    );
    let xMin, xMax;
    if (this.props.xMin == null) {
      xMin = Math.min(...xData);
    } else {
      xMin = this.props.xMin;
    }
    if (this.props.xMax == null) {
      xMax = Math.max(...xData);
    } else {
      xMax = this.props.xMax;
    }
    let data = [];
    let nPoints = 101;
    for (let i = 0; i < nPoints; i++) {
      let xVal = xMin + ((xMax - xMin) * i) / (nPoints - 1);
      data.push({ x: xVal, y: fHat(xVal) });
    }
    let chartConfig = {
      type: "line",
      data: {
        datasets: [
          {
            label: "distribution",
            backgroundColor: colorPalette["primary-lighter"],
            borderColor: colorPalette["primary-light"],
            borderWidth: 2.0,
            data: data,
            pointRadius: 0,
            showLine: true
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
              type: "linear",
              scaleLabel: {
                display: true,
                labelString: this.props.yAxisLabel
              },
              ticks: {
                maxTicksLimit: 4
              }
            }
          ],
          xAxes: [
            {
              type: "linear",
              scaleLabel: {
                display: true,
                labelString: this.props.xAxisLabel
              }
            }
          ]
        }
      }
    };

    // build chart
    if (this.chart == null) {
      let canvasContext = this.canvas.current.getContext("2d");
      this.chart = new Chart(canvasContext, chartConfig);
    } else {
      this.chart.update(chartConfig);
    }
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
