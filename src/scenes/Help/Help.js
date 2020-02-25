import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { scrollTo } from "~/utils/utils";
import one_home from "./images/1_home.png";
import two_intermediate from "./images/2_intermediate.png";
import three_metadata from "./images/3_metadata.png";
import four_datatable from "./images/4_datatable.png";
import five_datatable from "./images/5_datatable.png";
import six_datatable from "./images/6_datatable.png";
import seven_datatable from "./images/7_datatable.png";
import eight_excel from "./images/8_excelImage.png";



import "./Help.scss";

class Help extends Component {
  render() {
    return (
      <div className="content-container content-container-help-scene">
        <h1 className="page-title">Help</h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <HashLink to="#tutorial" scroll={scrollTo}>
                      Tutorial
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#faq" scroll={scrollTo}>
                      FAQ
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Citing us</h2>
              <div className="content-block-content">
                Please check back soon for citation information.
              </div>
            </div>

            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Need more help?</h2>
              <div className="content-block-content">
                <div>
                  <a href="mailto:info@karrlab.org">
                    <FontAwesomeIcon icon="envelope" /> Contact us
                  </a>
                </div>
                <div>
                  <a href="https://github.com/karrlab/datanator_frontend/issues">
                    <FontAwesomeIcon icon="exclamation-circle" /> Submit an
                    issue
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="content-column" id="tutorial">
            <div className="content-block section">
              <h2 className="content-block-heading">Tutorial</h2>
              <div className="content-block-content">
                <ol className="tutorial">
                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Search for a biochemical entity (metabolite, RNA, protein,
                      or reaction)
                    </div>
                    <div className="tutorial-step-text">
                      Use the search form at the top to search for measurements
                      of a metabolite, RNA, protein, or reaction relevant to a
                      specific organism.
                    </div>
                  </li>

                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Filter for potentially relevant measurements of similar
                      entities in similar cells and similar environments.
                    </div>
                    <div className="tutorial-step-text">
                      Select a metabolite, RNA, protein, or reaction class (e.g,
                      KEGG ortholog group) to obtain potentially relevant
                      measurements to the entity of interest. Then filter for
                      data about similar entities (e.g., by sequence similarity)
                      measured in similar organisms (by phylogenetic distance)
                      and environments (e.g., temperature, pH).
                    </div>
                  </li>

                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Review the potentially relevant measurements to determine
                      the relevant measurements.
                    </div>
                    <div className="tutorial-step-text">
                      Inspect each potentially relevant measurement and select
                      the most relevant measurements to the entity and organism
                      of interest.
                    </div>
                  </li>

                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Analyze the distribution of relevant measurements.
                    </div>
                    <div className="tutorial-step-text">
                      Review box plots and statistical properties of the
                      selected and potentially relevant measurements.
                    </div>
                  </li>

                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Export molecular data for model construction and
                      validation.
                    </div>
                    <div className="tutorial-step-text">
                      Export the selected measurements, or all of the
                      measurements, in JSON format for further analysis such as
                      model construction or validation.
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <div className="content-block section" id="faq">
              <h2 className="content-block-heading">
                Frequently asked questions
              </h2>
              <div className="content-block-content">
                <div className="faq">
                  <div className="faq-q">
                    How can I contribute data to <i>Datanator</i>?
                  </div>
                  <div className="faq-a">
                    Please{" "}
                    <HashLink to="#contact-info" scroll={scrollTo}>
                      contact us
                    </HashLink>{" "}
                    to discuss how to integrate your data into <i>Datanator</i>.
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    How can I contribute to <i>Datanator</i>?
                  </div>
                  <div className="faq-a">
                    We would love to work together to aggregate for biomodeling.
                    Please{" "}
                    <HashLink to="#contact-info" scroll={scrollTo}>
                      contact us
                    </HashLink>{" "}
                    to discuss how to get involved.
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    How can I cite <i>Datanator</i>?
                  </div>
                  <div className="faq-a">
                    We aim to submit an article for publication and to a
                    pre-printer server in 2020. Please check back later this
                    year for more information.
                  </div>
                </div>

              </div>
              <div className="content-block section">
              <h2 className="content-block-heading">Walkthrough</h2>
              <div className="content-block-content">
                <ol className="tutorial">
                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      In a seperate window, open up the home page. In the search bar, enter ATP and Bacillus subtilis subs subtilis.
                    </div>
                    <object
                      data={one_home}
                      className="section-column-icon"
                      alt="Identify parameters icon"
                      aria-label="Identify parameters icon"
                    />
                    <div className="tutorial-step-text">
                      Use the search form at the top to search for measurements
                      of a metabolite, RNA, protein, or reaction relevant to a
                      specific organism.
                    </div>
                  </li>

                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Filter for potentially relevant measurements of similar
                      entities in similar cells and similar environments.
                    </div>
                    <object
                      data={two_intermediate}
                      className="section-column-icon"
                      alt="Identify parameters icon"
                      aria-label="Identify parameters icon"
                    />
                    <div className="tutorial-step-text">
                      Select a metabolite, RNA, protein, or reaction class (e.g,
                      KEGG ortholog group) to obtain potentially relevant
                      measurements to the entity of interest. Then filter for
                      data about similar entities (e.g., by sequence similarity)
                      measured in similar organisms (by phylogenetic distance)
                      and environments (e.g., temperature, pH).
                    </div>
                  </li>

                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Review the potentially relevant measurements to determine
                      the relevant measurements.
                    </div>
                    <object
                      data={three_metadata}
                      className="section-column-icon"
                      alt="Identify parameters icon"
                      aria-label="Identify parameters icon"
                    />
                    <div className="tutorial-step-text">
                      Inspect each potentially relevant measurement and select
                      the most relevant measurements to the entity and organism
                      of interest.
                    </div>
                  </li>

                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Analyze the distribution of relevant measurements.
                    </div>
                    <object
                      data={four_datatable}
                      className="section-column-icon"
                      alt="Identify parameters icon"
                      aria-label="Identify parameters icon"
                    />
                    <div className="tutorial-step-text">
                      Review box plots and statistical properties of the
                      selected and potentially relevant measurements.
                    </div>
                  </li>

                  <li className="tutorial-step">
                    <div className="tutorial-step-title">
                      Export molecular data for model construction and
                      validation.
                    </div>
                    <div className="tutorial-step-text">
                      Export the selected measurements, or all of the
                      measurements, in JSON format for further analysis such as
                      model construction or validation.
                    </div>
                  </li>
                </ol>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Help;
