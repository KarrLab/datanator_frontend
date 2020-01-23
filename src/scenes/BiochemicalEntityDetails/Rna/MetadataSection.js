import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { abstractMolecule } from "~/data/actions/pageAction";
import rnaIcon from "~/scenes/Home/images/trna.svg";

class MetadataSection extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let rnaMetadata = this.props.rnaMetadata;

    if (rnaMetadata[0] === undefined || rnaMetadata[0].length === 0) {
      return <div></div>;
    }
    
    rnaMetadata = rnaMetadata[0];
    let title = rnaMetadata.gene_name
    if (!title){
      title = "Gene name not found"
    }
    return (
      <div className="content-block">
        <h2 className="content-block-heading">{title}</h2>
        <div className="content-block-content img-description">
          <div className="vertical-center">
            <object
              data={rnaIcon}
              className="hover-zoom"
              alt="RNA icon"
              aria-label="RNA icon"
            />
          </div>

          {(rnaMetadata.gene_name || rnaMetadata.protein_name) && (
          <div className="metadata-description">
            {rnaMetadata.gene_name && (
            <p>
              <b>Gene Name:</b> {rnaMetadata.gene_name}
            </p>
            )}
            {rnaMetadata.protein_name && (
            <p>
              <b>Protein Name:</b> {rnaMetadata.protein_name}
            </p>
            )}
          </div>
          )}
        </div>
      </div>
    );
  }
}

export { MetadataSection };
