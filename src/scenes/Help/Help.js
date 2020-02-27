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
                  <li>
                    <HashLink to="#walkthrough" scroll={scrollTo}>
                      Walkthrough
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
            </div>

            <div className="content-block section" id="walkthrough">
              <h2 className="content-block-heading">Walkthrough</h2>
              <div className="content-block-content">
                <div className="walkthrough">
                  <div className="overview-heading">Walkthrough overview</div>
                  <div className="overview">
                    Datanator can be used to systematically discover data for
                    modeling a specific cell in a specific environment. In this
                    walkthrough, we will be looking up data for ATP in Bacillus
                    subtilis subs subtilis The steps used in this tutorial can
                    be replicated with any biomolecule of interest in any other
                    organism or environment.
                  </div>
                  <ol className="tutorial">
                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        In a seperate window, open up the home page. Type{" "}
                        <q>ATP</q> in the first search bar and type{" "}
                        <q>Bacillus subtilis subs. subtilis</q> in the second
                        search bar. Enter the search
                      </div>
                      <div className="tutorial-step-text">
                        This will lead to a search results page in step 2.
                      </div>
                      <object
                        data={one_home}
                        className="section-column-icon"
                        alt="Identify parameters icon"
                        aria-label="Identify parameters icon"
                      />
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Click on Adenosine triphosphate in the Metabolites
                        section
                      </div>
                      <div className="tutorial-step-text">
                        The search results page organizes the results by
                        biomolecule type. Currently, you can browse through
                        metabolites, RNAs, proteins, and reactions. Clicking on
                        Adenosine triphosphate will bring you to the data page
                        in step 3.
                      </div>
                      <object
                        data={two_intermediate}
                        className="section-column-icon"
                        alt="Identify parameters icon"
                        aria-label="Identify parameters icon"
                      />
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Read the metadata. To view concentration data, click on
                        <q>Concentration</q> in the table of contents or scroll
                        down
                      </div>
                      <div className="tutorial-step-text">
                        The top of the page has metadata about ATP. You can
                        browse the description, synonyms, external database
                        links, and related pathways. Scroll to the bottom of the
                        page to get to step 4.
                      </div>
                      <object
                        data={three_metadata}
                        className="section-column-icon"
                        alt="Identify parameters icon"
                        aria-label="Identify parameters icon"
                      />
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Read the Data Table
                      </div>
                      <div className="tutorial-step-text">
                        The table has data about ATP concentrations. Each row in
                        this table corresponds to an experimental observation of
                        ATP. The source column contains links to the data
                        <span>&#39;</span>s online location. Note that although
                        this page is for ATP, the table contains data about
                        structurally similar molecules as well (e.g. Adenosine
                        monophosphate). This is allow the user to filter to
                        include/exlude structurally similar molecules. The
                        filters will be explained in step 5.
                        <ol>
                          <li>Columns - choose which columns to display</li>
                          <li>Filters - filter data on the table</li>
                          <li>Stats - see summary statistics of the data</li>
                          <li>Export - export the data to CSV or JSON</li>
                        </ol>
                      </div>
                      <object
                        data={four_datatable}
                        className="section-column-icon"
                        alt="Identify parameters icon"
                        aria-label="Identify parameters icon"
                      />
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">Filter the data</div>
                      <div className="tutorial-step-text">
                        The data can be filtered by similar entities (e.g., by
                        structural similarity) relatedness of the organisms (by
                        phylogenetic distance) and by similar environments
                        (e.g., temperature, pH). In this walkthrough, we will
                        use three filters:
                        <ol>
                          <li>
                            Chemical similarity - you can filter by the
                            structural similarity of the molecules to ATP. 1
                            would be structurally identical (only ATP), and 6.5
                            would include many structurally similar molecules.
                            The score corresponds to a{" "}
                            <a
                              href={
                                "http://openbabel.org/docs/dev/Features/Fingerprints.html"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              tanimoto similarity score
                            </a>
                            .
                          </li>
                          <li>
                            Taxonomic distance - the initial search was for
                            Bacillus subtilis subsp. subtilis. This filter lets
                            you filter the data for taxonomic distance. Each
                            node on the slider corresponds to a classification.
                            Right now, the slider is set to include all data
                            from the kingdom Bacteria.
                          </li>
                          <li>
                            Media - you can filter by media type. Try{" "}
                            <q>gutnick</q>
                            for example.
                          </li>
                        </ol>
                      </div>
                      <object
                        data={five_datatable}
                        className="section-column-icon"
                        alt="Identify parameters icon"
                        aria-label="Identify parameters icon"
                      />
                    </li>
                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Select Specific Data Points and Analyze
                      </div>
                      <div className="tutorial-step-text">
                        Click on <q>Stats</q> in the left-hand toolbar. This
                        will show summary statistics of the total data,
                        including the data that was filtered out in the previous
                        step. Then click on the boxes on the table to select
                        them. As the boxes are selected, the stats toolbar will
                        display summary statistics of the selected data. This
                        allows you to filter and then select specific data
                        points, and then compare its distribution to the total
                        data.
                      </div>
                      <object
                        data={six_datatable}
                        className="section-column-icon"
                        alt="Identify parameters icon"
                        aria-label="Identify parameters icon"
                      />
                    </li>
                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Export molecular data for model construction and
                        validation.
                      </div>
                      <div className="tutorial-step-text">
                        Click <q>CSV</q> in the upper right corner of the table.
                        The data can also be exported as a JSON.
                      </div>
                      <object
                        data={seven_datatable}
                        className="section-column-icon"
                        alt="Identify parameters icon"
                        aria-label="Identify parameters icon"
                      />
                    </li>
                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        View the data in Excel.
                      </div>
                      <div className="tutorial-step-text">
                        The data can now be saved.
                      </div>
                      <object
                        data={eight_excel}
                        className="section-column-icon"
                        alt="Identify parameters icon"
                        aria-label="Identify parameters icon"
                      />
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
