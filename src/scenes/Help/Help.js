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
            <Faq />
          </div>
        </div>
      </div>
    );
  }
}

export default Help;
