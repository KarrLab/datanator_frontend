import React, { Component } from "react";
import PropTypes from "prop-types";
import { removeDuplicates } from "~/utils/utils";

class MetadataSection extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired
  };

  render() {
    const metadata = this.props.metadata;

    if (metadata === undefined || metadata == null) {
      return <div></div>;
    }

    const uniprotIds = removeDuplicates(metadata.uniprotIds);
    uniprotIds.sort();

    const uniprotLinks = [];
    for (const uniprotId of uniprotIds) {
      uniprotLinks.push(
        <li key={uniprotId}>
          <a
            href={"https://www.uniprot.org/uniprot/" + uniprotId}
            target="_blank"
            rel="noopener noreferrer"
          >
            {uniprotId}
          </a>
        </li>
      );
    }

    return (
      <div>
        <div className="content-block" id="properties">
          <h2 className="content-block-heading">Properties</h2>
          <div className="content-block-content">
            <ul className="key-value-list">
              <li>
                <b>Name:</b> {metadata.koName[0]}
              </li>
              <li>
                <b>KEGG Orthology id:</b>{" "}
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
              </li>
              <li>
                <b>Proteins:</b>{" "}
                <ul className="comma-separated-list">{uniprotLinks}</ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export { MetadataSection };
