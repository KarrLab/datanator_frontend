import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";
import BarPlot from "./BarPlot/BarPlot";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";

// import "./Stats.scss";

class Stats extends Component {
  constructor() {
    super();
    this.state = {
      dataTypeData: {
        concentrations: null,
        abuncances: null,
        halfLives: null,
        kcat: null,
        km: null
      },
      dataType: {
        labels: [],
        values: []
      }
    };

    //this.setValueFromURL = this.setValueFromURL.bind(this);

    this.setBarChart = this.setBarChart.bind(this);
  }
  /*
  componentDidMount() {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
    this.cancelTokenSource = axios.CancelToken.source();

    let url = "metabolites/summary/concentration_count/"
    getDataFromApi([url], { cancelToken: this.cancelTokenSource.token }).then(response => {
        let dataTypeData = this.state.dataTypeData
        dataTypeData['concentrations'] = response.data
        this.setState({ data: response.data });
    })


    //this.setState({dataTypeData:[1,4,5]})
  }
  */

  componentDidMount() {

    /*
    this.setValueFromURL(
      "dataTypeData",
      "concentrations",
      "metabolites/summary/concentration_count/"
    );
    this.setValueFromURL(
      "dataTypeData",
      "halfLives",
      "rna/summary/get_total_docs/"
    );
    this.setValueFromURL(
      "dataTypeData",
      "kcat",
      "reactions/summary/num_parameter_kcat/"
    );
    this.setValueFromURL(
      "dataTypeData",
      "km",
      "reactions/summary/num_parameter_km/"
    );

    */

    const dataTypeInfo = [];
    dataTypeInfo.push({
      label: "Metabolite concentrations",
      url: "metabolites/summary/concentration_count/"
    });
    dataTypeInfo.push({
      label: "RNA Half-Life",
      url: "rna/summary/get_total_docs/"
    });
    dataTypeInfo.push({
      label: "Kcat",
      url: "reactions/summary/num_parameter_kcat/"
    });
    dataTypeInfo.push({
      label: "Km",
      url: "reactions/summary/num_parameter_km/"
    });
    this.setBarChart("dataType", dataTypeInfo);
  }

  /*
  setValueFromURL(dictName, keyName, url) {
    console.log(keyName);

    getDataFromApi([url]).then(response => {
      let dict = this.state[dictName];
      //console.log(response.data);
      //this.state[dictName][keyName] = response.data
      dict[keyName] = response.data;
      this.setState({ dictName: response.data });
    });
  }

  */

  setBarChart(barChartName, chartInfo) {
    console.log(chartInfo)
    const requests = [];
    const labels = []
    const values = []
    //for (var i = chartInfo.length - 1; i >= 0; i--) {

    for (const info of chartInfo) {
      requests.push(getDataFromApi([info.url]));
    }
    

    axios.all(requests).then(
      axios.spread((...responses) => {
      console.log(responses)
      for (var n = 0; n < responses.length; n++) {
        console.log(responses[n].data)
        values.push(responses[n].data)
        labels.push(chartInfo[n].label + " (" + responses[n].data + ")")
      }
      this.setState({dataType:{labels:labels, values:values}})


    }));

    //this.setState({dataType:{labels:labels, values:values}})
  }

  render() {
    console.log(this.state.dataType);
    return (
      <div className="content-container content-container-stats-scene">
        <h1 className="page-title">Statistics</h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <HashLink to="#section-1" scroll={scrollTo}>
                      Section 1
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#section-2" scroll={scrollTo}>
                      Section 2
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#section-3" scroll={scrollTo}>
                      Section 3
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column">
            <div className="content-block section" id="section-1">
              <h2 className="content-block-heading">Section 1</h2>
              <div className="content-block-content">
                <BarPlot
                  labels={this.state.dataType.labels}
                  data={this.state.dataType.values}
                />
              </div>
            </div>

            <div className="content-block section" id="section-2">
              <h2 className="content-block-heading">Section 2</h2>
              <div className="content-block-content">Coming soon</div>
            </div>

            <div className="content-block section" id="section-3">
              <h2 className="content-block-heading">Section 3</h2>
              <div className="content-block-content">Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Stats;
