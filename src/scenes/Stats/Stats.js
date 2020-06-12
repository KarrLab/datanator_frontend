import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";
import BarPlot from "./Plot/BarPlot";
import FrequencyPlot from "./Plot/FrequencyPlot";
import axios from "axios";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";

import "./Stats.scss";

class Stats extends Component {
  constructor() {
    super();
    this.state = {
      dataType: {
        labels: [],
        values: [],
      },
      dataSource: {
        labels: [],
        values: [],
      },
      journalByDataType: {
        labels: [],
        values: [],
      },
      taxonomy: {
        labels: [],
        values: [],
      },
      temperatureFrequency: {
        labels: [],
        values: [],
      },
      phFrequency: {
        labels: [],
        values: [],
      },
    };

    this.setBarChart = this.setBarChart.bind(this);
  }

  componentDidMount() {
    // number of observations of each data type
    const dataTypeData = [];
    dataTypeData.push({
      label: ["Met. concs."],
      urls: ["metabolites/summary/concentration_count/"],
    });
    dataTypeData.push({
      label: ["RNA mods"],
      urls: ["rna/summary/get_total_modifications/"],
    });
    dataTypeData.push({
      label: ["RNA half-lives"],
      urls: ["rna/summary/get_total_halflife_obs/"],
    });
    dataTypeData.push({
      label: ["Prot. abund."],
      urls: ["proteins/summary/num_obs_abundances/"],
    });
    dataTypeData.push({
      label: ["Prot. mods"],
      urls: ["proteins/summary/num_obs_modifications/"],
    });
    dataTypeData.push({
      label: ["Rxn kcat"],
      urls: ["reactions/summary/num_parameter_kcat/"],
    });
    dataTypeData.push({
      label: ["Rxn Km"],
      urls: ["reactions/summary/num_parameter_km/"],
    });
    this.setBarChart("dataType", dataTypeData);

    // number of observations from each source
    const dataSourceData = [];
    dataSourceData.push({
      label: ["Articles"],
      urls: ["rna/summary/get_distinct/?_input=halflives.reference.doi"],
    });
    // TODO: BRENDA Kis
    dataSourceData.push({
      label: ["BRENDA"],
      urls: [
        "reactions/summary/get_brenda_obs/?parameter=k_cats",
        "reactions/summary/get_brenda_obs/?parameter=k_ms", //,
        // "reactions/summary/get_brenda_obs/?parameter=k_is"
      ],
    });
    dataSourceData.push({
      label: ["ECMDB"],
      urls: ["metabolites/summary/ecmdb_conc_count/"],
    });
    dataSourceData.push({
      label: ["MODOMICS"],
      urls: ["rna/summary/get_total_modifications/"],
    });
    dataSourceData.push({
      label: ["PAXdb"],
      urls: ["proteins/summary/num_obs_abundances/"],
    });
    dataSourceData.push({
      label: ["PRO"],
      urls: ["proteins/summary/num_obs_abundances/"],
    });
    dataSourceData.push({
      label: ["SABIO-RK"],
      urls: [
        "reactions/summary/get_sabio_obs/?parameter=k_cats",
        "reactions/summary/get_sabio_obs/?parameter=k_ms",
        "reactions/summary/get_sabio_obs/?parameter=k_is",
      ],
    });
    dataSourceData.push({
      label: ["YMDB"],
      urls: ["metabolites/summary/ymdb_conc_count/"],
    });
    this.setBarChart("dataSource", dataSourceData);

    // number of articles behind each type of data
    const journalByDataTypeData = [];
    journalByDataTypeData.push({
      label: ["Met. concs."],
      urls: [
        "metabolites/summary/ecmdb_ref_count/",
        "metabolites/summary/ymdb_ref_count/",
        "metabolites/summary/curated_ref_count/",
      ],
    });
    journalByDataTypeData.push({
      label: ["Prot abund."],
      urls: ["proteins/summary/num_publications/"],
    });
    journalByDataTypeData.push({
      label: ["Rxn kinetics"],
      urls: ["/reactions/summary/num_refs/"],
    });
    journalByDataTypeData.push({
      label: ["RNA half-lives"],
      urls: ["rna/summary/get_distinct/?_input=halflives.reference.doi"],
    });
    this.setBarChart("journalByDataType", journalByDataTypeData);

    // taxonomic distribution of measurements
    const taxonomicUrl =
      "https://raw.githubusercontent.com/KarrLab/datanator_query_python/testapi/docs/taxon_distribution_frontend.json";
    axios
      .get(taxonomicUrl)
      .then((response) => {
        const organismCountsDict = {};
        for (const organismLong in response.data) {
          if (organismLong !== "others") {
            const organismParts = organismLong.split(" ");
            const organismShort =
              organismParts[0].substr(0, 1) + ". " + organismParts[1];

            if (!(organismShort in organismCountsDict)) {
              organismCountsDict[organismShort] = 0;
            }
            organismCountsDict[organismShort] += response.data[organismLong];
          }
        }

        const organismCountsArr = [];
        for (const organism in organismCountsDict) {
          organismCountsArr.push({
            organism: organism,
            count: organismCountsDict[organism],
          });
        }
        organismCountsArr.sort((a, b) => {
          if (a.count < b.count) {
            return 1;
          } else if (a.count > b.count) {
            return -1;
          } else {
            return 0;
          }
        });

        const labels = [];
        const values = [];
        for (const organismCount of organismCountsArr) {
          labels.push(organismCount.organism);
          values.push(organismCount.count);
        }
        labels.push("Other");
        values.push(response.data["others"]);

        this.setState({
          taxonomy: {
            labels: labels,
            values: values,
          },
        });
      })
      .catch((error) => {
        genApiErrorHandler(
          [taxonomicUrl],
          "Unable to get taxonomic distribution of measurements."
        )(error);
      });

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
    getDataFromApi([dataUrl]).then((response) => {
      let data = response.data.sort(function (a, b) {
        return a["_id"] - b["_id"];
      });
      for (var n = 0; n < data.length; n++) {
        if (data[n]["_id"]) {
          labels.push(data[n]["_id"]);
          values.push(data[n]["count"]);
        }
      }
      this.setState({
        [name]: { labels: labels, values: values },
      });
    });
  }

