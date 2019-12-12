import React from 'react';
import Plot from 'react-plotly.js';

class Chart3 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let x;
    x = [];
    let total_conc;
    total_conc = [];
    let data;
    data = this.props.original_data;

    for (var i = data.length - 1; i >= 0; i--) {
      total_conc.push(parseFloat(data[i][this.props.relevantColumn]));
      x.push(1);
    }
    let to_chart;
    to_chart = [
      {
        name: 'Total',
        y: total_conc,
        type: 'box',
        mode: 'points',
        boxpoints: 'all',
        pointpos: 0,
        paper_bgcolor: 'rgb(233,233,233)',
        hoverinfo:'skip'
      },
    ];
    if (this.props.data != null) {
      if (this.props.original_data.length != this.props.data.length) {
        let total_f_conc;
        total_f_conc = [];
        for (var i = this.props.data.length - 1; i >= 0; i--) {
          total_f_conc.push(
            parseFloat(this.props.data[i][this.props.relevantColumn]),
          );
        }
        to_chart.push({
          name: 'Filtered',
          y: total_f_conc,
          type: 'box',
          mode: 'points',
          boxpoints: 'all',
          pointpos: 0,
          paper_bgcolor: 'rgb(233,233,233)',
          hoverinfo:'skip'
        });
      }
    }
    return (
      <div className="Chart3"  style={ {marginTop: -80, marginBottom:-70, marginLeft:-45}}>
        <Plot
          data={to_chart}
          layout={{
            showlegend:false,
            width: 280,
            height: 500,
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            yaxis: { title: { text: 'Concentration (µM)' }},
          }}
          config = {{displayModeBar:false}}
        />
      </div>
    );
  }
}
export default Chart3;
