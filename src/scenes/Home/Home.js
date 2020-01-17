import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Header } from "~/components/Header/Header";
import { Footer } from "~/components/Footer/Footer";

import "~/scenes/Home/Home.scss";
import logo from "./images/logo.svg";

import metConcIcon from "./images/atom.svg";
import protConcIcon from "./images/protein.svg";
import rxnConstIcon from "./images/left-right-arrows.svg";

import searchIcon from "./images/search.svg";
import filterIcon from "./images/filter.svg";
import analyzeIcon from "./images/analyze.svg";
import exportIcon from "./images/export.svg";

import identifyUseCaseIcon from "./images/line-chart.svg";
import constrainUseCaseIcon from "./images/flux-cone.svg";
import recalibrateUseCaseIcon from "./images/dna.svg";

import karrLabIcon from "./images/karr-lab.svg";
import crbmIcon from "./images/crbm.svg";
import sinaiIcon from "./images/sinai.svg";

import nihIcon from "../About/images/nih.svg";
import nibibIcon from "../About/images/nibib.svg";
import nigmsIcon from "../About/images/nigms.svg";
import nsfIcon from "../About/images/nsf.svg";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      newSearch: false,
      currentSearch: "metab",
      new_url: ""
    };
    this.getNewSearch = this.getNewSearch.bind(this);
  }

  getNewSearch(response) {
    let url = "/general/?q=" + response[0] + "&organism=" + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }

  componentDidMount() {
    //this.props.history.push('/');
  }

  render() {
    if (this.state.newSearch === true) {
      return <Redirect to={this.state.new_url} push />;
    }

    return (
      <div>
        <Header handleClick={this.getNewSearch} />

        <div className="content-container full-width-content-container content-container-home-scene">
          <div className="section intro">
            <div className="section-inner-container">
              <h1>
                <img src={logo} className="logo" alt="Datanator logo" />
                Datanator
              </h1>
              <h2>Discovering data for modeling cellular biochemistry</h2>
              <p>
                <i>Datanator</i> is a toolkit for discovering the data needed to
                build, calibrate, and validate mechanistic models of cells.{" "}
                <i>Datanator</i> is composed of an integrated database of
                genomic and biochemical data, this web application for
                identifying relevant data for modeling a specific organism in a
                specific environmental condition, and a REST API and Python
                library for programmatically discovering data for large models
                such as{" "}
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
          <div className="section data-types">
            <div className="section-inner-container">
              <h2>
                <i>Datanator</i>&apos;s integrated database contains key data
                for cell modeling
              </h2>
              <div className="section-columns section-3-columns">
                <div className="section-column">
                  <img src={metConcIcon} className="section-column-icon" alt="Metabolite concentration icon" />
                  <div className="section-column-title">
                    Metabolite concentrations
                  </div>
                  <div className="section-column-text">Brief description</div>
                </div>

                <div className="section-column">
                  <img src={protConcIcon} className="section-column-icon" alt="Protein abundance logo" />
                  <div className="section-column-title">Protein abundances</div>
                  <div className="section-column-text">Brief description</div>
                </div>

                <div className="section-column">
                  <img src={rxnConstIcon} className="section-column-icon" alt="Reaction rate constant logo" />
                  <div className="section-column-title">Reaction constants</div>
                  <div className="section-column-text">Brief description</div>
                </div>
              </div>
            </div>
          </div>
          <div className="section workflow">
            <div className="section-inner-container">
              <h2>
                <i>Datanator</i>&apos;s software enables systematic discovery of
                data for modeling
              </h2>
              <div className="section-columns section-4-columns">
                <div className="section-column">
                  <img src={searchIcon} className="section-column-icon" alt="Search icon" />
                  <div className="section-column-title">1. Search</div>
                  <div className="section-column-text">Brief description</div>
                </div>

                <div className="section-column">
                  <img src={filterIcon} className="section-column-icon" alt="Filter icon" />
                  <div className="section-column-title">2. Filter</div>
                  <div className="section-column-text">Brief description</div>
                </div>

                <div className="section-column">
                  <img src={analyzeIcon} className="section-column-icon" alt="Analyze icon" />
                  <div className="section-column-title">3. Analyze</div>
                  <div className="section-column-text">Brief description</div>
                </div>

                <div className="section-column">
                  <img src={exportIcon} className="section-column-icon" alt="Export icon" />
                  <div className="section-column-title">4. Download</div>
                  <div className="section-column-text">Brief description</div>
                </div>
              </div>
            </div>
          </div>
          <div className="section use-cases">
            <div className="section-inner-container">
              <h2>
                <i>Datanator</i> can facilitate a wide range of modeling tasks
              </h2>
              <div className="section-columns section-3-columns">
                <div className="section-column">
                  <img
                    src={identifyUseCaseIcon}
                    className="section-column-icon"
                    alt="Identify parameters icon"
                  />
                  <div className="section-column-title">
                    Identify missing quantitative parameters of kinetic models
                  </div>
                  <div className="section-column-text">Brief description</div>
                </div>

                <div className="section-column">
                  <img
                    src={constrainUseCaseIcon}
                    className="section-column-icon"
                    alt="Constrain models icon"
                  />
                  <div className="section-column-title">
                    Add data-drive constraints to constraint-based models
                  </div>
                  <div className="section-column-text">Brief description</div>
                </div>

                <div className="section-column">
                  <img
                    src={recalibrateUseCaseIcon}
                    className="section-column-icon"
                    alt="Recalibrate models icon"
                  />
                  <div className="section-column-title">
                    Recalibrate models to capture other organisms and cell types
                  </div>
                  <div className="section-column-text">Brief description</div>
                </div>
              </div>
            </div>
          </div>
          <div className="section about">
            <div className="section-inner-container">
              <h2>
                About <i>Datanator</i>
              </h2>
              <p>
                <i>Datanator</i> was developed by the{" "}
                <a
                  href="https://www.karrlab.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Karr Lab
                </a>{" "}
                at the Icahn School of Medicine at Mount Sinai in New York.
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
                  <img src={karrLabIcon} className="hover-zoom" alt="Karr Lab logo"/>
                </a>
                <a
                  href="https://reproduciblebiomodels.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={crbmIcon} className="hover-zoom" alt="Center for Reproducible Biomedical Modeling logo" />
                </a>
                <a
                  href="https://mssm.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-icon-mssm"
                >
                  <img src={sinaiIcon} className="hover-zoom" alt="Icahn School of Medicine at Mount Sinai logo" />
                </a>
                <a
                  href="https://nih.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={nihIcon} className="hover-zoom" alt="National Institutes of Health logo" />
                </a>
                <a
                  href="https://nibib.nih.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={nibibIcon} className="hover-zoom" alt="National Institute of Bioimaging and Bioengineering logo" />
                </a>
                <a
                  href="https://nigms.nih.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={nigmsIcon} className="hover-zoom" alt="National Institute of General Medical Sciences logo" />
                </a>
                <a
                  href="https://nsf.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={nsfIcon} className="hover-zoom" alt="National Science Foundation logo" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default Home;
