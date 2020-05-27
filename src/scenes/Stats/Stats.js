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
    // number of observations of each data type
    const dataTypeData = [];
    dataTypeData.push({
      label: ["Met. concs."],
      urls: ["metabolites/summary/concentration_count/"]
    });
    dataTypeData.push({
      label: ["RNA mods"],
      urls: ["rna/summary/get_total_modifications/"]
    });
    dataTypeData.push({
      label: ["RNA half-lives"],
      urls: ["rna/summary/get_total_halflife_obs/"]
    });
    dataTypeData.push({
      label: ["Prot. abund."],
      urls: ["proteins/summary/num_obs_abundances/"]
    });
    dataTypeData.push({
      label: ["Prot. mods"],
      urls: ["proteins/summary/num_obs_modifications/"]
    });
    dataTypeData.push({
      label: ["Rxn kcat"],
      urls: ["reactions/summary/num_parameter_kcat/"]
    });
    dataTypeData.push({
      label: ["Rxn Km"],
      urls: ["reactions/summary/num_parameter_km/"]
    });
    this.setBarChart("dataType", dataTypeData);

    // number of observations from each source
    const dataSourceData = [];
    dataSourceData.push({
      label: ["Articles"],
      urls: ["rna/summary/get_distinct/?_input=halflives.reference.doi"]
    });
    // TODO: BRENDA Kis
    dataSourceData.push({
      label: ["BRENDA"],
      urls: [
        "reactions/summary/get_brenda_obs/?parameter=k_cats",
        "reactions/summary/get_brenda_obs/?parameter=k_ms" //,
        // "reactions/summary/get_brenda_obs/?parameter=k_is"
      ]
    });
    dataSourceData.push({
      label: ["ECMDB"],
      urls: ["metabolites/summary/ecmdb_conc_count/"]
    });
    dataSourceData.push({
      label: ["MODOMICS"],
      urls: ["rna/summary/get_total_modifications/"]
    });
    dataSourceData.push({
      label: ["PAXdb"],
      urls: ["proteins/summary/num_obs_abundances/"]
    });
    // TODO: protein ontology
    // dataSourceData.push({
    //   label: ["PRO"],
    //   urls: ["proteins/summary/num_obs_abundances/"]
    // });
    dataSourceData.push({
      label: ["SABIO-RK"],
      urls: ["reactions/summary/num_entries/"]
    });
    dataSourceData.push({
      label: ["YMDB"],
      urls: ["metabolites/summary/ymdb_conc_count/"]
    });
    this.setBarChart("dataSource", dataSourceData);

    // number of articles behind each type of data
    const journalByDataTypeData = [];
    journalByDataTypeData.push({
      label: ["Met. concs."],
      urls: ["metabolites/summary/get_ref_count/"]
    });
    journalByDataTypeData.push({
      label: ["Prot abund."],
      urls: ["proteins/summary/num_publications/"]
    });
    // TODO: include reaction kinetic constants
    // journalByDataTypeData.push({
    //   label: ["Rxn kinetics"],
    //   urls: ["proteins/summary/num_publications/"]
    // });
    journalByDataTypeData.push({
      label: ["RNA half-lives"],
      urls: ["rna/summary/get_distinct/?_input=halflives.reference.doi"]
    });
    this.setBarChart("journalByDataType", journalByDataTypeData);

    // temperature distribution of measurements
    this.setFrequencyChart(
      "temperatureFrequency",
      "reactions/summary/get_frequency/?field=temperature"
    );

    // pH distribution of measurements
    this.setFrequencyChart(
      "phFrequency",
      "reactions/summary/get_frequency/?field=ph"
    );
  }

  setBarChart(name, data) {
    const requests = [];
    const labels = [];
    const values = [];

    for (const bar of data) {
      for (const url of bar.urls) {
        requests.push(getDataFromApi([url]));
      }
    }

    axios.all(requests).then(
      axios.spread((...responses) => {
        let iResponse = 0;
        for (const bar of data) {
          let value = 0;
          for (let iUrl = 0; iUrl < bar.urls.length; iUrl++) {
            value += responses[iResponse].data;
            iResponse++;
          }
          values.push(value);
          labels.push(bar.label);
        }
        this.setState({ [name]: { labels: labels, values: values } });
      })
    );
  }

  setFrequencyChart(name, dataUrl) {
    const labels = [];
    const values = [];
    getDataFromApi([dataUrl]).then(response => {
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
        [name]: { labels: labels, values: values }
      });
    });
  }

  render() {
    return (
      <div className="content-container content-container-stats-scene">
        <h1 className="page-title">
          Statistics:{" "}
          <span className="highlight-accent">
            Distribution of measurements in the <i>Datanator</i> database
          </span>
        </h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <HashLink to="#data-type" scroll={scrollTo}>
                      Data types
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#immediate-source" scroll={scrollTo}>
                      Source
                    </HashLink>
                    <ul>
                      <li>
                        <HashLink to="#immediate-source" scroll={scrollTo}>
                          Immediate
                        </HashLink>
                      </li>
                      <li>
                        <HashLink to="#primary-source" scroll={scrollTo}>
                          Primary
                        </HashLink>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <HashLink to="#temperature" scroll={scrollTo}>
                      Expt. conditions
                    </HashLink>
                    <ul>
                      <li>
                        <HashLink to="#temperature" scroll={scrollTo}>
                          Temperature
                        </HashLink>
                      </li>
                      <li>
                        <HashLink to="#ph" scroll={scrollTo}>
                          pH
                        </HashLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column">
            <div className="section-columns section-3-columns">
              <div className="section section-column" id="data-type">
                <h2 className="content-block-heading">
                  Distribution of data types
                </h2>
                <div className="content-block-content">
                  <BarPlot
                    data={this.state.dataType}
                    yAxisLabel="Measurements"
                  />
                </div>
              </div>

              <div className="section section-column" id="immediate-source">
                <h2 className="content-block-heading">
                  Distribution of immediate sources
                </h2>
                <div className="content-block-content">
                  <BarPlot
                    data={this.state.dataSource}
                    yAxisLabel="Measurements"
                  />
                </div>
              </div>

              <div className="section section-column" id="primary-source">
                <h2 className="content-block-heading">
                  Dist. of primary sources
                </h2>
                <div className="content-block-content">
                  <BarPlot
                    data={this.state.journalByDataType}
                    yAxisLabel="Articles"
                  />
                </div>
              </div>
            </div>

            <div className="section-columns section-2-columns">
              <div className="section section-column" id="temperature">
                <h2 className="content-block-heading">
                  Temperature distribution
                </h2>
                <div className="content-block-content">
                  <FrequencyPlot
                    data={this.state.temperatureFrequency}
                    xAxisLabel={"Temperature (˚C)"}
                    xMin={10}
                    xMax={80}
                    yAxisLabel="Measurements"
                    kernelBandwidth={0.5}
                  />
                </div>
              </div>

              <div className="section section-column" id="ph">
                <h2 className="content-block-heading">pH distribution</h2>
                <div className="content-block-content">
                  <FrequencyPlot
                    data={this.state.phFrequency}
                    xAxisLabel={"pH"}
                    xMin={1}
                    xMax={14}
                    yAxisLabel="Measurements"
                    kernelBandwidth={0.5}
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
