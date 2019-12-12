import React, { Component } from 'react';
import Chart from 'chart.js';
//import classes from "./LineGraph.module.css";
import 'chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js';

function randomValues(count, min, max) {
  const delta = max - min;
  return Array.from({ length: count }).map(() => Math.random() * delta + min);
}

export default class Chart_JS extends Component {
  chartRef = React.createRef();

  componentDidMount() {
    //const myChartRef = this.chartRef.current.getContext('2d');
  }

  componentDidUpdate() {
    let myChartRef = this.chartRef.current.getContext('2d');
    let x;
    x = [];
    let total_conc;
    total_conc = [];
    let data;
    data = this.props.original_data;
    let total_scatter = [];

    for (var i = data.length - 1; i >= 0; i--) {
      total_conc.push(parseFloat(data[i][this.props.relevantColumn]));
      total_scatter.push({
        x: "Total",
        y: parseFloat(data[i][this.props.relevantColumn]),
      });
      x.push(1);
    }
    let to_chart = [];
    to_chart.push(total_conc);
    if (this.props.data != null) {
      if (this.props.original_data.length != this.props.data.length) {
        let total_f_conc;
        total_f_conc = [];
        for (var i = this.props.data.length - 1; i >= 0; i--) {
          total_f_conc.push(
            parseFloat(this.props.data[i][this.props.relevantColumn]),
          );
        }
        to_chart.push(total_f_conc);
      }
    }
    console.log(total_scatter)

    let boxplotData = {
      // define label tree
      labels: ['Total'],
      datasets: [
        {
          backgroundColor: 'rgba(255,0,0,0.5)',
          borderColor: 'red',
          borderWidth: 1,
          outlierColor: '#999999',
          padding: 10,
          itemRadius: 0,
          data: [to_chart[0]],
        },
        {
          backgroundColor: 'black',
          borderColor: 'black',
          data: total_scatter,
          type: 'scatter',
        },
      ],
    };

    const boxplotData2 = {
      // define label tree
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Dataset 1',
          backgroundColor: 'rgba(255,0,0,0.5)',
          borderColor: 'red',
          borderWidth: 1,
          outlierColor: '#999999',
          padding: 10,
          itemRadius: 0,
          data: [
            randomValues(100, 0, 100),
            randomValues(100, 0, 20),
            randomValues(100, 20, 70),
            randomValues(100, 60, 100),
            randomValues(40, 50, 100),
            randomValues(100, 60, 120),
            randomValues(100, 80, 100),
          ],
        },
        {
          label: 'Dataset 2',
          backgroundColor: 'rgba(0,0,255,0.5)',
          borderColor: 'blue',
          borderWidth: 1,
          outlierColor: '#999999',
          padding: 10,
          itemRadius: 0,
          data: [
            randomValues(100, 60, 100),
            randomValues(100, 0, 100),
            randomValues(100, 0, 20),
            randomValues(100, 20, 70),
            randomValues(40, 60, 120),
            randomValues(100, 20, 100),
            randomValues(100, 80, 100),
          ],
        },
      ],
    };
    console.log([
      randomValues(100, 60, 100),
      randomValues(100, 0, 100),
      randomValues(100, 0, 20),
      randomValues(100, 20, 70),
      randomValues(40, 60, 120),
      randomValues(100, 20, 100),
      randomValues(100, 80, 100),
    ]);
    console.log(to_chart[0]);

    new Chart(myChartRef, {
      type: 'boxplot',
      data: boxplotData,
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Chart.js Box Plot Chart',
        },
      },
    });
  }
  render() {
    let original_data = this.props.original_data;
    return (
      <div>
        <canvas id="myChart" ref={this.chartRef} width="190" height="400" />
      </div>
    );
  }
}
