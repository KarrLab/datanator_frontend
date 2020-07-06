import React, { Component } from "react";
import { MetadataSection } from "./MetadataSection";
import { RnaModificationDataTable } from "./RnaModificationDataTable";
import { RnaHalfLifeDataTable } from "./RnaHalfLifeDataTable";
import { ProteinAbundanceDataTable } from "./ProteinAbundanceDataTable";
import { ProteinModificationDataTable } from "./ProteinModificationDataTable";
import Error404 from "~/scenes/Error404/Error404";

import "../BiochemicalEntityDetails.scss";

class Gene extends Component {
  constructor() {
    super();
    this.state = {
      metadata: null,
    };
  }

  setMetadata(metadata, update = false) {
    if (update && this.state.metadata) {
      const allMetadata = Object.assign({}, this.state.metadata);
      for (const key in metadata) {
        allMetadata[key] = metadata[key];
      }
      this.setState({ metadata: allMetadata });
    } else {
      this.setState({ metadata: metadata });
    }
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
            "content-container biochemical-entity-scene biochemical-entity-gene-scene" +
            (this.state.metadata ? "" : " hide")
          }
        >
          <h1 className="page-title">
            Gene:{" "}
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
                      this.state.metadata.metadataSections &&
                      this.state.metadata.metadataSections.map((section) => (
                        <li key={section.id}>
                          <a href={"#" + section.id}>{section.title}</a>
                        </li>
                      ))}
                    <li key="rna-half-life">
                      <a href="#rna-half-life">RNA half-life</a>
                    </li>
                    <li key="protein-abundance">
                      <a href="#protein-abundance">Protein abundance</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-column section">
              <MetadataSection
                set-scene-metadata={this.setMetadata.bind(this)}
              />
              <RnaModificationDataTable
                set-scene-metadata={this.setMetadata.bind(this)}
              />
              <RnaHalfLifeDataTable
                set-scene-metadata={this.setMetadata.bind(this)}
              />
              {!this.state.metadata ||
              !("coding" in this.state.metadata) ||
              this.state.metadata.coding ? (
                <ProteinAbundanceDataTable
                  set-scene-metadata={this.setMetadata.bind(this)}
                />
              ) : null}
              {!this.state.metadata ||
              !("coding" in this.state.metadata) ||
              this.state.metadata.coding ? (
                <ProteinModificationDataTable
                  set-scene-metadata={this.setMetadata.bind(this)}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Gene;
