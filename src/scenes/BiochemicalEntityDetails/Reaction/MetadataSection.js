import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import reactionIcon from "~/scenes/Home/images/left-right-arrows.svg";

class MetadataSection extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      total_columns: [
        {
          dataField: "reactionID",
          text: "Reaction ID"
        },

        {
          dataField: "equation",
          text: "Reaction Equation",
          formatter: this.colFormatter
        }
      ],

      total_data: []
    };
    this.colFormatter = this.colFormatter.bind(this);
  }

  componentDidMount() {
    this.setState({ total_data: this.props.reactionMetadata });
  }

  componentDidUpdate(prevProps) {
    if (this.props.reactionMetadata !== prevProps.reactionMetadata) {
      this.setState({ total_data: this.props.reactionMetadata });
    }
  }

  colFormatter = (cell, row) => {
    if (cell) {
      const substrates = cell[0]
        .toString()
        .split("==>")[0]
        .split(" + ");
      const products = cell[0]
        .toString()
        .split("==>")[1]
        .split(" + ");
      const url =
        "/reaction/data/?substrates=" +
        substrates +
        "&products=" +
        products +
        "&substrates_inchi=" +
        cell[1]["sub_inchis"] +
        "&products_inchi=" +
        cell[1]["prod_inchis"];

      return <Link to={url}>{cell[0].toString()}</Link>;
    } else {
      return <div></div>;
    }
  };

  partFormatter = (cell, row) => {
    let participants = "";
    if (cell) {
      for (let i = cell.length - 1; i >= 0; i--) {
        participants = participants + cell[i] + " + ";
      }
      participants = participants.substring(0, participants.length - 3);
      return <div>{participants}</div>;
    } else {
      return <div></div>;
    }
  };

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
