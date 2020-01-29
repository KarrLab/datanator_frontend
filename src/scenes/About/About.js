import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { SocialIcon } from "react-social-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./About.scss";

import lianPhoto from "./images/lian.thumb.png";
import rothPhoto from "./images/roth.thumb.png";
import karrPhoto from "./images/karr.thumb.png";

import nihIcon from "./images/nih.svg";
import nibibIcon from "./images/nibib.svg";
import nigmsIcon from "./images/nigms.svg";
import nsfIcon from "./images/nsf.svg";

class About extends Component {
  render() {
    const scrollTo = el => {
      window.scrollTo({ behavior: "smooth", top: el.offsetTop - 52 });
    };

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
                    <HashLink to="#team" scroll={scrollTo}>
                      Team
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#acknowledgements" scroll={scrollTo}>
                      Acknowledgements
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#source" scroll={scrollTo}>
                      Source code
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
                <div><a href="mailto:info@karrlab.org"><FontAwesomeIcon icon="envelope" /> Contact us</a></div>
                <div><a href="https://github.com/karrlab/datanator_frontend/issues"><FontAwesomeIcon icon="exclamation-circle" /> Submit an issue</a></div>
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
                  determinants of behavior. However, it is difficult to obtain the
                  large and varied data needed for mechanistic modeling. Although
                  substantial data is already publicly available, the data is
                  difficult to obtain because it is scattered across numerous
                  databases and publications and described with different
                  identifiers, units, and formats. In addition, there are few
                  tools for finding data that is relevant to modeling a specific
                  cell in a specific environment. These barriers impede
                  mechanistic modeling.
                </p>
                <p>
                  To accelerate cell modeling, we developed <i>Datanator</i>, a
                  toolkit for systematically discovering data for modeling a
                  specific cell in a specific environment. <i>Datanator</i>{" "}
                  includes an integrated database of genomic and biochemical data
                  about several aspects of cells, this web application for
                  searching the database for data relevant to specific cells, and
                  a REST API and Python library for programmatically aggregating
                  data for large models. The web application enables investigators
                  to search for experimental measurements of biochemical
                  parameters (e.g. metabolite concentration, reaction rate, etc.)
                  relevant to a specific cell (taxon, cell type) in a specific
                  environment (e.g., temperature, pH, growth media, etc.). For
                  each search, this web application displays a filterable and
                  sortable list of relevant experimental measurements aggregated
                  from a range of sources.
                </p>
              </div>
            </div>

            <div className="content-block section" id="data">
              <h2 className="content-block-heading">Data types and sources</h2>
              <div className="content-block-content">
                <p>
                  Currently, <i>Datanator</i> includes measured metabolite
                  concentrations, protein abundances, and reaction rate parameters
                  integrated from{" "}
                  <a
                    href={"http://ecmdb.ca/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ECMDB
                  </a>
                  ,{" "}
                  <a
                    href={"https://pax-db.org/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PAX-DB
                  </a>
                  ,{" "}
                  <a
                    href={"https://sabiork.h-its.org/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SABIO-RK
                  </a>
                  , and{" "}
                  <a
                    href={"http://www.ymdb.ca/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YMDB
                  </a>
                  . We aim to continually incorporate additional data from
                  additional sources.
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
                  To help investigators find data about specific cells in specific
                  environments, <i>Datanator</i> provides multiple tools for
                  searching and filtering the integrated database.
                </p>
                <ul className="no-top-margin">
                  <li>
                    Full text search: Users can use the search form on the home
                    page to identify metabolites, proteins, and reactions that
                    they would like information.
                  </li>
                  <li>
                    Molecular similarity: Users can identify measurements of
                    similar metabolites according to the{" "}
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
                      orthology and sequence similarity
                    </a>
                    . Users can identify measurements of similar reactions
                    according to their{" "}
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
                    Phylogenetic similarity: Users can identify measurements
                    observed in closely related taxa to their taxon of interest by
                    filtering measurements according to their distance along the{" "}
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
                    Environmental similarity: Users can filter for measurements
                    from similar temperatures, pHs, and media conditions.
                  </li>
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
                  at the Icahn School of Medicine at Mount Sinai in New York, US.
                </p>
                <div className="developers-group main-developers">
                  <h3>Main developers</h3>
                  <div className="main-developers-group-list">
                    <div className="main-developer">
                      <img
                        src={rothPhoto}
                        className="hover-zoom"
                        alt="Yosef Roth headshot"
                      />
                      <div className="developer-name">
                        Yosef Roth
                        <SocialIcon url="https://www.linkedin.com/in/yosef-roth-a80a378a" />
                      </div>
                    </div>
                    <div className="main-developer">
                      <img
                        src={lianPhoto}
                        className="hover-zoom"
                        alt="Zhouyang Lian headshot"
                      />
                      <div className="developer-name">
                        Zhouyang Lian
                        <SocialIcon url="https://www.linkedin.com/in/zlian/" />
                      </div>
                    </div>
                    <div className="main-developer">
                      <img
                        src={karrPhoto}
                        className="hover-zoom"
                        alt="Jonathan Karr headshot"
                      />
                      <div className="developer-name">
                        Jonathan Karr
                        <SocialIcon url="https://www.linkedin.com/in/jonrkarr/" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="developers-group additional-developers-group">
                  <h3>Additional contributors</h3>
                  <div className="additional-developers-group-list">
                    <div className="developer-name">
                      Bilal Shaikh
                      <SocialIcon url="https://www.linkedin.com/in/bilalshaikh42/" />
                    </div>
                    <div className="developer-name">
                      Saahith Pochiraju
                      <SocialIcon url="https://www.linkedin.com/in/saahithpochiraju/" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-block section funding" id="acknowledgements">
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
                  from the National Institute of Bioimaging and Bioengineering and
                  the National Institute of General Medical Sciences of the
                  National Institutes of Health and the National Science
                  Foundation (award P41EB023912).{" "}
                </p>
                <div className="funding-icons">
                  <a
                    href="https://nih.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={nihIcon}
                      className="hover-zoom"
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
                      className="hover-zoom"
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
                      className="hover-zoom"
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
                      className="hover-zoom"
                      title="National Science Foundation"
                      alt="National Science Foundation logo"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="content-block section" id="source">
              <h2 className="content-block-heading">Source code and license</h2>

              <div className="content-block-content">
                <p className="no-bottom-margin">
                  <i>Datanator</i> is available open-source from GitHub and is
                  released under the{" "}
                  <a
                    href={
                      "https://github.com/KarrLab/datanator/blob/master/LICENSE"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MIT license
                  </a>
                  .
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
          </div>
        </div>
      </div>
    );
  }
}

export default About;
