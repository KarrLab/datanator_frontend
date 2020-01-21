import React, { Component } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

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

class Home extends Component {
  render() {
    let scrollTo = el => {
      window.scrollTo({ behavior: "smooth", top: el.offsetTop });
    };

    return (
      <div className="content-container full-width-content-container content-container-home-scene">
        <div className="section intro">
          <div className="section-inner-container">
            <div className="logo-title">
              <object data={logo} className="logo" alt="Datanator logo" />
              <h1>Datanator</h1>
            </div>
            <h2>Tools to discover data to model cellular biochemistry</h2>
            <p>
              <i>Datanator</i> is a toolkit for discovering the data needed to
              build, calibrate, and validate mechanistic models of cells.{" "}
              <i>Datanator</i> is composed of an integrated database of genomic
              and biochemical data, this web application for identifying
              relevant data for modeling a specific organism in a specific
              environmental condition, and a REST API and Python library for
              programmatically discovering data for large models such as{" "}
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
              Aim:{" "}
              <span className="highlight-primary">
                construct and validate comprehensive models
              </span>
            </h2>
            <div className="section-title-separator"></div>
            <div className="section-columns section-4-columns">
              <div className="section-column">
                <object
                  data={identifyUseCaseIcon}
                  className="section-column-icon"
                  alt="Identify parameters icon"
                />
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
                <object
                  data={constrainUseCaseIcon}
                  className="section-column-icon"
                  alt="Constrain models icon"
                />
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
                <object
                  data={recalibrateUseCaseIcon}
                  className="section-column-icon"
                  alt="Recalibrate models icon"
                />
                <div className="section-column-subtitle">Kinetic models</div>
                <div className="section-column-title">
                  Re-calibrate models to capture other cells
                </div>
                <div className="section-column-description">
                  <i>Datanator</i> can help investigators modify models to
                  capture other organisms, tissues, and cell types by helping
                  investigators find data to re-calibrate model parameters. In
                  turn, this can help investigators compare organisms, tissues,
                  and cell types.
                </div>
              </div>

              <div className="section-column">
                <object
                  data={dataDrivenUseCaseIcon}
                  className="section-column-icon"
                  alt="Recalibrate models icon"
                />
                <div className="section-column-subtitle">
                  Data-driven models
                </div>
                <div className="section-column-title">
                  Meta-analyze multiple organisms and data types
                </div>
                <div className="section-column-description">
                  <i>Datanator</i> can also help investigators conduct
                  data-driven meta-analyses of molecular biology. For example,
                  the <i>Datanator</i> database can be used to conduct
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
              key data for cell modeling
            </h2>
            <div className="section-title-separator"></div>
            <div className="section-columns section-4-columns">
              <div className="section-column">
                <object
                  data={metaboliteIcon}
                  className="section-column-icon"
                  alt="Metabolite concentration icon"
                />
                <div className="section-column-subtitle">Available</div>
                <div className="section-column-title">
                  Metabolite concentrations
                </div>
                <div className="section-column-description">
                  1586 measurements of the concentrations of 5225 metabolites in
                  2 organisms aggregated from{" "}
                  <a
                    href="http://ecmdb.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ECMDB
                  </a>{" "}
                  and{" "}
                  <a
                    href="http://www.ymdb.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YMDB
                  </a>
                  .
                </div>
              </div>

              <div className="section-column">
                <object
                  data={rnaIcon}
                  className="section-column-icon"
                  alt="RNA icon"
                />
                <div className="section-column-subtitle">Coming soon</div>
                <div className="section-column-title">RNA half-lives</div>
                <div className="section-column-description">
                  Measurements of the half-lives of mRNA aggregated from more
                  than twenty publications.
                </div>
              </div>

              <div className="section-column">
                <object
                  data={proteinIcon}
                  className="section-column-icon"
                  alt="Protein abundance icon"
                />
                <div className="section-column-subtitle">Available</div>
                <div className="section-column-title">Protein abundances</div>
                <div className="section-column-description">
                  103,572 measurements of the abundance of 20,689 ortholog
                  groups and 846,970 proteins in 20,980 organisms aggregated
                  from{" "}
                  <a
                    href="https://pax-db.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PAXdb
                  </a>
                  ,{" "}
                  <a
                    href="https://www.genome.jp/kegg/ko.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    KEGG orthology
                  </a>
                  , and{" "}
                  <a
                    href="https://www.uniprot.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UniProt
                  </a>
                  .
                </div>
              </div>

              <div className="section-column">
                <object
                  data={reactionIcon}
                  className="section-column-icon"
                  alt="Reaction rate constant icon"
                />
                <div className="section-column-subtitle">Available</div>
                <div className="section-column-title">Reaction constants</div>
                <div className="section-column-description">
                  23,330 measurements of rate constants for 2,104 distinct
                  enzymes and 60,193 reactions aggregated from{" "}
                  <a
                    href="http://sabio.h-its.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SABIO-RK
                  </a>
                  .
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
                systematically discovery data
              </span>{" "}
              for modeling
            </h2>
            <div className="section-title-separator"></div>
            <div className="vertical-workflow">
              <div className="vertical-workflow-el vertical-workflow-el-search">
                <div className="vertical-workflow-el-line"></div>
                <object
                  data={searchIcon}
                  className="vertical-workflow-el-icon"
                  alt="Search icon"
                />
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-text-inner">
                    <div className="vertical-workflow-el-title">
                      Step 1: <span className="highlight-primary">Search</span>{" "}
                      for a biochemical entity (metabolite, RNA, protein, or
                      reaction)
                    </div>
                    <div className="vertical-workflow-el-description">
                      Use the search form at the{" "}
                      <HashLink to="#top" scroll={scrollTo}>
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
                <object
                  data={filterIcon}
                  className="vertical-workflow-el-icon"
                  alt="Filter icon"
                />
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-title">
                    Step 2: <span className="highlight-primary">Filter</span>{" "}
                    for potentially relevant measurements of similar entities in
                    similar cells and similar environments
                  </div>
                  <div className="vertical-workflow-el-description">
                    Select a metabolite, RNA, protein, or reaction class (e.g,
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
                <object
                  data={reviewIcon}
                  className="vertical-workflow-el-icon"
                  alt="Review icon"
                />
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
                <object
                  data={analyzeIcon}
                  className="vertical-workflow-el-icon"
                  alt="Analyze icon"
                />
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-title">
                    Step 4: <span className="highlight-primary">Analyze</span>{" "}
                    the distribution of relevant measurements
                  </div>
                  <div className="vertical-workflow-el-description">
                    Review box plots and statistical properties of the selected
                    and potentially relevant measurements.
                  </div>
                </div>
              </div>

              <div className="vertical-workflow-el">
                <div className="vertical-workflow-el-line"></div>
                <object
                  data={exportIcon}
                  className="vertical-workflow-el-icon"
                  alt="Export icon"
                />
                <div className="vertical-workflow-el-text">
                  <div className="vertical-workflow-el-title">
                    Step 5: <span className="highlight-primary">Export</span>{" "}
                    molecular data for model construction and validation
                  </div>
                  <div className="vertical-workflow-el-description">
                    Export the selected measurements, or all of the
                    measurements, in JSON format for further analysis such as
                    model construction or validation.
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
              at the Icahn School of Medicine at Mount Sinai in New York. See
              the <Link to="about">About</Link> page for more information.
            </p>
            <p>
              <i>Datanator</i> was developed with support from the National
              Institutes of Health and the National Science Foundation.
            </p>
            <div className="about-icons">
              <a
                href="https://karrlab.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <object
                  data={karrLabIcon}
                  className="about-icon hover-zoom"
                  title="Karr Lab"
                  alt="Karr Lab logo"
                />
              </a>
              <a
                href="https://reproduciblebiomodels.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <object
                  data={crbmIcon}
                  className="about-icon hover-zoom"
                  title="Center for Reproducible Biomedical Modeling"
                  alt="Center for Reproducible Biomedical Modeling logo"
                />
              </a>
              <a
                href="https://mssm.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="about-icon-mssm"
              >
                <img
                  src={sinaiIcon}
                  className="about-icon hover-zoom"
                  title="Icahn School of Medicine at Mount Sinai"
                  alt="Icahn School of Medicine at Mount Sinai logo"
                />
              </a>
              <a
                href="https://nih.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={nihIcon}
                  className="about-icon hover-zoom"
                  title="National Institutes of Health"
                  alt="National Institutes of Health logo"
                />
              </a>
              <a
                href="https://nibib.nih.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={nibibIcon}
                  className="about-icon hover-zoom"
                  title="National Institute of Bioimaging and Bioengineering"
                  alt="National Institute of Bioimaging and Bioengineering logo"
                />
              </a>
              <a
                href="https://nigms.nih.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={nigmsIcon}
                  className="about-icon hover-zoom"
                  title="National Institute of General Medical Sciences"
                  alt="National Institute of General Medical Sciences logo"
                />
              </a>
              <a
                href="https://nsf.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={nsfIcon}
                  className="about-icon hover-zoom"
                  title="National Science Foundation"
                  alt="National Science Foundation logo"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
