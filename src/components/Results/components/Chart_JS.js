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
    let total_f_conc = []
    let data;
    data = this.props.original_data;
    let total_scatter_1 = [];
    let total_scatter_2 = [];

    for (var i = data.length - 1; i >= 0; i--) {
      total_conc.push(parseFloat(data[i][this.props.relevantColumn]));
      total_scatter_1.push({
        x: "Total",
        y: parseFloat(data[i][this.props.relevantColumn]),
      })
      x.push(1);
    }
    let to_chart = [];
    to_chart.push(total_conc);
    if (this.props.data != null) {
      if (this.props.original_data.length != this.props.data.length) {
        for (var i = this.props.data.length - 1; i >= 0; i--) {
            total_f_conc.push(parseFloat(this.props.data[i][this.props.relevantColumn]));
            total_scatter_2.push({
              x: "Selected",
              y: parseFloat(this.props.data[i][this.props.relevantColumn]),
            })
        }
        to_chart.push(total_f_conc);
      }
    }
    console.log(to_chart[1])
    console.log(total_scatter_2)
    console.log(this.props.data)

    let boxplotData = {
      // define label tree
      labels: ['Total', 'Selected'],
      datasets: [
        {
          backgroundColor: '#99ceff',
          borderColor: '#1890ff',
          borderWidth: 1,
          outlierColor: '#999999',
          padding: 10,
          itemRadius: 0,
          data: [to_chart[0], to_chart[1]],
        },
        {
          backgroundColor: 'black',
          borderColor: 'black',
          data: total_scatter_1,
          type: 'scatter',
        },
        {
          backgroundColor: 'black',
          borderColor: 'black',
          data: total_scatter_2,
          type: 'scatter',
        },
      ],
    };

    new Chart(myChartRef, {
      type: 'boxplot',
      data: boxplotData,
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        animation:null,
        title: {
          display: false,
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
