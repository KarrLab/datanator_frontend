import React, { Component } from "react";
import PropTypes from "prop-types";

class MetadataSection extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired,
  };
  
  render() {
    let metadata = this.props.metadata;

    if (metadata === undefined || metadata == null) {
      return <div></div>;
    }

    const uniprot_ids = metadata.uniprot_ids;
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
        <div className="content-block" id="properties">
          <h2 className="content-block-heading">Properties</h2>
          <div className="content-block-content img-description">
            <div className="metadata-description">
              <p>
                <b>Name:</b> {metadata.ko_name[0]}
              </p>
              <p>
                <b>KO Number:</b>{" "}
                <a
                  href={
                    "https://www.genome.jp/dbget-bin/www_bget?ko:" +
                    metadata.ko_number
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {metadata.ko_number}
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
