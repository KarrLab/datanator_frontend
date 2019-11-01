import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
import ReactDOM from 'react-dom';
import { Input, Button, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import Chart3 from './Chart3.js';
import { Slider, Statistic } from 'antd';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import DownloadLink from "react-download-link";

import './Consensus.css';

import { ResultsTable, getSelectedData } from './ResultsTable.js';
//import { getTotalColumns } from './Columns2.js';

import { connect } from 'react-redux';

import store from '~/data/Store';
import {
  getTotalColumns,
  filter_taxon,
  set_lineage,
  refreshSelectedData,
} from '~/data/actions/resultsAction';
import {
  mean,
  median,
  mode,
  range,
  standardDeviation,
} from '~/components/Results/mathTools.js';
function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}


function JSONToCSVConvertor(JSONData, ReportTitle) {     

//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
var CSV = '';    
let ShowLabel = true
//This condition will generate the Label/Header
if (ShowLabel) {
    var row = "";

    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    CSV += row + '\r\n';
}

//1st loop is to extract each row
for (var i = 0; i < arrData.length; i++) {
    var row = "";
    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
    }
    row.slice(0, row.length - 1);
    //add a line break after each row
    CSV += row + '\r\n';
}

if (CSV == '') {        
    alert("Invalid data");
    return;
}   

//this trick will generate a temp "a" tag
var link = document.createElement("a");    
link.id="lnkDwnldLnk";

//this part will append the anchor tag and remove it after automatic click
document.body.appendChild(link);

var csv = CSV;  
return(csv)

}
/**
 * Class to render the Consensus of results. 
 * This class takes the data from the store, and summarizes the data with mean, median, range, standard deviation, and a chart at bottom. 
 * This class mostly handles the rendering, while the logic is handled elsewhere
 */


@connect(store => {
  return {
    selectedData: store.results.selectedData,
    totalData: store.results.totalData,
  };
})
class Consensus extends Component {

  static propTypes = {
    /** This prop tells the consensus what column contains the values that need to be summarized. 
     * Fo example, in metabolite concentrations, we want the summarize the value of "concentration",
     * so we need to tell the compomenet to look for the column labeled "concentration"
     */
    relevantColumn: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      consensus: [],
      mean: null,
      median: null,
      std_dev: null,
      iqr: null,
      range: null,
      asked_consensus: false,
      consensus_prompt: 'Get Consensus',
    };
    this.setMean = this.setMean.bind(this);
    this.recordData = this.recordData.bind(this);
  }

  setMean(data) {
    //console.log(data)
    var total_conc = 0;
    let total_data = [];
    for (var i = data.length - 1; i >= 0; i--) {
      //console.log(parseFloat(data[i][this.props.relevantColumn]))
      total_data.push(parseFloat(data[i][this.props.relevantColumn]));
      total_conc = total_conc + parseFloat(data[i][this.props.relevantColumn]);
    }
    var average_conc = round(total_conc / data.length, 3);
    var new_mean = round(mean(total_data), 3);
    var new_median = round(median(total_data), 3);
    var new_std_dev = round(standardDeviation(total_data), 3);
    var new_range = range(total_data);

    //var new_median = round(median(total_data), 3)
    this.setState({
      mean: new_mean,
      median: new_median,
      std_dev: new_std_dev,
      range: round(new_range[0], 3) + '-' + round(new_range[new_range.length-1], 3),
    });
  }

  recordData(){
    let response = {}
    return(JSONToCSVConvertor(JSON.stringify(this.props.totalData)))
    /*
    response["total_data"] = this.props.totalData
    response["filtered_data"] = this.props.selectedData
    response["consensus"] = {mean:this.state.mean, median:this.state.median, 
      standard_deviation:this.state.standardDeviation, range:this.state.range}
    return(response)
    */
  }

  handleUpdate() {
    this.setState({
      asked_consensus: true,
      consensus_prompt: 'Update Consensus',
    });
    this.props.dispatch(refreshSelectedData());
  }

  componentDidMount() {
    if (this.props.totalData != null) {
      this.setMean(this.props.totalData);
    }
    //this.setMean(this.props.totalData);
    //this.refs.taxonCol.applyFilter(28)
  }

  componentDidUpdate(prevProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    //this.props.dispatch(refreshSelectedData())
    if (prevProps.totalData != this.props.totalData) {
      this.setMean(this.props.totalData);
    } else if (prevProps.selectedData != this.props.selectedData) {
      this.setMean(this.props.selectedData);
    }
  }

  render() {
    console.log('Rendering Consensus');
    return (
      <div className="consensus_data">
        <img src={require('~/images/consensus.png')} />
        <Button type="primary" onClick={event => this.handleUpdate()}>
          {' '}
          {this.state.consensus_prompt}{' '}
        </Button>
        <DownloadLink
          filename="Data.csv"
          exportFile={() => this.recordData()}
      >
              Save to disk
      </DownloadLink>

        {this.state.asked_consensus && (
          <div className="summary">
            <Row >
              <Col span={22}>
                <Statistic title="Mean" value={this.state.mean} />
              </Col>
              <Col span={2}>
                <Statistic title="Median" value={this.state.median} />
              </Col>
            </Row>

            <Row>
              <Col span={15}>
                <Statistic
                  title="Standard Deviation"
                  value={this.state.std_dev}
                />
              </Col>
              <Col span={2}>
                <Statistic title="Range" value={this.state.range} />
              </Col>
            </Row>
          </div>
        )}
        <br />
        {this.state.asked_consensus && (
          <Chart3
            original_data={this.props.totalData}
            data={this.props.selectedData}
            relevantColumn={this.props.relevantColumn}
          />
        )}
      </div>
    );
  }
}

export { Consensus };
