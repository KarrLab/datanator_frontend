import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";
import "chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot";

import * as colorPalette from "~/colors.scss";
import "./MeasurementsBoxScatterPlot.scss";

export default class MeasurementsBoxScatterPlot extends Component {
  static propTypes = {
    allMeasurements: PropTypes.array,
    selectedMeasurements: PropTypes.array,
    dataProperty: PropTypes.string
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
            outlierColor: colorPalette["text-lighter"],
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
    let measurements = this.props.allMeasurements;
    let dataForBoxPlot = [];
    let dataForScatterPlot = [];
    for (
      let iMeasurement = measurements.length - 1;
      iMeasurement >= 0;
      iMeasurement--
    ) {
      dataForBoxPlot.push(
        parseFloat(measurements[iMeasurement][this.props.dataProperty])
      );
      dataForScatterPlot.push({
        x: "All",
        y: parseFloat(measurements[iMeasurement][this.props.dataProperty])
      });
    }
    chartConfig.data.datasets[0].data.push(dataForBoxPlot);
    chartConfig.data.datasets[0].backgroundColor.push(
      colorPalette["primary-light"]
    );
    chartConfig.data.datasets[0].borderColor.push(colorPalette["primary"]);
    chartConfig.data.datasets.push({
      backgroundColor: colorPalette["text"],
      borderColor: colorPalette["text"],
      data: dataForScatterPlot,
      type: "scatter",
      order: 1
    });

    // selected measurements
    if (this.props.selectedMeasurements != null) {
      let measurements = this.props.selectedMeasurements;
      let dataForBoxPlot = [];
      let dataForScatterPlot = [];
      for (
        let iMeasurement = measurements.length - 1;
        iMeasurement >= 0;
        iMeasurement--
      ) {
        dataForBoxPlot.push(
          parseFloat(measurements[iMeasurement][this.props.dataProperty])
        );
        dataForScatterPlot.push({
          x: "Selected",
          y: parseFloat(measurements[iMeasurement][this.props.dataProperty])
        });
      }

      chartConfig.data.datasets[0].data.push(dataForBoxPlot);
      chartConfig.data.datasets[0].backgroundColor.push(
        colorPalette["accent-light"]
      );
      chartConfig.data.datasets[0].borderColor.push(colorPalette["accent"]);
      chartConfig.data.datasets.push({
        backgroundColor: colorPalette["text"],
        borderColor: colorPalette["text"],
        data: dataForScatterPlot,
        type: "scatter",
        order: 1
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
