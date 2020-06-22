import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { SocialIcon } from "react-social-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LazyLoad from "react-lazyload";
import { scrollTo } from "~/utils/utils";

import "./About.scss";

import lianPhoto from "./images/lian.thumb.png";
import rothPhoto from "./images/roth.thumb.png";
import karrPhoto from "./images/karr.thumb.png";

import nihIcon from "./images/nih.svg";
import nibibIcon from "./images/nibib.svg";
import nigmsIcon from "./images/nigms.svg";
import nsfIcon from "./images/nsf.svg";

class About extends Component {
  constructor(props) {
    super(props);
    this.contactEmail = process.env.REACT_APP_CONTACT_EMAIL;
  }

  render() {
    return (
      <div className="content-container content-container-about-scene">
        <h1 className="page-title">About</h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <HashLink to="#features" scroll={scrollTo}>
                      Features
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#data" scroll={scrollTo}>
                      Data types
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#searching" scroll={scrollTo}>
                      Searching
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#download" scroll={scrollTo}>
                      Data download
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#code" scroll={scrollTo}>
                      Source code
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#license" scroll={scrollTo}>
                      License
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#tech" scroll={scrollTo}>
                      Technology
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#team" scroll={scrollTo}>
                      Team
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#contribute" scroll={scrollTo}>
                      Contributing
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#acknowledgements" scroll={scrollTo}>
                      Acknowledgements
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
              <h2 className="content-block-heading">Need help?</h2>
              <div className="content-block-content">
                <div>
                  <a href={"mailto:" + this.contactEmail} subject="Datanator">
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
            <div className="content-block section" id="features">
              <h2 className="content-block-heading">Motivation and features</h2>
              <div className="content-block-content">
                <p>
                  Systems biology aims to understand how genotype influences
                  phenotype. Mechanistic models, such as{" "}
                  <a
                    href="https://www.wholecell.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    whole-cell models
                  </a>
                  , are a promising tool for understanding the molecular
                  determinants of behavior. However, it is difficult to obtain
                  the large and varied data needed for mechanistic modeling.
                  Although substantial data is already publicly available, the
                  data is difficult to obtain because it is scattered across
                  numerous databases and publications and described with
                  different identifiers, units, and formats. In addition, there
                  are few tools for finding data that is relevant to modeling a
                  specific cell in a specific environment. These barriers impede
                  mechanistic modeling.
                </p>
                <p>
                  To accelerate cell modeling, <i>Datanator</i> provides
                  researchers tools for systematically discovering the data
                  needed to model specific biochemical mechanisms in a specific
                  cell in a specific environment. <i>Datanator</i> includes an
                  integrated database of genomic and biochemical data about
                  several aspects of cells, this web application for searching
                  the database for data relevant to specific cells and
                  environments, and a REST API and Python library for
                  programmatically aggregating data for large models. The web
                  application enables investigators to search for experimental
                  measurements of biochemical parameters (e.g. metabolite
                  concentration, reaction rate, etc.) relevant to a specific
                  cell (taxon, cell type) in a specific environment (e.g.,
                  temperature, pH, growth media, etc.). For each search, this
                  web application displays a filterable and sortable list of
                  relevant experimental measurements aggregated from a range of
                  sources.
                </p>
              </div>
            </div>

            <div className="content-block section" id="data">
              <h2 className="content-block-heading">Data types and sources</h2>
              <div className="content-block-content">
                <p>
                  Currently, <i>Datanator</i> includes measured metabolite
                  concentrations, RNA modifications and half-lives, protein
                  abundances and modifications, and reaction rate parameters
                  integrated from{" "}
                  <a
                    href={"https://www.brenda-enzymes.org/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BRENDA
                  </a>
                  ,{" "}
                  <a
                    href={"http://ecmdb.ca/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ECMDB
                  </a>
                  ,{" "}
                  <a
                    href={"https://iimcb.genesilico.pl/modomics/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MODOMICS
                  </a>
                  ,{" "}
                  <a
                    href={"https://pax-db.org/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PAX-DB
                  </a>
                  , the{" "}
                  <a
                    href={"https://proconsortium.org/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Protein Ontology (PRO)
                  </a>
                  ,{" "}
                  <a
                    href={"https://sabiork.h-its.org/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SABIO-RK
                  </a>
                  ,{" "}
                  <a
                    href={"http://www.ymdb.ca/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YMDB
                  </a>
                  , and numerous publications . We aim to continually
                  incorporate additional data from additional sources.
                </p>
              </div>
            </div>

            <div
              className="content-block section search-filtering"
              id="searching"
            >
              <h2 className="content-block-heading">
                Searching and filtering for data about specific cells
              </h2>
              <div className="content-block-content">
                <p className="no-bottom-margin">
                  To help investigators find data about specific cells in
                  specific environments, <i>Datanator</i> provides multiple
                  tools for searching and filtering the integrated database.
                </p>
                <ul className="no-top-margin">
                  <li>
                    <b>Full text search:</b> Users can use the search form on
                    the home page to identify metabolites, proteins, and
                    reactions that they would like information about.
                  </li>
                  <li>
                    <b>Molecular similarity:</b> Users can identify measurements
                    of similar metabolites according to the{" "}
                    <a
                      href={
                        "http://openbabel.org/docs/dev/Features/Fingerprints.html"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tanimoto distance
                    </a>{" "}
                    of their structures. Users can identify measurements of
                    similar proteins according to their{" "}
                    <a
                      href={"https://www.genome.jp/kegg/ko.html"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      orthology
                    </a>{" "}
                    (sequence similarity). Users can identify measurements of
                    similar reactions according to their{" "}
                    <a
                      href={
                        "https://en.wikipedia.org/wiki/Enzyme_Commission_number"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enzyme Classification
                    </a>
                    .
                  </li>
                  <li>
                    <b>Phylogenetic similarity:</b> Users can identify
                    measurements observed in closely related taxa to their taxon
                    of interest by filtering measurements according to their
                    distance along the{" "}
                    <a
                      href={
                        "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      NCBI Taxonomy tree
                    </a>
                    .
                  </li>
                  <li>
                    <b>Environmental similarity:</b> Users can filter for
                    measurements from similar temperatures, pHs, and media
                    conditions to their environment of interest.
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-block section" id="download">
              <h2 className="content-block-heading">
                Downloading the <i>Datanator</i> data
              </h2>

              <div className="content-block-content">
                <p className="no-bottom-margin">
                  The data in <i>Datanator</i> is available as the{" "}
                  <a
                    href="https://open.quiltdata.com/b/karrlab/packages/karrlab/datanator"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    datanator
                  </a>{" "}
                  Quilt data package.
                </p>
              </div>
            </div>

            <div className="content-block section" id="code">
              <h2 className="content-block-heading">Source code</h2>

              <div className="content-block-content">
                <p className="no-bottom-margin">
                  The <i>Datanator</i> source code is composed of the following
                  packages. Each package is available from GitHub.
                </p>
                <ul className="no-top-margin">
                  <li>
                    <a
                      href={"https://github.com/KarrLab/datanator"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Core package
                    </a>
                  </li>
                  <li>
                    <a
                      href={"https://github.com/KarrLab/datanator_frontend"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Web application
                    </a>
                  </li>
                  <li>
                    <a
                      href={"https://github.com/KarrLab/datanator_rest_api"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      REST API
                    </a>
                  </li>
                  <li>
                    <a
                      href={"https://github.com/KarrLab/datanator_query_python"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Python API
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-block section" id="code">
              <h2 className="content-block-heading">License</h2>

              <div className="content-block-content">
                <p>
                  The <i>Datanator</i> data is released under the Creative
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
                  .
                </p>

                <p className="no-bottom-margin">
                  The <i>Datanator</i> source code is released under the MIT{" "}
                  <a
                    href={
                      "https://github.com/KarrLab/datanator/blob/master/LICENSE"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    license
                  </a>
                  . The licenses for <i>Datanator</i>&apos;s third-party
                  dependencies are described{" "}
                  <a
                    href="https://github.com/KarrLab/datanator_frontend/blob/master/LICENSE-THIRD-PARTY"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="content-block section tech" id="tech">
              <h2 className="content-block-heading">
                Technological foundation
              </h2>
              <div className="content-block-content">
                <p className="no-bottom-margin">
                  <i>Datanator</i> is implemented as a Single Page Application
                  using the technologies listed below. Please see the{" "}
                  <a
                    href="https://github.com/KarrLab/datanator_frontend/blob/master/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    README
                  </a>{" "}
                  for more information about how <i>Datanator</i> is
                  implemented, tested, and deployed.
                </p>
                <ul className="three-col-list">
                  <li>
                    <a
                      href="https://www.ag-grid.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ag-Grid
                    </a>
                    : data tables
                  </li>
                  <li>
                    <a
                      href="https://aws.amazon.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      AWS
                    </a>
                    : database hosting
                  </li>
                  <li>
                    <a
                      href="https://bruit.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      bruit.io
                    </a>
                    : feedback form
                  </li>
                  <li>
                    <a
                      href="https://www.docker.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Docker
                    </a>
                    : containers
                  </li>
                  <li>
                    <a
                      href="https://www.elastic.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Elasticsearch
                    </a>
                    : full text search
                  </li>
                  <li>
                    <a
                      href="https://flask.palletsprojects.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Flask
                    </a>
                    : framework for RESI API
                  </li>
                  <li>
                    <a
                      href="https://gunicorn.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      gunicorn
                    </a>
                    : web server
                  </li>
                  <li>
                    <a
                      href="https://heroku.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Heroku
                    </a>
                    : web hostring
                  </li>
                  <li>
                    <a
                      href="https://www.mongodb.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      MongoDB
                    </a>
                    : database engine
                  </li>
                  <li>
                    <a
                      href="https://www.netlify.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Netlify
                    </a>
                    : web hostring
                  </li>
                  <li>
                    <a
                      href="https://swagger.io/docs/specification/about/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      OpenAPI
                    </a>
                    : REST API specification
                  </li>
                  <li>
                    <a
                      href="http://openbabel.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Babel
                    </a>
                    : chemoinformatics
                  </li>
                  <li>
                    <a
                      href="https://pint.readthedocs.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      pint
                    </a>
                    : units
                  </li>
                  <li>
                    <a
                      href="https://reactjs.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      React
                    </a>
                    : web application framework
                  </li>
                  <li>
                    <a
                      href="https://requests.readthedocs.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      requests
                    </a>
                    : HTTP client
                  </li>

                  {false && (
                    <ul>
                      <li>
                        <a
                          href="https://github.com/axios/axios"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          axios
                        </a>
                        : HTTP client
                      </li>
                      <li>
                        <a
                          href="https://www.chartjs.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Chart.JS
                        </a>
                        : box plot
                      </li>
                      <li>
                        <a
                          href="https://circleci.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          CircleCI
                        </a>
                        : continuous integration
                      </li>
                      <li>
                        <a
                          href="https://coveralls.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Coveralls
                        </a>
                        : coverage analysis
                      </li>
                      <li>
                        <a
                          href="https://www.cypress.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          cypress
                        </a>
                        : end-to-end testing
                      </li>
                      <li>
                        <a
                          href="https://hub.docker.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          DockerHub
                        </a>
                        : container repository
                      </li>
                      <li>
                        <a
                          href="https://eslint.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ESLint
                        </a>
                        : JS linting
                      </li>
                      <li>
                        <a
                          href="https://fontawesome.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Font Awesome
                        </a>
                        : icons
                      </li>
                      <li>
                        <a
                          href="https://github.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                        : code repository
                      </li>
                      <li>
                        <a
                          href="https://jestjs.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Jest
                        </a>
                        : unit testing
                      </li>
                      <li>
                        <a
                          href="https://material-ui.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Material UI
                        </a>
                        : UI components
                      </li>
                      <li>
                        <a
                          href="https://prettier.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Prettier
                        </a>
                        : code formatting
                      </li>
                      <li>
                        <a
                          href="https://open.quiltdata.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Quilt
                        </a>
                        : date repository
                      </li>
                    </ul>
                  )}
                </ul>
              </div>
            </div>

            <div className="content-block section developers" id="team">
              <h2 className="content-block-heading">Development team</h2>
              <div className="content-block-content">
                <p>
                  <i>Datanator</i> was developed by the{" "}
                  <a
                    href={"https://www.karrlab.org/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    Karr Lab
                  </a>{" "}
                  at the Icahn School of Medicine at Mount Sinai in New York,
                  US.
                </p>
                <div className="developers-group main-developers">
                  <h3>Lead developers</h3>
                  <div className="main-developers-group-list">
                    <div className="main-developer">
                      <div className="main-developer-headshot-container">
                        <LazyLoad>
                          <a
                            href="https://www.linkedin.com/in/yosef-roth-a80a378a"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={rothPhoto}
                              className="hover-zoom"
                              alt="Yosef Roth headshot"
                            />
                          </a>
                        </LazyLoad>
                      </div>
                      <div className="developer-name">
                        Yosef Roth
                        <SocialIcon
                          url="https://www.linkedin.com/in/yosef-roth-a80a378a"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </div>
                    </div>
                    <div className="main-developer">
                      <div className="main-developer-headshot-container">
                        <LazyLoad>
                          <a
                            href="https://www.linkedin.com/in/zlian/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={lianPhoto}
                              className="hover-zoom"
                              alt="Zhouyang Lian headshot"
                            />
                          </a>
                        </LazyLoad>
                      </div>
                      <div className="developer-name">
                        Zhouyang Lian
                        <SocialIcon
                          url="https://www.linkedin.com/in/zlian/"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </div>
                    </div>
                    <div className="main-developer">
                      <div className="main-developer-headshot-container">
                        <LazyLoad>
                          <a
                            href="https://www.karrlab.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={karrPhoto}
                              className="hover-zoom"
                              alt="Jonathan Karr headshot"
                            />
                          </a>
                        </LazyLoad>
                      </div>
                      <div className="developer-name">
                        Jonathan Karr
                        <SocialIcon
                          url="https://www.linkedin.com/in/jonrkarr/"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="developers-group additional-developers-group">
                  <h3>Additional contributors</h3>
                  <div className="additional-developers-group-list">
                    <div className="developer-name">
                      Saahith Pochiraju
                      <SocialIcon
                        url="https://www.linkedin.com/in/saahithpochiraju/"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    </div>
                    <div className="developer-name">
                      Bilal Shaikh
                      <SocialIcon
                        url="https://www.linkedin.com/in/bilalshaikh42/"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    </div>
                    <div className="developer-name">Balazs Szigeti</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-block section developers" id="contribute">
              <h2 className="content-block-heading">
                Contributing to <i>Datanator</i>
              </h2>
              <div className="content-block-content">
                We welcome contributions to <i>Datanator</i> via GitHub{" "}
                <a
                  href="https://github.com/KarrLab/datanator/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  issues
                </a>{" "}
                or{" "}
                <a
                  href="https://github.com/KarrLab/datanator/compare"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pull requests
                </a>
                . We are particularly interested in suggestions for additional
                datasets. Please contact the developers to coordinate potential
                contributions, and please see the{" "}
                <a
                  href="https://github.com/KarrLab/datanator_frontend/blob/master/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  README
                </a>{" "}
                for information about how to install, edit, test, and run{" "}
                <i>Datanator</i> and submit pull requests.
              </div>
            </div>

            <div
              className="content-block section funding"
              id="acknowledgements"
            >
              <h2 className="content-block-heading">Acknowledgements</h2>

              <div className="content-block-content">
                <p>
                  <i>Datanator</i> was developed with support from the{" "}
                  <a
                    href={"https://reproduciblebiomodels.org/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Center for Reproducible Biomedical Modeling
                  </a>{" "}
                  from the National Institute of Bioimaging and Bioengineering
                  and the National Institute of General Medical Sciences of the
                  National Institutes of Health and the National Science
                  Foundation (awards P41EB023912 and R35GM119771).
                </p>
                <div className="funding-icons">
                  <a
                    href="https://nih.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LazyLoad>
                      <img
                        src={nihIcon}
                        className="hover-zoom"
                        title="National Institutes of Health"
                        alt="National Institutes of Health logo"
                      />
                    </LazyLoad>
                  </a>
                  <a
                    href="https://nibib.nih.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LazyLoad>
                      <img
                        src={nibibIcon}
                        className="hover-zoom"
                        title="National Institute of Bioimaging and Bioengineering"
                        alt="National Institute of Bioimaging and Bioengineering logo"
                      />
                    </LazyLoad>
                  </a>
                  <a
                    href="https://nigms.nih.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LazyLoad>
                      <img
                        src={nigmsIcon}
                        className="hover-zoom"
                        title="National Institute of General Medical Sciences"
                        alt="National Institute of General Medical Sciences logo"
                      />
                    </LazyLoad>
                  </a>
                  <a
                    href="https://nsf.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LazyLoad>
                      <img
                        src={nsfIcon}
                        className="hover-zoom"
                        title="National Science Foundation"
                        alt="National Science Foundation logo"
                      />
                    </LazyLoad>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
