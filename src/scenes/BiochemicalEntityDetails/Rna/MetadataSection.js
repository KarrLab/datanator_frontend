import React, { Component } from "react";
import PropTypes from "prop-types";

class MetadataSection extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired
  };

  render() {
    const metadata = this.props.metadata;

    if (metadata == null || metadata === undefined) {
      return <div></div>;
    }
    
    return (
      <div>
        <div className="content-block" id="properties">
          <h2 className="content-block-heading">Properties</h2>
          <div className="content-block-content">
            {(metadata.geneName || metadata.proteinName) && (
            <div>
              {metadata.geneName && (
              <p>
                <b>Gene:</b> {metadata.geneName}
              </p>
              )}
              {metadata.proteinName && (
              <p>
                <b>Protein:</b> {metadata.proteinName}
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
