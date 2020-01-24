import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import proteinIcon from "~/scenes/Home/images/protein.svg";

class MetadataSection extends Component {
  static propTypes = {};
  
  render() {
    let proteinMetadata = this.props.proteinMetadata;

    if (proteinMetadata[0] === undefined || proteinMetadata[0].length === 0) {
      return <div></div>;
    }
    proteinMetadata = proteinMetadata[0];

    const uniprot_ids = proteinMetadata.uniprot_ids;
    const uniprot_links = [];
    for (let i = uniprot_ids.length - 1; i >= 0; i--) {
      let link = "";
      if (i === 0) {
        link = (
          <a
            href={"https://www.uniprot.org/uniprot/" + uniprot_ids[i]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {uniprot_ids[i]}{" "}
          </a>
        );
      } else {
        link = (
          <a
            href={"https://www.uniprot.org/uniprot/" + uniprot_ids[i]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {uniprot_ids[i]},{" "}
          </a>
        );
      }
      uniprot_links.push(link);
    }

    return (
      <div>
        <h1 className="page-title">{proteinMetadata.ko_name[0]}</h1>

        <div className="content-block">
          <h2 className="content-block-heading">Properties</h2>
          <div className="content-block-content img-description">
            <div className="vertical-center">
              <object
                data={proteinIcon}
                className="entity-scene-icon hover-zoom"
                alt="Protein icon"
                aria-label="Protein icon"
              />
            </div>

            <div className="metadata-description">
              <p>
                <b>Name:</b> {proteinMetadata.ko_name[0]}
              </p>
              <p>
                <b>KO Number:</b>{" "}
                <a
                  href={
                    "https://www.genome.jp/dbget-bin/www_bget?ko:" +
                    proteinMetadata.ko_number
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {proteinMetadata.ko_number}
                </a>
              </p>
              <p>
                <b>Uniprot IDs:</b> {uniprot_links}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { MetadataSection };
