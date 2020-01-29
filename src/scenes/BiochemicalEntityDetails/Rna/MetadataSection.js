import React, { Component } from "react";
import PropTypes from "prop-types";

class MetadataSection extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired
  };

  render() {
    let metadata = this.props.metadata;

    if (metadata == null || metadata === undefined) {
      return <div></div>;
    }
    
    return (
      <div>
        <div className="content-block" id="properties">
          <h2 className="content-block-heading">Properties</h2>
          <div className="content-block-content img-description">
            {(metadata.gene_name || metadata.protein_name) && (
            <div className="metadata-description">
              {metadata.gene_name && (
              <p>
                <b>Gene:</b> {metadata.gene_name}
              </p>
              )}
              {metadata.protein_name && (
              <p>
                <b>Protein:</b> {metadata.protein_name}
              </p>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export { MetadataSection };
