import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

import * as colorPalette from "~/colors.scss";

export default class BarPlot extends Component {
  static propTypes = {
    data: PropTypes.shape({
      labels: PropTypes.array.isRequired,
      values: PropTypes.array.isRequired
    }).isRequired,
    yAxisLabel: PropTypes.string.isRequired
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
        labels: this.props.data.labels,
        datasets: [
          {
            backgroundColor: colorPalette["primary-lighter"],
            borderColor: colorPalette["primary-light"],
            borderWidth: 2.0,
            data: this.props.data.values
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
          xAxes: [
            {
              ticks: {
                minRotation: 45,
                maxRotation: 90
              }
            }
          ],
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
          ]
        }
      }
    };

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
