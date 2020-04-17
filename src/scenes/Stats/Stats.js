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
      dataType: {
        labels: [],
        values: []
      },
      dataSource: {
        labels: [],
        values: []
      }
    };

    this.setBarChart = this.setBarChart.bind(this);
  }

  componentDidMount() {
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
  }

  setBarChart(barChartName, chartInfo) {
    console.log(chartInfo);
    const requests = [];
    const labels = [];
    const values = [];

    for (const info of chartInfo) {
      requests.push(getDataFromApi([info.url]));
    }

    axios.all(requests).then(
      axios.spread((...responses) => {
        console.log(responses);
        for (var n = 0; n < responses.length; n++) {
          console.log(responses[n].data);
          values.push(responses[n].data);
          labels.push(chartInfo[n].label + " (" + responses[n].data + ")");
        }
        this.setState({[barChartName]: { labels: labels, values: values } });
      })
    );
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
              <h2 className="content-block-heading">Number of Observations By Data Type</h2>
              <div className="content-block-content">
                <BarPlot
                  labels={this.state.dataType.labels}
                  data={this.state.dataType.values}
                />
              </div>
            </div>

            <div className="content-block section" id="section-2">
              <h2 className="content-block-heading">Number of Observations By Data Source</h2>
              <div className="content-block-content">
              <BarPlot
                  labels={this.state.dataSource.labels}
                  data={this.state.dataSource.values}
                />
              </div>
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
