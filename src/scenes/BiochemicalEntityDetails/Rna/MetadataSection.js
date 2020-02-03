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
        <div className="content-block" id="description">
          <h2 className="content-block-heading">Description</h2>
          <div className="content-block-content">
            {(metadata.geneName || metadata.proteinName) && (
              <ul className="key-value-list">
                {metadata.geneName && (
                  <li>
                    <b>Gene:</b> {metadata.geneName}
                  </li>
                )}
                {metadata.proteinName && (
                  <li>
                    <b>Protein:</b> {metadata.proteinName}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export { MetadataSection };
