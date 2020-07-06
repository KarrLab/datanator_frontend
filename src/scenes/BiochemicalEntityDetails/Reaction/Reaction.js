import React, { Component } from "react";
import { MetadataSection } from "./MetadataSection";
import { RateConstantsDataTable } from "./RateConstantsDataTable";
import Error404 from "~/scenes/Error404/Error404";

import "../BiochemicalEntityDetails.scss";

export default class Reaction extends Component {
  constructor() {
    super();
    this.state = { metadata: null };
  }

  setMetadata(metadata) {
    this.setState({ metadata: metadata });
  }

  render() {
    if (this.state.metadata && this.state.metadata.error404) {
      return <Error404 />;
    }

    return (
      <div>
        <div
          className={
            "loader-full-content-container" +
            (this.state.metadata ? " hide" : "")
          }
        >
          <div className="loader"></div>
        </div>

        <div
          className={
            "content-container biochemical-entity-scene biochemical-entity-reaction-scene" +
            (this.state.metadata ? "" : " hide")
          }
        >
          <h1 className="page-title">
            Reaction:{" "}
            <span className="highlight-accent">
              {this.state.metadata ? this.state.metadata.title : ""}
            </span>
            {this.state.metadata && this.state.metadata.organism && (
              <span>
                <span className="highlight-text"> in </span>
                <span className="highlight-accent">
                  {this.state.metadata.organism}
                </span>
              </span>
            )}
          </h1>
          <div className="content-container-columns">
            <div className="overview-column">
              <div className="content-block table-of-contents">
                <h2 className="content-block-heading">Contents</h2>
                <div className="content-block-content">
                  <ul>
                    {this.state.metadata &&
                      this.state.metadata.metadataSections.map((section) => (
                        <li key={section.id}>
                          <a href={"#" + section.id}>{section.title}</a>
                        </li>
                      ))}
                    <li>
                      <a href="#rate-constants">Rate constants</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-column section">
              <MetadataSection
                set-scene-metadata={this.setMetadata.bind(this)}
              />
              <RateConstantsDataTable
                set-scene-metadata={this.setMetadata.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
