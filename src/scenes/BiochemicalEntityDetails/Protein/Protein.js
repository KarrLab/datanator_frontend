import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";
import { MetadataSection } from "./MetadataSection";
import { HalfLifeDataTable } from "./HalfLifeDataTable";
import { AbundanceDataTable } from "./AbundanceDataTable";

import "../BiochemicalEntityDetails.scss";

class Protein extends Component {
  constructor() {
    super();
    this.state = { metadata: null, dataArrived:{"half-life":true, "abundance":true} };
  }

  setMetadata(metadata) {
    this.setState({ metadata: metadata });
  }

  dataArrived(dataType, hasArrived) {
    let dataArrived = this.state.dataArrived
    dataArrived[dataType] = hasArrived
    this.setState({ dataArrived: dataArrived });
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
            "content-container biochemical-entity-scene biochemical-entity-protein-scene" +
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
                    {this.state.dataArrived["half-life"] &&
                    <li key="half-life">
                      <HashLink to="#half-life" scroll={scrollTo}>
                        RNA Half-life
                      </HashLink>
                    </li>
                  }
                    {this.state.dataArrived.abundance &&
                    <li key="abundance">
                      <HashLink to="#abundance" scroll={scrollTo}>
                        Abundance
                      </HashLink>
                    </li>
                  }
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-column section">
              <MetadataSection
                set-scene-metadata={this.setMetadata.bind(this)}
              />
              <HalfLifeDataTable 
                data-arrived={this.dataArrived.bind(this)}
              />
              <AbundanceDataTable
                data-arrived={this.dataArrived.bind(this)} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Protein;
