import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./UnsupportedBrowser.scss";

const SUPPORTED_BROWSERS = [
  { name: "Chrome", id: "chrome", minVersion: "83" },
  { name: "Edge (engine)", id: "Microsoft Edge", minVersion: "18" },
  { name: "Firefox", id: "firefox", minVersion: "71" },
];

class UnsupportedBrowser extends Component {
  render() {
    return (
      <div className="content-container content-container-unsupported-browser-scene">
        <div className="title">
          <FontAwesomeIcon icon="exclamation-triangle" />
        </div>
        <div className="subtitle">Browser not supported</div>
        <div className="message">
          <p>
            We&apos;re sorry. <i>Datanator</i> utilizes reactive features only
            available in modern browsers. <i>Datanator</i> is known to work with
            the browsers below.
          </p>
          <div>
            {SUPPORTED_BROWSERS.map((browser) => {
              return (
                <div key={browser.id}>
                  {browser.name} &ge; {browser.minVersion}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default UnsupportedBrowser;
export { SUPPORTED_BROWSERS };
