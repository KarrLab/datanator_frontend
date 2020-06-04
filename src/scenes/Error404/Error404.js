import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import "./Error404.scss";

class Error404 extends Component {
  constructor(props) {
    super(props);
    this.contactEmail = process.env.REACT_APP_CONTACT_EMAIL;
  }

  render() {
    return (
      <div className="content-container content-container-error-404-scene">
        <div className="title">
          <FontAwesomeIcon icon="bug" /> 404
        </div>
        <div className="subtitle">Page not found</div>
        <div className="message">
          We&apos;re sorry. The page you requested could not be found. Please go
          back to the <Link to="/">home page</Link> or contact us at{" "}
          <a href={"mailto:" + this.contactEmail} subject="Datanator error">
            {this.contactEmail}
          </a>
          .
        </div>
      </div>
    );
  }
}

export default Error404;
