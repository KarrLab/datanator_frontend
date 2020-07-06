import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";
import "chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot";

import * as colorPalette from "~/colors.scss";

export default class MeasurementsBoxScatterPlot extends Component {
  static propTypes = {
    all: PropTypes.array,
    filtered: PropTypes.array,
    selected: PropTypes.array,
  };

  static defaultProps = {
    filtered: null,
    selected: null,
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
      type: "boxplot",
      data: {
        labels: ["All", "Filtered", "Selected"],
        datasets: [
          {
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            outlierColor: colorPalette["text-lightest"],
            padding: 10,
            itemRadius: 0,
            data: [],
            order: 3,
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
                minRotation: 0,
                maxRotation: 0,
                fontSize: 9,
                fontColor: colorPalette["text"],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontSize: 9,
                fontColor: colorPalette["text"],
              },
            },
          ],
        },
      },
    };

    // all measurements
    let measurements = this.props.all || [];
    let dataForBoxPlot = measurements;
    let dataForScatterPlot = [];
    for (const measurement of measurements) {
      dataForScatterPlot.push({
        x: "All",
        y: measurement,
      });
    }
    chartConfig.data.datasets[0].data.push(dataForBoxPlot);
    chartConfig.data.datasets[0].backgroundColor.push(
      colorPalette["primary-light"]
    );
    chartConfig.data.datasets[0].borderColor.push(colorPalette["primary"]);
    chartConfig.data.datasets.push({
      borderColor: colorPalette["text-light"],
      borderWidth: 1,
      data: dataForScatterPlot,
      order: 1,
      type: "scatter",
    });

    // filtered measurements
    if (this.props.filtered != null) {
      let measurements = this.props.filtered || [];
      let dataForBoxPlot = measurements;
      let dataForScatterPlot = [];
      for (const measurement of measurements) {
        dataForScatterPlot.push({
          x: "Filtered",
          y: parseFloat(measurement),
        });
      }

      chartConfig.data.datasets[0].data.push(dataForBoxPlot);
      chartConfig.data.datasets[0].backgroundColor.push(
        colorPalette["accent-light"]
      );
      chartConfig.data.datasets[0].borderColor.push(colorPalette["accent"]);
      chartConfig.data.datasets.push({
        borderColor: colorPalette["text-light"],
        borderWidth: 1,
        data: dataForScatterPlot,
        order: 2,
        type: "scatter",
      });
    }

    // selected measurements
    if (this.props.selected != null) {
      let measurements = this.props.selected || [];
      let dataForBoxPlot = measurements;
      let dataForScatterPlot = [];
      for (const measurement of measurements) {
        dataForScatterPlot.push({
          x: "Selected",
          y: parseFloat(measurement),
        });
      }

      chartConfig.data.datasets[0].data.push(dataForBoxPlot);
      chartConfig.data.datasets[0].backgroundColor.push(
        colorPalette["secondary-light"]
      );
      chartConfig.data.datasets[0].borderColor.push(colorPalette["secondary"]);
      chartConfig.data.datasets.push({
        borderColor: colorPalette["text-light"],
        borderWidth: 1,
        data: dataForScatterPlot,
        order: 1,
        type: "scatter",
      });
    }

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
