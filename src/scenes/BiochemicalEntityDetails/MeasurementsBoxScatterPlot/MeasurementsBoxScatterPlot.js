import React, { Component } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";
import "chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot";
import { formatScientificNotation } from "~/utils/utils";

import * as colorPalette from "~/colors.scss";

export default class MeasurementsBoxScatterPlot extends Component {
  static propTypes = {
    all: PropTypes.shape({
      nodes: PropTypes.array,
      values: PropTypes.array,
    }),
    filtered: PropTypes.shape({
      nodes: PropTypes.array,
      values: PropTypes.array,
    }),
    selected: PropTypes.shape({
      nodes: PropTypes.array,
      values: PropTypes.array,
    }),
  };

  static defaultProps = {
    filtered: null,
    selected: null,
  };

  canvas = React.createRef();

  constructor() {
    super();
    this.chartConfig = null;
  }

  componentDidMount() {
    this.configChart();
  }

  componentDidUpdate() {
    this.configChart();
  }

  configChart() {
    this.chartConfig = {
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
        tooltips: {
          callbacks: {
            title: function () {
              return null;
            },
            boxplotLabel: (item) => {
              const results = this.getDatum(item.datasetIndex, item.index);

              if (results != null) {
                const node = results.node;
                node.gridApi.ensureNodeVisible(node);
                node.gridApi.flashCells({
                  rowNodes: [node],
                  flashDelay: 1000,
                  fadeDelay: 1000,
                });

                const value = results.value;
                return formatScientificNotation(value, 1, 1, 1, 1, 0, false);
              }
            },
          },
          displayColors: false,
        },
        onClick: (evt, items) => {
          if (evt.type === "click") {
            for (const item of items) {
              const results = this.getDatum(item._datasetIndex, item._index);
              if (results) {
                const node = results.node;
                node.setSelected(true);
              }
            }
          }
        },
      },
    };

    // all measurements
    let measurements = this.props.all.values || [];
    let dataForBoxPlot = measurements;
    let dataForScatterPlot = [];
    for (const measurement of measurements) {
      dataForScatterPlot.push({
        x: "All",
        y: measurement,
      });
    }
    this.chartConfig.data.datasets[0].data.push(dataForBoxPlot);
    this.chartConfig.data.datasets[0].backgroundColor.push(
      colorPalette["text-lighter"]
    );
    this.chartConfig.data.datasets[0].borderColor.push(
      colorPalette["text-light"]
    );
    this.chartConfig.data.datasets.push({
      borderColor: colorPalette["text-light"],
      borderWidth: 1,
      data: dataForScatterPlot,
      order: 1,
      type: "scatter",
    });

    // filtered measurements
    if (this.props.filtered.values != null) {
      let measurements = this.props.filtered.values || [];
      let dataForBoxPlot = measurements;
      let dataForScatterPlot = [];
      for (const measurement of measurements) {
        dataForScatterPlot.push({
          x: "Filtered",
          y: measurement,
        });
      }

      this.chartConfig.data.datasets[0].data.push(dataForBoxPlot);
      this.chartConfig.data.datasets[0].backgroundColor.push(
        colorPalette["primary-light"]
      );
      this.chartConfig.data.datasets[0].borderColor.push(
        colorPalette["primary"]
      );
      this.chartConfig.data.datasets.push({
        borderColor: colorPalette["text-light"],
        borderWidth: 1,
        data: dataForScatterPlot,
        order: 2,
        type: "scatter",
      });
    }

    // selected measurements
    if (this.props.selected.values != null) {
      let measurements = this.props.selected.values || [];
      let dataForBoxPlot = measurements;
      let dataForScatterPlot = [];
      for (const measurement of measurements) {
        dataForScatterPlot.push({
          x: "Selected",
          y: measurement,
        });
      }

      this.chartConfig.data.datasets[0].data.push(dataForBoxPlot);
      this.chartConfig.data.datasets[0].backgroundColor.push(
        colorPalette["accent-light"]
      );
      this.chartConfig.data.datasets[0].borderColor.push(
        colorPalette["accent"]
      );
      this.chartConfig.data.datasets.push({
        borderColor: colorPalette["text-light"],
        borderWidth: 1,
        data: dataForScatterPlot,
        order: 1,
        type: "scatter",
      });
    }

    // build chart
    let canvasContext = this.canvas.current.getContext("2d");
    new Chart(canvasContext, this.chartConfig);
  }

  getDatum(datasetIndex, index) {
    const iDataSet = this.chartConfig.data.datasets.length - 1 - datasetIndex;
    const iDatum = index;
    const dataset = this.chartConfig.data.datasets[iDataSet].data;
    const datum = dataset[iDatum];

    let nodes;
    if (datasetIndex === 0) {
      nodes = this.props.selected.nodes;
    } else if (datasetIndex === 1) {
      nodes = this.props.filtered.nodes;
    } else if (datasetIndex === 2) {
      nodes = this.props.all.nodes;
    } else {
      return null;
    }
    const node = nodes[iDatum];

    if (datum === undefined) {
      return null;
    } else {
      return {
        node: node,
        value: datum.y,
      };
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
