import React, { Component } from "react";
import PropTypes from "prop-types";

class MetadataSection extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired,
  };
  
  render() {
    const metadata = this.props.metadata;

    if (metadata === undefined || metadata == null) {
      return <div></div>;
    }

    const uniprotIds = metadata.uniprotIds;
    const uniprotLinks = [];
    for (let i = uniprotIds.length - 1; i >= 0; i--) {
      let link = "";
      if (i === 0) {
        link = (
          <a
            href={"https://www.uniprot.org/uniprot/" + uniprotIds[i]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {uniprotIds[i]}{" "}
          </a>
        );
      } else {
        link = (
          <a
            href={"https://www.uniprot.org/uniprot/" + uniprotIds[i]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {uniprotIds[i]},{" "}
          </a>
        );
      }
      uniprotLinks.push(link);
    }

    return (
      <div>
        <div className="content-block" id="properties">
          <h2 className="content-block-heading">Properties</h2>
          <div className="content-block-content>
            <div>
              <p>
                <b>Name:</b> {metadata.koName[0]}
              </p>
              <p>
                <b>KO Number:</b>{" "}
                <a
                  href={
                    "https://www.genome.jp/dbget-bin/www_bget?ko:" +
                    metadata.koNumber
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {metadata.koNumber}
                </a>
              </p>
              <p>
                <b>UniProt IDs:</b> {uniprotLinks}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { MetadataSection };
