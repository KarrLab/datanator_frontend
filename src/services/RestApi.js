import React from "react";
import axios from "axios";
import { errorDialogRef } from "~/components/ErrorDialog/ErrorDialog";
import { replaceNanWithNull } from "~/utils/utils";

const JSON5 = require("json5");

const ROOT_URL = process.env.REACT_APP_REST_SERVER;
const IS_DEVELOPMENT = process.env.NODE_ENV.startsWith("development");
const IS_TEST = process.env.NODE_ENV.startsWith("test");
const DEFAULT_ERROR_MESSAGE = (
  <span>
    We&apos;re sorry our server could not complete your request. Please try
    again, or contact us at{" "}
    <a href="mailto:info@karrlab.org" subject="Datanator error">
      info@karrlab.org
    </a>{" "}
    if the problem persists.
  </span>
);

function getDataFromApi(params, options = {}) {
  const url = ROOT_URL + params.join("/");
  options.transformResponse = [
    function (data) {
      return replaceNanWithNull(JSON5.parse(data));
    },
  ];
  return axios.get(url, options);
}

function genApiErrorHandler(params, errorMessage = null) {
  return (error) => {
    if (axios.isCancel(error)) {
      if (IS_DEVELOPMENT || IS_TEST) {
        console.info("Request '" + params.join("/") + "' cancelled");
      }
    } else {
      if (
        (IS_DEVELOPMENT || IS_TEST) &&
        "isAxiosError" in error &&
        error.isAxiosError &&
        error.response !== undefined
      ) {
        const errorInfo = error.response.data;
        console.error(
          "Server error " + errorInfo.status + ": " + errorInfo.detail
        );
      }

      if (
        IS_DEVELOPMENT ||
        IS_TEST ||
        !("isAxiosError" in error && error.isAxiosError)
      ) {
        if (error && "stack" in error && "message" in error) {
          throw error;
        } else {
          console.error(error);
        }
      }

      if (errorDialogRef.current) {
        errorDialogRef.current.open(
          <span className="dialog-message-container">
            {errorMessage && <span>{errorMessage}</span>}
            {DEFAULT_ERROR_MESSAGE}
          </span>
        );
      }
    }
  };
}

export { getDataFromApi, genApiErrorHandler };
