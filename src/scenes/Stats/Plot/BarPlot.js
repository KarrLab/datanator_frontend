import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";
import { numberWithCommas } from "~/utils/utils";

import * as colorPalette from "~/colors.scss";

export default class BarPlot extends Component {
  static propTypes = {
    data: PropTypes.shape({
      labels: PropTypes.array.isRequired,
      values: PropTypes.array.isRequired,
    }).isRequired,
    yAxisLabel: PropTypes.string.isRequired,
  };

  canvas = React.createRef();

  componentDidMount() {
    this.configChart();
  }

  componentDidUpdate() {
    this.configChart();
  }

  configChart() {
    if (!this.props.data.values.length) {
      return;
    }

    const maxVal = Math.max(...this.props.data.values);
    const log = Math.floor(Math.log10(maxVal));
    const maxTick = Math.ceil(maxVal / Math.pow(10, log)) * Math.pow(10, log);
    const yTickLogStep = Math.ceil(Math.max(Math.log10(maxVal)) / 4);
    const maxTicksLimit = Math.ceil(
      Math.ceil(Math.log10(maxTick)) / yTickLogStep
    );

    let chartConfig = {
      type: "bar",
      data: {
        labels: this.props.data.labels,
        datasets: [
          {
            backgroundColor: colorPalette["primary-lighter"],
            borderColor: colorPalette["primary-light"],
            borderWidth: 2.0,
            data: this.props.data.values,
          },
        ],
      },
      options: {
        events: [],
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        animation: null,
        title: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                minRotation: 45,
                maxRotation: 90,
              },
            },
          ],
          yAxes: [
            {
              type: "logarithmic",
              scaleLabel: {
                display: true,
                labelString: this.props.yAxisLabel,
              },
              ticks: {
                min: 1,
                max: maxTick,
                maxTicksLimit: maxTicksLimit,
                callback: numberWithCommas,
              },
              afterBuildTicks: (chart) => {
                chart.ticks = [];
                for (let i = 0; i < maxTicksLimit; i++) {
                  chart.ticks.push(Math.pow(10, i * yTickLogStep));
                }
              },
            },
          ],
        },
      },
    };

    // build chart
    let canvasContext = this.canvas.current.getContext("2d");
    new Chart(canvasContext, chartConfig);
  }

  render() {
    if (this.props.data.values.length) {
      return (
        <canvas
          ref={this.canvas}
          className="biochemical-entity-scene-measurement-plot"
        />
      );
    } else {
      return <div className="loader"></div>;
    }
  }
}
