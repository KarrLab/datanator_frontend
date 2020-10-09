import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";
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
    this._metadata = null;
    this.state = {
      metadata: null,
    };
  }

  setMetadata(metadata, update = false) {
    if (update && this._metadata) {
      const allMetadata = Object.assign({}, this._metadata);
      for (const key in metadata) {
        allMetadata[key] = metadata[key];
      }
      this._metadata = allMetadata;
      this.setState({ metadata: allMetadata });
    } else {
      this._metadata = metadata;
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
                          <HashLink scroll={scrollTo} to={"#" + section.id}>
                            {section.title}
                          </HashLink>
                        </li>
                      ))}
                    <li key="rna-half-life">
                      <HashLink scroll={scrollTo} to="#rna-half-life">
                        RNA half-life
                      </HashLink>
                    </li>
                    <li key="protein-abundance">
                      <HashLink scroll={scrollTo} to="#protein-abundance">
                        Protein abundance
                      </HashLink>
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
