import React from "react";
import axios from "axios";
import { errorDialogRef } from "~/components/ErrorDialog/ErrorDialog";

const ROOT_URL = process.env.REACT_APP_REST_SERVER;
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const DEFAULT_ERROR_MESSAGE = (
  <span>
    We&apos;re sorry our server could not complete your request. Please try
    again, or contact us at{" "}
    <a href="mailto:info@karrlab.org">info@karrlab.org</a> if the problem
    persists.
  </span>
);

function getDataFromApi(params, options = {}, errorMessage = null) {
  const url = ROOT_URL + params.join("/");
  return axios.get(url, options).catch(error => {
    if (!axios.isCancel(error)) {
      errorDialogRef.current.open(
        <span className="dialog-message-container">
          {errorMessage && <span>{errorMessage}</span>}
          {DEFAULT_ERROR_MESSAGE}
        </span>
      );
      if (IS_DEVELOPMENT) {
        const errorInfo = error.response.data;
        console.log(
          "Server error " + errorInfo.status + ": " + errorInfo.detail
        );
      }
    }
  });
}

export { getDataFromApi };