  render() {
    return (
      <div className="content-container content-container-stats-scene">
        <h1 className="page-title">
          Statistics:{" "}
          <span className="highlight-accent">
            Distribution of the measurements in the <i>Datanator</i> database
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
                    <HashLink to="#taxa" scroll={scrollTo}>
                      Taxa
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#temperature" scroll={scrollTo}>
                      Env. conditions
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
                  <li>
                    <HashLink to="#immediate-source" scroll={scrollTo}>
                      Sources
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
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column">
            <div className="section-columns section-2-columns">
              <div className="section section-column" id="data-type">
                <h2 className="content-block-heading">
                  Distribution of the types of the measurements
                </h2>
                <div className="content-block-content">
                  <BarPlot
                    data={this.state.dataType}
                    yAxisLabel="Measurements"
                  />
                </div>
              </div>

              <div className="section section-column" id="taxa">
                <h2 className="content-block-heading">
                  Taxonomic distribution of the measurements
                </h2>
                <div className="content-block-content">
                  <BarPlot
                    data={this.state.taxonomy}
                    yAxisLabel="Measurements"
                  />
                </div>
              </div>
            </div>

            <div className="section-columns section-2-columns">
              <div className="section section-column" id="temperature">
                <h2 className="content-block-heading">
                  Temperature distribution of the measurements
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
                <h2 className="content-block-heading">
                  pH distribution of the measurements
                </h2>
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

            <div className="section-columns section-2-columns">
              <div className="section section-column" id="immediate-source">
                <h2 className="content-block-heading">
                  Distribution of the immediate sources of the data
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
                  Distribution of the primary sources of the data
                </h2>
                <div className="content-block-content">
                  <BarPlot
                    data={this.state.journalByDataType}
                    yAxisLabel="Articles"
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
