import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";
import BarPlot from "./Plot/BarPlot";
import FrequencyPlot from "./Plot/FrequencyPlot";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";

import "./Stats.scss";

class Stats extends Component {
  constructor() {
    super();
    this.state = {
      dataType: {
        labels: [],
        values: []
      },
      dataSource: {
        labels: [],
        values: []
      },
      journalByDataType: {
        labels: [],
        values: []
      },
      temperatureFrequency: {
        labels: [],
        values: []
      },
      phFrequency: {
        labels: [],
        values: []
      }
    };

    this.setBarChart = this.setBarChart.bind(this);
  }

  componentDidMount() {
    const dataTypeInfo = [];
    dataTypeInfo.push({
      label: "Concentrations",
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

    const dataSourceInfo = [];
    dataSourceInfo.push({
      label: "ECMDB",
      url: "metabolites/summary/ecmdb_doc_count/"
    });
    dataSourceInfo.push({
      label: "YMDB",
      url: "metabolites/summary/ymdb_doc_count/"
    });
    dataSourceInfo.push({
      label: "Sabio-RK",
      url: "reactions/summary/num_entries/"
    });
    dataSourceInfo.push({
      label: "Direct from Publicatons",
      url: "rna/summary/get_distinct/?_input=halflives.reference.doi"
    });
    this.setBarChart("dataSource", dataSourceInfo);

    const journalByDataTypeInfo = [];
    journalByDataTypeInfo.push({
      label: "Metabolite Concentrations",
      url: "metabolites/summary/get_ref_count/"
    });
    journalByDataTypeInfo.push({
      label: "RNA Half-Life",
      url: "rna/summary/get_distinct/?_input=halflives.reference.doi"
    });
    journalByDataTypeInfo.push({
      label: "Protein Abundances",
      url: "proteins/summary/num_publications/"
    });
    this.setBarChart("journalByDataType", journalByDataTypeInfo);

    this.setFrequencyChart(
      "temperatureFrequency",
      "reactions/summary/get_frequency/?field=temperature"
    );

    this.setFrequencyChart(
      "phFrequency",
      "reactions/summary/get_frequency/?field=ph"
    );
  }

  setBarChart(barChartName, chartInfo) {
    const requests = [];
    const labels = [];
    const values = [];

    for (const info of chartInfo) {
      requests.push(getDataFromApi([info.url]));
    }

    axios.all(requests).then(
      axios.spread((...responses) => {
        for (var n = 0; n < responses.length; n++) {
          values.push(responses[n].data);
          labels.push(chartInfo[n].label + " (" + responses[n].data + ")");
        }
        this.setState({ [barChartName]: { labels: labels, values: values } });
      })
    );
  }

  setFrequencyChart(frequencyChartName, url) {
    const labels = [];
    const values = [];
    getDataFromApi([url]).then(response => {
      let data = response.data.sort(function(a, b) {
        return a["_id"] - b["_id"];
      });
      for (var n = 0; n < data.length; n++) {
        if (data[n]["_id"]) {
          labels.push(data[n]["_id"]);
          values.push(data[n]["count"]);
        }
      }
      this.setState({
        [frequencyChartName]: { labels: labels, values: values }
      });
    });
  }

  render() {
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
                    <HashLink to="#data-type" scroll={scrollTo}>
                      Data Type
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#data-source" scroll={scrollTo}>
                      Data Source
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#journal-number" scroll={scrollTo}>
                      Journal Numbers
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#temp-dist" scroll={scrollTo}>
                      Temperature Distribution
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#ph-dist" scroll={scrollTo}>
                      pH Distribution
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column">
            <div className="chart-row">
              <div className="chart-column" id="data-type">
                <h2 className="content-block-heading">
                  Number of Observations By Data Type
                </h2>
                <div className="content-block-content">
                  <BarPlot
                    labels={this.state.dataType.labels}
                    data={this.state.dataType.values}
                  />
                </div>
              </div>

              <div className="chart-column" id="data-source">
                <h2 className="content-block-heading">
                  Number of Observations By Data Source
                </h2>
                <div className="content-block-content">
                  <BarPlot
                    labels={this.state.dataSource.labels}
                    data={this.state.dataSource.values}
                  />
                </div>
              </div>
            </div>

            <div className="content-block section" id="journal-number">
              <h2 className="content-block-heading">
                Referenced Journal Articles by Data Type
              </h2>
              <div className="content-block-content">
                <BarPlot
                  labels={this.state.journalByDataType.labels}
                  data={this.state.journalByDataType.values}
                />
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-column" id="temp-dist">
                <h2 className="content-block-heading">Temperature Frequency</h2>
                <div className="content-block-content">
                  <FrequencyPlot
                    labels={this.state.temperatureFrequency.labels}
                    data={this.state.temperatureFrequency.values}
                    xAxisLabel={"˚C"}
                  />
                </div>
              </div>

              <div className="chart-column" id="ph-dist">
                <h2 className="content-block-heading">pH Frequency</h2>
                <div className="content-block-content">
                  <FrequencyPlot
                    labels={this.state.phFrequency.labels}
                    data={this.state.phFrequency.values}
                    xAxisLabel={"pH"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Stats;
