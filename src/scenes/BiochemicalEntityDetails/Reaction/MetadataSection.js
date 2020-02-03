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
      const props = [];
      if (metadata.name) {
        props.push({ label: "Name", value: metadata.name });
      }
      if (metadata.equation) {
        props.push({ label: "Equation", value: metadata.equation });
      }
      if (metadata.ecNumber) {
        props.push({
          label: "EC number",
          value: (
            <a
              href={"https://enzyme.expasy.org/EC/" + metadata.ecNumber}
              target="_blank"
              rel="noopener noreferrer"
            >
              metadata.ecNumber
            </a>
          )
        });
      }

      return (
        <div>
          <div className="content-block" id="properties">
            <h2 className="content-block-heading">Properties</h2>
            <div className="content-block-content">
              <ul className="key-value-list">
                {props.map(el => (
                  <li key={el.label}>
                    <b>{el.label}:</b> {el.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }
}

export { MetadataSection };
