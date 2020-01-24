import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import reactionIcon from "~/scenes/Home/images/left-right-arrows.svg";

class MetadataSection extends Component {
  static propTypes = {};
  
  render() {
    const reactionMetadata = this.props.reactionMetadata[0];
    let title = reactionMetadata.reaction_name;
    if (!title) {
      title = reactionMetadata.equation;
    }

    if (
      !this.props.reactionMetadata ||
      this.props.reactionMetadata[0] === undefined
    ) {
      return <div></div>;
    } else {
      return (
        <div className="content-block">
          <h2 className="content-block-heading">{title}</h2>
          <div className="content-block-content img-description">
            <div className="vertical-center">
              <object
                data={reactionIcon}
                className="hover-zoom"
                alt="Reaction icon"
                aria-label="Reaction icon"
              />
            </div>

            <div className="metadata-description">
              <p>
                <b>Name:</b> {reactionMetadata.reaction_name}
              </p>
              <p>
                <b>Equation:</b> {reactionMetadata.equation}
              </p>
              <p>
                <b>EC Number:</b> {reactionMetadata.ecNumber}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }
}

export { MetadataSection };
