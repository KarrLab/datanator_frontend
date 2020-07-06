import React, { Component } from "react";
import ScrollableAnchor from "react-scrollable-anchor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tutorial from "./Tutorial";
import Faq from "./Faq";

import "./Help.scss";

class Help extends Component {
  constructor(props) {
    super(props);
    this.contactEmail = process.env.REACT_APP_CONTACT_EMAIL;
  }

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
                    <a href="#tutorial">Tutorial</a>
                  </li>
                  <li>
                    <a href="#data">Data types</a>
                  </li>
                  <li>
                    <a href="#api">REST API</a>
                  </li>
                  <li>
                    <a href="#download">Downloading data</a>
                  </li>
                  <li>
                    <a href="#faq">FAQ</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">
                Citing <i>Datanator</i>
              </h2>
              <div className="content-block-content">
                Please check back soon for citation information.
              </div>
            </div>

            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Need more help?</h2>
              <div className="content-block-content">
                <ScrollableAnchor id="contact">
                  <a
                    href={"mailto:" + this.contactEmail}
                    subject="Datanator help"
                  >
                    <FontAwesomeIcon icon="envelope" /> Contact us
                  </a>
                </ScrollableAnchor>
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
            <Tutorial />

            <ScrollableAnchor id="data">
              <div className="content-block section">
                <h2 className="content-block-heading">
                  Data types and sources
                </h2>
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
            </ScrollableAnchor>

            <ScrollableAnchor id="api">
              <div className="content-block section">
                <h2 className="content-block-heading">
                  Programmatically querying the <i>Datanator</i> data via the
                  REST API
                </h2>

                <div className="content-block-content">
                  <p className="no-bottom-margin">
                    A REST API is available at{" "}
                    <a
                      href={process.env.REACT_APP_REST_SERVER}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {process.env.REACT_APP_REST_SERVER}
                    </a>
                    . Documentation is available at the same URL.
                  </p>
                </div>
              </div>
            </ScrollableAnchor>

            <ScrollableAnchor id="download">
              <div className="content-block section">
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
                      {" "}
                      datanator Quilt data package
                    </a>
                    .
                  </p>
                </div>
              </div>
            </ScrollableAnchor>

            <Faq />
          </div>
        </div>
      </div>
    );
  }
}

export default Help;
