import React, { Component } from "react";
import PropTypes from "prop-types";
import { Notifier } from "@airbrake/browser";
import { errorDialogRef } from "~/components/ErrorDialog/ErrorDialog";
import { httpRequestLog } from "~/utils/utils";

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.airbrake = new Notifier({
      projectId: parseFloat(process.env.REACT_APP_AIRBRAKE_PROJECT_ID),
      projectKey: process.env.REACT_APP_AIRBRAKE_PROJECT_KEY,
      environment: process.env.NODE_ENV,
    });
    this.contactEmail = process.env.REACT_APP_CONTACT_EMAIL;
  }

  componentDidCatch(error, info) {
    // ignore HTTP cancellation "errors"
    if (
      error &&
      "response" in error &&
      error.response &&
      "status" in error.reponse &&
      error.reponse.status === 0
    ) {
      return;
    }

    // Send error to Airbrake
    this.airbrake.notify({
      error: error,
      context: { httpRequestLog: httpRequestLog },
      params: { info: info },
      environment: {
        version: process.env.REACT_APP_VERSION,
        repository: process.env.REACT_APP_REPOSITORY_URL.replace(
          "git+",
          ""
        ).replace(".git", ""),
      },
    });

    if (errorDialogRef.current) {
      errorDialogRef.current.open(
        <span className="dialog-message-container">
          We&apos;re sorry we could not complete your request. Please try again,
          or contact us at{" "}
          <a href={"mailto:" + this.contactEmail} subject="Datanator error">
            {this.contactEmail}
          </a>{" "}
          if the problem persists.
        </span>
      );
    }
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
