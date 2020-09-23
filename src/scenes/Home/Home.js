import React, { Component } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";

import SearchForm from "~/components/SearchForm/SearchForm";
import LazyLoad from "react-lazyload";

import "~/scenes/Home/Home.scss";
import logo from "./images/logo.svg";

import metaboliteIcon from "./images/molecule.svg";
import rnaIcon from "./images/trna.svg";
import proteinIcon from "./images/protein.svg";
import reactionIcon from "./images/left-right-arrows.svg";

import searchIcon from "./images/search.svg";
import filterIcon from "./images/filter.svg";
import reviewIcon from "./images/binoculars.svg";
import analyzeIcon from "./images/analyze.svg";
import exportIcon from "./images/export.svg";

import identifyUseCaseIcon from "./images/line-chart.svg";
import constrainUseCaseIcon from "./images/flux-cone.svg";
import recalibrateUseCaseIcon from "./images/dna.svg";
import dataDrivenUseCaseIcon from "./images/neural-network.svg";

import karrLabIcon from "./images/karr-lab.svg";
import crbmIcon from "./images/crbm.svg";
import sinaiIcon from "./images/sinai.svg";

import nihIcon from "../About/images/nih.svg";
import nibibIcon from "../About/images/nibib.svg";
import nigmsIcon from "../About/images/nigms.svg";
import nsfIcon from "../About/images/nsf.svg";

import agGridIcon from "./images/tech/ag-grid.svg";
import awsIcon from "./images/tech/aws.svg";
import bruitIoIcon from "./images/tech/bruit-io.svg";
import dockerIcon from "./images/tech/docker.svg";
import elasticsearchIcon from "./images/tech/elasticsearch.svg";
import flaskIcon from "./images/tech/flask.svg";
import herokuIcon from "./images/tech/heroku.svg";
import gunicornIcon from "./images/tech/gunicorn.svg";
import mongoDbIcon from "./images/tech/mongodb.svg";
import netlifyIcon from "./images/tech/netlify.svg";
import openapiIcon from "./images/tech/open-api.svg";
import openbabelIcon from "./images/tech/open-babel.png";
import pintIcon from "./images/tech/pint.png";
import reactIcon from "./images/tech/react.svg";
import requestsIcon from "./images/tech/requests.png";

