import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";
import { MetadataSection } from "./MetadataSection";
import { RnaHalfLifeDataTable } from "./RnaHalfLifeDataTable";
import { ProteinAbundanceDataTable } from "./ProteinAbundanceDataTable";

import "../BiochemicalEntityDetails.scss";

class Gene extends Component {
  constructor() {
    super();
    this.state = {
      metadata: null
    };
  }

  setMetadata(metadata) {
    this.setState({ metadata: metadata });
  }

  render() {
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
                      this.state.metadata.metadataSections.map(section => (
                        <li key={section.id}>
                          <HashLink to={"#" + section.id} scroll={scrollTo}>
                            {section.title}
                          </HashLink>
                        </li>
                      ))}
                    <li key="rna-half-life">
                      <HashLink to="#rna-half-life" scroll={scrollTo}>
                        RNA half-life
                      </HashLink>
                    </li>
                    <li key="protein-abundance">
                      <HashLink to="#protein-abundance" scroll={scrollTo}>
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
              <RnaHalfLifeDataTable />
              <ProteinAbundanceDataTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Gene;
