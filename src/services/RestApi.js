import React from "react";
import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import localforage from "localforage";
import memoryDriver from "localforage-memoryStorageDriver";
import { errorDialogRef } from "~/components/ErrorDialog/ErrorDialog";
import { replaceNanWithNull, httpRequestLog } from "~/utils/utils";
import { Notifier } from "@airbrake/browser";

const JSON5 = require("json5");

const ROOT_URL = process.env.REACT_APP_REST_SERVER;
const IS_DEVELOPMENT = process.env.NODE_ENV.startsWith("development");
const IS_TEST = process.env.NODE_ENV.startsWith("test");
const USE_CACHE = process.env.REACT_APP_REST_CACHE === "1";

localforage.defineDriver(memoryDriver);
const forageStore = localforage.createInstance({
  driver: [
    localforage.INDEXEDDB,
    localforage.LOCALSTORAGE,
    memoryDriver._driver,
  ],
  name:
    process.env.REACT_APP_NAME +
    "-" +
    process.env.REACT_APP_REST_SERVER_VERSION,
});
const cache = setupCache({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  exclude: {
    query: false,
  },
  store: forageStore,
});
const cachedApi = axios.create({
  baseURL: ROOT_URL,
  transformResponse: [
    function (data) {
      if (typeof data === "string") {
        return replaceNanWithNull(JSON5.parse(data));
      } else {
        return data;
      }
    },
  ],
  adapter: USE_CACHE ? cache.adapter : null,
});

function getDataFromApi(url, options = {}, api = cachedApi) {
  httpRequestLog.push(url);
  return api.get(url, options);
}

const airbrake = new Notifier({
  projectId: parseFloat(process.env.REACT_APP_AIRBRAKE_PROJECT_ID),
  projectKey: process.env.REACT_APP_AIRBRAKE_PROJECT_KEY,
  environment: process.env.NODE_ENV,
});

function genApiErrorHandler(url, errorMessage = null) {
  return (error) => {
    if (axios.isCancel(error)) {
      if (IS_DEVELOPMENT || IS_TEST) {
        console.info("Request '" + url + "' cancelled");
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

      if (!("isAxiosError" in error && error.isAxiosError)) {
        airbrake.notify({
          error: error,
          context: { httpRequestLog: httpRequestLog },
          environment: {
            version: process.env.REACT_APP_VERSION,
            repository: process.env.REACT_APP_REPOSITORY_URL.replace(
              "git+",
              ""
            ).replace(".git", ""),
          },
        });

        if (
          error &&
          "stack" in error &&
          "message" in error &&
          !(IS_DEVELOPMENT || IS_TEST)
        ) {
          throw error;
        } else {
          console.error(error);
        }
      }

      if (errorDialogRef.current) {
        const contactEmail = process.env.REACT_APP_CONTACT_EMAIL;
        const defaultErrorMessage = (
          <span>
            We&apos;re sorry our server could not complete your request. Please
            try again, or contact us at{" "}
            <a href={"mailto:" + contactEmail} subject="Datanator error">
              {contactEmail}
            </a>{" "}
            if the problem persists.
          </span>
        );

        errorDialogRef.current.open(
          <span className="dialog-message-container">
            {errorMessage && <span>{errorMessage}</span>}
            {defaultErrorMessage}
          </span>
        );
      }
    }
  };
}

export { getDataFromApi, genApiErrorHandler };
