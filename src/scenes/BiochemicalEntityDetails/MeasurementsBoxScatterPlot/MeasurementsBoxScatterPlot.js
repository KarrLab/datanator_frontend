import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";
import "chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot";

import * as colorPalette from "~/colors.scss";

export default class MeasurementsBoxScatterPlot extends Component {
  static propTypes = {
    "all-measurements": PropTypes.array.isRequired,
    "selected-measurements": PropTypes.array,
    "data-property": PropTypes.string.isRequired
  };

  static defaultProps = {
    "selected-measurements": null
  };

  canvas = React.createRef();

  componentDidUpdate() {
    let chartConfig = {
      type: "boxplot",
      data: {
        labels: ["All", "Selected"],
        datasets: [
          {
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            outlierColor: colorPalette["text-lightest"],
            padding: 10,
            itemRadius: 0,
            data: [],
            order: 2
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
    let measurements = this.props["all-measurements"];
    let dataForBoxPlot = [];
    let dataForScatterPlot = [];
    for (
      let iMeasurement = measurements.length - 1;
      iMeasurement >= 0;
      iMeasurement--
    ) {
      dataForBoxPlot.push(
        parseFloat(measurements[iMeasurement][this.props["data-property"]])
      );
      dataForScatterPlot.push({
        x: "All",
        y: parseFloat(measurements[iMeasurement][this.props["data-property"]])
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
      type: "scatter"
    });

    // selected measurements
    if (this.props["selected-measurements"] != null) {
      let measurements = this.props["selected-measurements"];
      let dataForBoxPlot = [];
      let dataForScatterPlot = [];
      for (
        let iMeasurement = measurements.length - 1;
        iMeasurement >= 0;
        iMeasurement--
      ) {
        dataForBoxPlot.push(
          parseFloat(measurements[iMeasurement][this.props["data-property"]])
        );
        dataForScatterPlot.push({
          x: "Selected",
          y: parseFloat(measurements[iMeasurement][this.props["data-property"]])
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
        order: 1,
        type: "scatter"
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