class Home extends Component {
  render() {
    return (
      <div className="content-container full-width-content-container content-container-home-scene">
        <div className="section intro">
          <div className="section-inner-container">
            <div className="logo-title">
              <div className="logo-container">
                <LazyLoad>
                  <object
                    data={logo}
                    className="logo"
                    alt="Datanator logo"
                    aria-label="Datanator logo"
                  />
                </LazyLoad>
              </div>
              <h1>Datanator</h1>
            </div>
            <h2>
              Tools for discovering data for modeling cellular biochemistry
            </h2>
            <SearchForm />
            <div className="examples">
              <b>Examples</b>
              <div>
                Metabolites –{" "}
                <ul className="comma-separated-list">
                  <li>
                    Name: <Link to="/search/Adenosine/">Adenosine</Link>
                  </li>
                  <li>
                    ChEBI id: <Link to="/search/16335/">16335</Link>
                  </li>
                  <li>
                    PubChem id: <Link to="/search/60961/">60961</Link>
                  </li>
                  <li>
                    InChI key:{" "}
                    <Link
                      className="truncate"
                      to={'/search/"OIRDTQYFTABQOQ-KQYNXXCUSA-N"/'}
                    >
                      &quot;OIRDTQYFTABQOQ-KQYNXXCUSA-N&quot;
                    </Link>
                  </li>
                  <li>
                    SMILES:{" "}
                    <Link
                      className="truncate"
                      to={
                        '/search/"[H]OC([H])([H])[C@@]1([H])O[C@@]([H])(N2C([H])=NC3=C2N=C([H])N=C3N([H])[H])[C@]([H])(O[H])[C@]1([H])O[H]"/'
                      }
                    >
                      &quot;[H]OC([H])([H])[C@@]1([H])O[C@@]([H])(N2C([H])=NC3=C2N=C([H])N=C3N([H])[H])[C@]([H])(O[H])[C@]1([H])O[H]&quot;
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                Genes –{" "}
                <ul className="comma-separated-list">
                  <li>
                    Symbol: <Link to="/search/GLUD1/">GLUD1</Link>
                  </li>
                  <li>
                    Name:{" "}
                    <Link to="/search/Glutamate dehydrogenase/">
                      Glutamate dehydrogenase
                    </Link>
                  </li>
                  <li>
                    NCBI Gene id: <Link to="/search/2746/">2746</Link>
                  </li>
                  <li>
                    KEGG id: <Link to="/search/K00261/">K00261</Link>
                  </li>
                  <li>
                    UniProt id: <Link to="/search/P00367/">P00367</Link>
                  </li>
                </ul>
              </div>
              <div>
                Reactions –{" "}
                <ul className="comma-separated-list">
                  <li>
                    Name:{" "}
                    <Link to="/search/Glucose-6-phosphatase/">
                      Glucose-6-phosphatase
                    </Link>
                  </li>
                  <li>
                    EC number: <Link to="/search/3.1.3.9/">3.1.3.9</Link>
                  </li>
                  <li>
                    Reactants/products:{" "}
                    <Link to="/search/D-glucose/">D-glucose</Link>
                  </li>
                </ul>
              </div>
            </div>
            <p>
              <i>Datanator</i> is a free and open toolkit for discovering the
              data needed to build, calibrate, and validate mechanistic models
              of cells. <i>Datanator</i> is composed of an integrated database
              of genomic and biochemical data, this web application for
              identifying relevant data for modeling a specific organism in a
              specific environmental condition, and a{" "}
              <a
                href={process.env.REACT_APP_REST_SERVER}
                target="_blank"
                rel="noopener noreferrer"
              >
                REST API
              </a>{" "}
              for programmatically discovering data for large models such as{" "}
              <a
                href="https://www.wholecell.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                whole-cell models
              </a>
              .
            </p>
          </div>
        </div>

        <div className="section use-cases">
          <div className="section-inner-container">
            <h2 className="section-title">
              Use cases:{" "}
              <span className="highlight-primary">
                construct and validate comprehensive models
              </span>
            </h2>
            <div className="section-title-separator"></div>
            <div className="section-columns section-4-columns">
              <div className="section-column">
                <div className="section-column-icon-container">
                  <LazyLoad>
                    <object
                      data={identifyUseCaseIcon}
                      className="section-column-icon"
                      alt="Identify parameters icon"
                      aria-label="Identify parameters icon"
                    />
                  </LazyLoad>
                </div>
                <div className="section-column-subtitle">Kinetic models</div>
                <div className="section-column-title">
                  Identify initial conditions and rate parameters
                </div>
                <div className="section-column-description">
                  <i>Datanator</i> can help investigators find genomic and
                  biochemical data to identify the initial conditions and rate
                  parameters of continuous and stochastic dynamical models. In
                  turn, this can help investigators construct more comprehensive
                  and more accurate models.
                </div>
              </div>

              <div className="section-column">
                <div className="section-column-icon-container">
                  <LazyLoad>
                    <object
                      data={constrainUseCaseIcon}
                      className="section-column-icon"
                      alt="Constrain models icon"
                      aria-label="Constrain models icon"
                    />
                  </LazyLoad>
                </div>
                <div className="section-column-subtitle">
                  Constraint-based models
                </div>
                <div className="section-column-title">
                  Add enzyme abundance and reaction rate constraints
                </div>
                <div className="section-column-description">
                  <i>Datanator</i> can help investigators improve
                  constraint-based models of metabolism by helping investigators
                  find enzyme abundances and reaction velocities to constrain
                  the predicted fluxes of chemical transformation and transport
                  reactions.
                </div>
              </div>

              <div className="section-column">
                <div className="section-column-icon-container">
                  <LazyLoad>
                    <object
                      data={recalibrateUseCaseIcon}
                      className="section-column-icon"
                      alt="Recalibrate models icon"
                      aria-label="Recalibrate models icon"
                    />
                  </LazyLoad>
                </div>
                <div className="section-column-subtitle">
                  Quantitative models
                </div>
                <div className="section-column-title">
                  Re-calibrate models to capture other cells
                </div>
                <div className="section-column-description">
                  <i>Datanator</i> can help investigators modify models to
                  capture related organisms, tissues, and cell types by helping
                  investigators find data to re-calibrate model parameters. In
                  turn, this can help investigators compare organisms, tissues,
                  and cell types.
                </div>
              </div>

              <div className="section-column">
                <div className="section-column-icon-container">
                  <LazyLoad>
                    <object
                      data={dataDrivenUseCaseIcon}
                      className="section-column-icon"
                      alt="Recalibrate models icon"
                      aria-label="Recalibrate models icon"
                    />
                  </LazyLoad>
                </div>
                <div className="section-column-subtitle">
                  Data-driven models
                </div>
                <div className="section-column-title">
                  Meta-analyze multiple organisms and data types
                </div>
                <div className="section-column-description">
                  <i>Datanator</i> can help investigators conduct data-driven
                  meta-analyses of molecular biology. For example, the{" "}
                  <i>Datanator</i> database can be used to conduct
                  multi-dimensional analyses of an individual organism or
                  conduct comparative analyses of multiple organisms.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section data-types">
          <div className="section-inner-container">
            <h2 className="section-title">
              <span className="highlight-primary">Integrated database</span> of
              data for biochemical analysis and modeling
            </h2>
            <div className="section-title-separator"></div>
            <div className="section-columns section-4-columns">
              <div className="section-column">
                <div className="section-column-icon-container">
                  <LazyLoad>
                    <object
                      data={metaboliteIcon}
                      className="section-column-icon"
                      alt="Metabolite icon"
                      aria-label="Metabolite icon"
                    />
                  </LazyLoad>
                </div>
                <div className="section-column-title highlight-primary">
                  Metabolites
                </div>
                <div className="section-column-subsection-title">
                  Concentrations
                </div>
                <div className="section-column-description">
                  3,841 measurements of 1,621 metabolites in 4 organisms
                  aggregated from{" "}
                  <a
                    href="http://ecmdb.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ECMDB,
                  </a>{" "}
                  <a
                    href="http://www.ymdb.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YMDB
                  </a>
                  , and various publications.
                </div>
              </div>

              <div className="section-column">
                <div className="section-column-icon-container">
                  <LazyLoad>
                    <object
                      data={rnaIcon}
                      className="section-column-icon"
                      alt="RNA icon"
                      aria-label="RNA icon"
                    />
                  </LazyLoad>
                </div>
                <div className="section-column-title highlight-primary">
                  RNAs
                </div>
                <div className="section-column-subsection-title">
                  Modifications
                </div>
                <div className="section-column-description">
                  Reconstructed modification profiles of 19 rRNA and 580 tRNA
                  integrated by{" "}
                  <a
                    href="https://iimcb.genesilico.pl/modomics/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MODOMICS
                  </a>
                </div>

                <div className="section-column-subsection-title">
                  Half-lives
                </div>
                <div className="section-column-description">
                  75,836 measurements aggregated from 10 publications.
                </div>

                <div className="section-column-subsection-title">
                  Localizations &ndash; coming soon
                </div>
                <div className="section-column-description">
                  Nearly 1,000,000 localizations aggregated from{" "}
                  <a
                    href="http://www.rna-society.org/rnalocate/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    RNALocate
                  </a>
                  ,{" "}
                  <a
                    href="http://lncatlas.crg.eu/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    lncATLAS
                  </a>
                  , and 1 publication.
                </div>
              </div>

              <div className="section-column">
                <div className="section-column-icon-container">
                  <LazyLoad>
                    <object
                      data={proteinIcon}
                      className="section-column-icon"
                      alt="Protein icon"
                      aria-label="Protein icon"
                    />
                  </LazyLoad>
                </div>
                <div className="section-column-title highlight-primary">
                  Proteins
                </div>

                <div className="section-column-subsection-title">
                  Abundances
                </div>
                <div className="section-column-description">
                  2,634,941 measurements of 846,970 proteins from 20,689
                  ortholog groups in 55 organisms aggregated from{" "}
                  <a
                    href="https://pax-db.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PAXdb
                  </a>{" "}
                  and organized with metadata from{" "}
                  <a
                    href="https://www.genome.jp/kegg/ko.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    KEGG Orthology
                  </a>
                  , and{" "}
                  <a
                    href="https://www.uniprot.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UniProt
                  </a>
                </div>

                <div className="section-column-subsection-title">
                  Modifications
                </div>
                <div className="section-column-description">
                  Reconstructed modification profiles of 4,083 proteins
                  integrated by the{" "}
                  <a
                    href="https://proconsortium.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Protein Ontology (PRO)
                  </a>
                  .
                </div>

                <div className="section-column-subsection-title">
                  Localizations &ndash; coming soon
                </div>
                <div className="section-column-description">
                  Over 100,000 observed and predicted localizations aggregated
                  from{" "}
                  <a
                    href="http://gpcr.biocomp.unibo.it/esldb/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    eSLDB
                  </a>
                  ,{" "}
                  <a
                    href="https://www.proteinatlas.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    The Human Protein Atlas
                  </a>
                  ,{" "}
                  <a
                    href="https://db.psort.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PSORTdb
                  </a>
                  , and{" "}
                  <a
                    href="https://www.subcellbarcode.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SubCell
                  </a>
                  .
                </div>

                <div className="section-column-subsection-title">
                  Half-lives &ndash; coming soon
                </div>
                <div className="section-column-description">
                  More than 50,000 measurements curated from 9 publications.
                </div>
              </div>

              <div className="section-column">
                <div className="section-column-icon-container">
                  <LazyLoad>
                    <object
                      data={reactionIcon}
                      className="section-column-icon"
                      alt="Reaction icon"
                      aria-label="Reaction icon"
                    />
                  </LazyLoad>
                </div>
                <div className="section-column-title highlight-primary">
                  Reactions
                </div>

                <div className="section-column-subsection-title">
                  Rate constants
                </div>
                <div className="section-column-description">
                  61,734 measurements of rate constants for more than 3,137
                  distinct enzymes and 37,858 reactions aggregated from{" "}
                  <a
                    href="http://sabio.h-its.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SABIO-RK
                  </a>
                  . Comming soon: 211,862 additional measurements from{" "}
                  <a
                    href="https://www.brenda-enzymes.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BRENDA
                  </a>
                  .
                </div>

                <div className="section-column-subsection-title">
                  Fluxes &ndash; coming soon
                </div>
                <div className="section-column-description">
                  Fluxes curated from{" "}
                  <a
                    href="http://www.cecafdb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CeCaFDB
                  </a>{" "}
                  and various publications.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section workflow">
          <div className="section-inner-container">
            <h2 className="section-title">
              Workflow to{" "}
              <span className="highlight-primary">
                systematically discover data
              </span>{" "}
              for analysis and modeling
            </h2>
            <div className="section-title-separator"></div>
            <div className="vertical-workflow">
              <div className="vertical-workflow-el vertical-workflow-el-search">
                <div className="vertical-workflow-el-line"></div>
                <div className="vertical-workflow-el-icon-container">
                  <LazyLoad>
                    <object
                      data={searchIcon}
                      className="vertical-workflow-el-icon"
                      alt="Search icon"
                      aria-label="Search icon"
                    />
                  </LazyLoad>
                </div>
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-text-inner">
                    <div className="vertical-workflow-el-title">
                      Step 1: <span className="highlight-primary">Search</span>{" "}
                      for a biochemical entity (metabolite, RNA, protein, or
                      reaction)
                    </div>
                    <div className="vertical-workflow-el-description">
                      Use the search form at the{" "}
                      <HashLink scroll={scrollTo} to="#top">
                        top
                      </HashLink>{" "}
                      to search for measurements of a metabolite, RNA, protein,
                      or reaction relevant to a specific organism.
                    </div>
                  </div>
                </div>
              </div>

              <div className="vertical-workflow-el">
                <div className="vertical-workflow-el-line"></div>
                <div className="vertical-workflow-el-icon-container">
                  <LazyLoad>
                    <object
                      data={filterIcon}
                      className="vertical-workflow-el-icon"
                      alt="Filter icon"
                      aria-label="Filter icon"
                    />
                  </LazyLoad>
                </div>
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-title">
                    Step 2: <span className="highlight-primary">Filter</span>{" "}
                    for potentially relevant measurements of similar entities in
                    similar cells and similar environments
                  </div>
                  <div className="vertical-workflow-el-description">
                    Select a metabolite, RNA, protein, or reaction class (e.g.,
                    KEGG ortholog group) to obtain potentially relevant
                    measurements to the entity of interest. Then filter for data
                    about similar entities (e.g., by sequence similarity)
                    measured in similar organisms (by phylogenetic distance) and
                    environments (e.g., temperature, pH).
                  </div>
                </div>
              </div>

              <div className="vertical-workflow-el">
                <div className="vertical-workflow-el-line"></div>
                <div className="vertical-workflow-el-icon-container">
                  <LazyLoad>
                    <object
                      data={reviewIcon}
                      className="vertical-workflow-el-icon"
                      alt="Review icon"
                      aria-label="Review icon"
                    />
                  </LazyLoad>
                </div>
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-title">
                    Step 3: <span className="highlight-primary">Review</span>{" "}
                    the potentially relevant measurements to determine the
                    relevant measurements
                  </div>
                  <div className="vertical-workflow-el-description">
                    Inspect each potentially relevant measurement and select the
                    most relevant measurements to the entity and organism of
                    interest.
                  </div>
                </div>
              </div>

              <div className="vertical-workflow-el vertical-workflow-el-analyze">
                <div className="vertical-workflow-el-line"></div>
                <div className="vertical-workflow-el-icon-container">
                  <LazyLoad>
                    <object
                      data={analyzeIcon}
                      className="vertical-workflow-el-icon"
                      alt="Analyze icon"
                      aria-label="Analyze icon"
                    />
                  </LazyLoad>
                </div>
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-title">
                    Step 4: <span className="highlight-primary">Analyze</span>{" "}
                    the distribution of relevant measurements
                  </div>
                  <div className="vertical-workflow-el-description">
                    Review the distribution and statistical properties of the
                    potentially relevant measurements.
                  </div>
                </div>
              </div>

              <div className="vertical-workflow-el">
                <div className="vertical-workflow-el-line"></div>
                <div className="vertical-workflow-el-icon-container">
                  <LazyLoad>
                    <object
                      data={exportIcon}
                      className="vertical-workflow-el-icon"
                      alt="Export icon"
                      aria-label="Export icon"
                    />
                  </LazyLoad>
                </div>
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-title">
                    Step 5: <span className="highlight-primary">Export</span>{" "}
                    molecular data for model construction and validation
                  </div>
                  <div className="vertical-workflow-el-description">
                    Export the selected measurements, or all of the
                    measurements, in CSV or JSON format for further analysis
                    such as model construction or validation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section about">
          <div className="section-inner-container">
            <h2 className="section-title">
              <span className="highlight-primary">About</span> <i>Datanator</i>
            </h2>
            <div className="section-title-separator"></div>
            <p>
              <i>Datanator</i> was developed by the{" "}
              <a
                href="https://www.karrlab.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Karr Lab
              </a>{" "}
              at the Icahn School of Medicine at Mount Sinai in New York with
              support from the National Institutes of Health and the National
              Science Foundation.
            </p>
            <p>
              <i>Datanator</i> was implemented using several open-source tools
              including Elasticsearch, Flask, MongoDB, OpenAPI, and React. The
              code is available open-source under the MIT license. The data is
              available under the Creative Commons
              Attribution-NonCommercial-NoDerivatives 4.0 (CC BY-NC-ND 4.0)
              license.
            </p>
            <p className="no-bottom-margin">
              Please see the <Link to="/about/">About</Link> page for more
              information.
            </p>
            <div className="about-icons">
              <a
                href="https://karrlab.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={karrLabIcon}
                    className="about-icon hover-zoom"
                    title="Karr Lab"
                    alt="Karr Lab logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://reproduciblebiomodels.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-zoom"
              >
                <LazyLoad>
                  <img
                    src={crbmIcon}
                    className="about-icon hover-zoom"
                    title="Center for Reproducible Biomedical Modeling"
                    alt="Center for Reproducible Biomedical Modeling logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://mssm.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="about-icon-mssm"
              >
                <LazyLoad>
                  <img
                    src={sinaiIcon}
                    className="about-icon hover-zoom"
                    title="Icahn School of Medicine at Mount Sinai"
                    alt="Icahn School of Medicine at Mount Sinai logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://nih.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={nihIcon}
                    className="about-icon hover-zoom"
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
                    className="about-icon hover-zoom"
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
                    className="about-icon hover-zoom"
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
                    className="about-icon hover-zoom"
                    title="National Science Foundation"
                    alt="National Science Foundation logo"
                  />
                </LazyLoad>
              </a>
            </div>
            <div className="about-icons">
              <a
                href="https://www.ag-grid.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={agGridIcon}
                    className="about-icon hover-zoom"
                    title="ag-Grid"
                    alt="ag-Grid logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://aws.amazon.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={awsIcon}
                    className="about-icon hover-zoom"
                    title="AWS"
                    alt="AWS logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://bruit.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={bruitIoIcon}
                    className="about-icon hover-zoom"
                    title="bruit.io"
                    alt="bruit.io logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://www.docker.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={dockerIcon}
                    className="about-icon hover-zoom"
                    title="Docker"
                    alt="Docker logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://www.elastic.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={elasticsearchIcon}
                    className="about-icon hover-zoom"
                    title="Elasticsearch"
                    alt="Elasticsearch logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://flask.palletsprojects.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={flaskIcon}
                    className="about-icon hover-zoom"
                    title="Flask"
                    alt="Flask logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://heroku.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={herokuIcon}
                    className="about-icon hover-zoom"
                    title="Heroku"
                    alt="Heroku logo"
                  />
                </LazyLoad>
              </a>
            </div>
            <div className="about-icons">
              <a
                href="https://gunicorn.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={gunicornIcon}
                    className="about-icon hover-zoom"
                    title="Gunicorn"
                    alt="Gunicorn logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://www.mongodb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={mongoDbIcon}
                    className="about-icon hover-zoom"
                    title="MongoDB"
                    alt="MongoDB logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://www.netlify.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={netlifyIcon}
                    className="about-icon hover-zoom"
                    title="Netlify"
                    alt="Netlify logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://swagger.io/docs/specification/about/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={openapiIcon}
                    className="about-icon hover-zoom"
                    title="Open API"
                    alt="Open API logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="http://openbabel.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={openbabelIcon}
                    className="about-icon hover-zoom"
                    title="Open Babel"
                    alt="Open Babel logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://pint.readthedocs.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={pintIcon}
                    className="about-icon hover-zoom"
                    title="pint"
                    alt="pint logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://reactjs.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={reactIcon}
                    className="about-icon hover-zoom"
                    title="Rewact"
                    alt="React logo"
                  />
                </LazyLoad>
              </a>
              <a
                href="https://requests.readthedocs.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyLoad>
                  <img
                    src={requestsIcon}
                    className="about-icon hover-zoom"
                    title="requests"
                    alt="requests logo"
                  />
                </LazyLoad>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
