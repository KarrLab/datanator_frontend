import React, { Component } from "react";
import PropTypes from "prop-types";

class MetadataSection extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired
  };

  render() {
    const metadata = this.props.metadata;

    if (metadata == null) {
      return <div></div>;
    } else {
      return (
        <div>
          <div className="content-block" id="properties">
            <h2 className="content-block-heading">Properties</h2>
            <div className="content-block-content">
              <p>
                <b>Name:</b> {metadata.name}
              </p>
              <p>
                <b>Equation:</b> {metadata.equation}
              </p>
              <p>
                <b>EC Number:</b> {metadata.ecNumber}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }
}

export { MetadataSection };
