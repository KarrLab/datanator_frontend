import React from 'react';
import Plot from 'react-plotly.js';


class Chart3 extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let y;
    y = this.props.data;
    let x;
    x = []
    let total_conc;
    total_conc = []
    let data;
    data=this.props.original_data;

    for (var i = data.length - 1; i >= 0; i--){
      total_conc.push(parseFloat(data[i].concentration))
      x.push(1)
    }


    for (var i = y.length - 1; i >= 0; i--){
      x.push(1)
    }
    let to_chart;
    to_chart=[
          {
            //x: x,
            name:'Total',
            y: total_conc,
            type: 'box',
            mode: 'points',
            boxpoints: 'all',
            pointpos: 0,
            paper_bgcolor: 'rgb(233,233,233)'
          },
        ]

    if (this.props.original_data.length != this.props.data.length){
       let total_f_conc;
       total_f_conc= []
       for (var i = this.props.data.length - 1; i >= 0; i--){
          total_f_conc.push(parseFloat(this.props.data[i].concentration))
        }
      to_chart.push({
            //x: x,
            name:'Filtered',
            y: total_f_conc,
            type: 'box',
            mode: 'points',
            boxpoints: 'all',
            pointpos: 0,
            paper_bgcolor: 'rgb(233,233,233)'
          })
    }

    return (
      <div className="Chart3">
      <Plot
        data={to_chart}
        layout={ {width: 270, height: 600, title: 'Distribution', plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)', yaxis:{title:{text:"Concentration (µM)"}}} }
      />
      </div>
    );
  }
}
export default Chart3;