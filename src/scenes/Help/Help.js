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
                    We are particularly interested in molecular data about
                    metabolites, DNA, RNA, proteins, complexes, and reactions
                    such as RNA abundance, protein half-lives, and RNA and
                    protein modification and localization.
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    How can I contribute to the development of <i>Datanator</i>?
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

                <div className="faq">
                  <div className="faq-q">
                    Why are mRNAs and proteins grouped by{" "}
                    <a
                      href={"https://www.genome.jp/kegg/ko.html"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      KEGG ortholog groups
                    </a>{" "}
                    rather than by gene names or UniProt ids?
                  </div>
                  <div className="faq-a">
                    To help researchers find relevant data in the face of sparse
                    measurements, one of the goals of <i>Datanator</i> is to
                    help users find potentially relevant measurements of similar
                    molecular biology (e.g., similar metabolites, RNA, proteins,
                    reactions) in similar organisms (e.g., neighboring taxa) and
                    environmental conditions (e.g., similar temperature, pH).
                    For mRNA and proteins, this is achieved by displaying
                    measurements of the mRNA/protein of interest, as well as
                    measurements of orthologous mRNAs/proteins. <i>Datanator</i>{" "}
                    uses KEGG&apos;s ortholog groups because they have wide
                    taxonomic coverage and are available in a machine-readable
                    format.
                    <i>Datanator</i> uses orthology rather than gene names to
                    identify similar mRNAs/proteins because gene names are not
                    consistent across organisms (similar genes can have
                    different names, and genes with similar names can have
                    dissimilar sequences). Similarly, <i>Datanator</i> uses
                    orthology rather than UniProt ids because each UniProt id
                    only refers to a single gene in a single organism.
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    Why does the metabolite concentration data table display
                    data for biomolecules that were not queried (e.g. ADP is
                    displayed in the page for ATP)?
                  </div>
                  <div className="faq-a">
                    To help researchers find relevant data in the face of sparse
                    measurements, <i>Datanator</i> displays measurements of the
                    queried metabolite, as well as measurements of structurally
                    similar metabolites. <i>Datanator</i> uses the{" "}
                    <a
                      href={
                        "http://openbabel.org/docs/dev/Features/Fingerprints.html"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tanimoto coefficient
                    </a>{" "}
                    to evaluate the structural similarity of metabolites. By
                    default, <i>Datanator</i> displays measurements of
                    metabolites that have Tanimoto coefficients of 0.65 or
                    higher. The &quot;Chemical similarity&quot; filter can be
                    used to narrow the displayed measurements to measurements of
                    highly similar metabolites (Tanimoto coefficient near 1).
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    How can <i>Datanator</i> help me find data from similar cell
                    types?
                  </div>
                  <div className="faq-a">
                    All the data contain information about the experimental
                    organism, which allows the user to filter by phylogenetic
                    similarity to any target organism. Protein abundance data
                    allows the user to filter by tissue type. Rate constants
                    data allows the user to filter by whether the genome is
                    wildtype or mutant.
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    How can <i>Datanator</i> help me find data from similar
                    experimental conditions?
                  </div>
                  <div className="faq-a">
                    Metabolite concentration data allows the user to filter by
                    growth media, growth phase, and growth conditions. Reaction
                    rate constants data allows users to filter by pH and
                    temperature.
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    What kinds of models or other analyses does <i>Datanator</i>
                    facilitate?
                  </div>
                  <div className="faq-a">
                    <ul>
                      <li>
                        <i>Datanator</i> can help investigators find genomic and
                        biochemical data to identify the initial conditions and
                        rate parameters of continuous and stochastic dynamical
                        models. In turn, this can help investigators construct
                        more comprehensive and more accurate models.
                      </li>
                      <li>
                        <i>Datanator</i> can help investigators improve
                        constraint-based models of metabolism by helping
                        investigators find enzyme abundances and reaction
                        velocities to constrain the predicted fluxes of chemical
                        transformation and transport reactions.
                      </li>
                      <li>
                        <i>Datanator</i> can help investigators modify models to
                        capture other organisms, tissues, and cell types by
                        helping investigators find data to re-calibrate model
                        parameters. In turn, this can help investigators compare
                        organisms, tissues, and cell types.
                      </li>
                      <li>
                        <i>Datanator</i> can also help investigators conduct
                        data-driven meta-analyses of molecular biology. For
                        example, the <i>Datanator</i> database can be used to
                        conduct multi-dimensional analyses of an individual
                        organism or conduct comparative analyses of multiple
                        organisms.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    How can I use <i>Datanator</i> to help build models?
                  </div>
                  <div className="faq-a">
                    <i>Datanator</i> can be used to:
                    <ol>
                      <li>
                        Search for a biochemical entity (metabolite, RNA,
                        protein, or reaction)
                      </li>
                      <li>
                        Filter for potentially relevant measurements of similar
                        entities in similar cells and similar environments
                      </li>
                      <li>
                        Review the potentially relevant measurements to
                        determine the relevant measurements
                      </li>
                      <li>Analyze the distribution of relevant measurements</li>
                      <li>
                        Export molecular data for model construction and
                        validation
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    Can I programmatically access the data in <i>Datanator</i>?
                  </div>
                  <div className="faq-a">
                    Yes, our REST{" "}
                    <a
                      href={"https://api.datanator.info/"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      API
                    </a>{" "}
                    can be used to programmatically access <i>Datanator</i>.
                    Please see the{" "}
                    <a
                      href={"https://api.datanator.info/"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      documentation
                    </a>{" "}
                    for more information.
                  </div>
                </div>

                <div className="faq">
                  <div className="faq-q">
                    Can I download <i>Datanator&apos;s</i> data?
                  </div>
                  <div className="faq-a">
                    Yes, <i>Datanator&apos;s</i> data is available from the{" "}
                    <a
                      href={
                        "https://open.quiltdata.com/b/karrlab/packages/karrlab/datanator/"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      datanator
                    </a>{" "}
                    Quilt data package. The data is released under the Creative
                    Commons Attribution-NonCommercial-NoDerivatives 4.0 (CC
                    BY-NC-ND 4.0){" "}
                    <a
                      href={
                        "https://open.quiltdata.com/b/karrlab/packages/karrlab/datanator/tree/latest/LICENSE"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      license
                    </a>
                    . Please see the README for the package for more
                    information. In addition, users can use the
                    <a
                      href={"https://github.com/KarrLab/datanator"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i>Datanator</i> software
                    </a>{" "}
                    to construct their own version of
                    <i>Datanator&apos;s</i> dataset. This will download the data
                    from the primary sources and parse, normalize, and integrate
                    the data into a single database.
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
