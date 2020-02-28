import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { scrollTo } from "~/utils/utils";
import LazyLoad from "react-lazyload";
import one_home from "./images/1_home.png";
import two_intermediate from "./images/2_intermediate.png";
import three_metadata from "./images/3_metadata.png";
import four_datatable from "./images/4_datatable.png";
import five_datatable from "./images/5_datatable.png";
import six_datatable from "./images/6_datatable.png";
import seven_datatable from "./images/7_datatable.png";
import eight_datatable from "./images/8_datatable.png";
import nine_excel from "./images/9_excelImage.png";

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
                  <a
                    href="https://github.com/karrlab/datanator_frontend/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon="exclamation-circle" /> Submit an
                    issue
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="content-column">
            <div className="content-block section" id="tutorial">
              <h2 className="content-block-heading">Tutorial</h2>
              <div className="content-block-content">
                <div className="tutorial">
                  <div className="tutorial-overview">
                    <i>Datanator</i> can be used to systematically discover data
                    for modeling a specific cell in a specific environment. In
                    this tutorial, we will demonstrate how <i>Datanator</i> can
                    help find data for modeling ATP in{" "}
                    <i>Bacillus subtilis subsp. subtilis</i>. The steps
                    illustrated below can be used to find data to model any
                    molecule in any other organism in any environment.
                  </div>
                  <ol className="tutorial-steps">
                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        In a seperate window, open the home page,{" "}
                        <a href="https://datanator.info">
                          https://datanator.info
                        </a>
                        . Type <q>ATP</q> in the first input box below the logo
                        and type <q>Bacillus subtilis subs. subtilis</q> in the
                        second input box. Then type <q>Enter</q> to execute the
                        search.
                      </div>
                      <div className="tutorial-step-text">
                        Typing enter will take you to the search results such as
                        shown in the next step.
                      </div>
                      <LazyLoad>
                        <img
                          src={one_home}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Click on <q>Adenosine triphosphate</q> in the{" "}
                        <q>Metabolites</q>
                        section.
                      </div>
                      <div className="tutorial-step-text">
                        The search results are organized by biomolecule type
                        (e.g., metabolites, RNAs, proteins, and reactions).
                        Click on <q>Adenosine triphosphate</q> to view the data
                        that <i>Datanator</i> has aggregated about ATP. This
                        will take you to a page with data relevant to ATP as
                        shown in the next step.
                      </div>
                      <LazyLoad>
                        <img
                          src={two_intermediate}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Read metadata about ATP at the top of the ATP page.
                      </div>
                      <div className="tutorial-step-text">
                        The top of the ATP page shows metadata about ATP such as
                        a description of ATP, synonyms for ATP, links to entries
                        about ATP in several other databases, and links to
                        pathways that ATP participates in.
                      </div>
                      <LazyLoad>
                        <img
                          src={three_metadata}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Click on the <q>Concentration</q> button in the table of
                        contents to view a table of concentration measurements
                        that may be relevant to ATP.
                      </div>
                      <div className="tutorial-step-text">
                        Each row in the concentration table represents an
                        experimental observation of the concentration of ATP or
                        a similar metabolite. The <q>Organism</q> column
                        indicates the organism in which the concentration was
                        measured. The <q>Source</q> column contains links to the
                        resources from which <i>Datanator</i> aggregated the
                        measured concentrations.
                      </div>
                      <LazyLoad>
                        <img
                          src={four_datatable}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Use the <q>Columns</q> tab to display additional columns
                        with additional metadata about each measurement.
                      </div>
                      <div className="tutorial-step-text">
                        Click on the <q>Columns</q> tab to the left of the
                        concentration table to open controls for adding and
                        removing columns. For example, click the checkbox next
                        to <q>Media</q> to display an additional column with
                        information about the growth media in which each
                        concentration was measured.
                      </div>
                      <LazyLoad>
                        <img
                          src={five_datatable}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>

                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Filter for concentrations relevant to ATP in{" "}
                        <i>Bacillus subtilis subsp. subtilis</i>.
                      </div>
                      <div className="tutorial-step-text">
                        <p>
                          Because we do not have concentration measurements for
                          every metabolite in every organism in every
                          environment, <i>Datanator</i> displays data about ATP
                          in <i>Bacillus subtilis subsp. subtilis</i>, as well
                          as data about similar metabolites in similar
                          organisms. To help users find relevant for their
                          research, <i>Datanator</i> provides filters to narrow
                          the displayed measurements by their chemical
                          similarity to ATP and taxonomic similarity to{" "}
                          <i>Bacillus subtilis subsp. subtilis</i>.{" "}
                          <i>Datanator</i> also provides filters to find data
                          measured under specific environmental conditions
                          (e.g., temperature, pH, growth media). Below, we
                          illustrate three of these filters.
                        </p>
                        <ul>
                          <li>
                            <b>Chemical similarity:</b> First, open the
                            <q>Filters</q> tab to the left of the table. Second,
                            open the <q>Chemical similarity</q> sub-tab. Next,
                            use the slider to filter for concentrations measured
                            for highly similar molecules. <i>Datanator</i> uses
                            the{" "}
                            <a
                              href={
                                "http://openbabel.org/docs/dev/Features/Fingerprints.html"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Tanimoto coefficient
                            </a>{" "}
                            to determine the similarity between the structures
                            of two metabolites. A score of 1 corresponds to two
                            identical structures.
                          </li>
                          <li>
                            <b>Taxonomic similarity:</b> Open the{" "}
                            <q>Taxonomic similarity</q> sub-tab and use the
                            slider to filter for concentrations observed in
                            similar organisms. By default, <i>Datanator</i>{" "}
                            displays data observed in any organism. The slider
                            can be used to find data only observed in{" "}
                            <i>Bacillus subtilis subsp. subtilis</i>.
                          </li>
                          <li>
                            <b>Media:</b> Open the <q>Media</q> sub-tab. The
                            checkboxes can be used to filter for concentrations
                            measured in specific media. For example, click on
                            the checkboxes next to <q>Gutnick</q> to display
                            only data observed in Gutnick media.
                          </li>
                        </ul>
                      </div>
                      <LazyLoad>
                        <img
                          src={six_datatable}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>
                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Visualize the distribution of all of the measurements or
                        a selected subset of the mesurements.
                      </div>
                      <div className="tutorial-step-text">
                        Click on the <q>Stats</q> tab to the left of the
                        concentration table to display a box plot of the
                        distribution of the measurements listed in the table.
                        Next, use the checkboxes in the table to select specific
                        measurements that you believe may be relevant to your
                        project. Once one or more measurements are selected,{" "}
                        <i>Datanator</i> will display a second box plot of the
                        distribution of the selected measurements.
                      </div>
                      <LazyLoad>
                        <img
                          src={seven_datatable}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>
                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Export the data for model construction, calibration,
                        and/or validation.
                      </div>
                      <div className="tutorial-step-text">
                        Click the <q>CSV</q> or <q>JSON</q> buttons above the
                        table to export the data in CSV or JSON format.
                      </div>
                      <LazyLoad>
                        <img
                          src={eight_datatable}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>
                    <li className="tutorial-step">
                      <div className="tutorial-step-title">
                        Use the exported data for model construction,
                        calibration, and/or validation.
                      </div>
                      <div className="tutorial-step-text">
                        For example, the exported data can be viewed in Excel.
                      </div>
                      <LazyLoad>
                        <img
                          src={nine_excel}
                          className="tutorial-screenshot"
                          alt="Identify parameters icon"
                          aria-label="Identify parameters icon"
                        />
                      </LazyLoad>
                    </li>
                  </ol>
                </div>
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
          </div>
        </div>
      </div>
    );
  }
}

export default Help;
