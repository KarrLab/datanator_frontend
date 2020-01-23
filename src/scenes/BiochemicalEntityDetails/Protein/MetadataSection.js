import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { abstractMolecule } from "~/data/actions/pageAction";

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
    let proteinMetadata = this.props.proteinMetadata;

    if (proteinMetadata[0] === undefined || proteinMetadata[0].length === 0) {
      return <div></div>;
    }
    proteinMetadata = proteinMetadata[0];

    const uniprot_ids = proteinMetadata.uniprot_ids;
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
      <div className="content-block">
        <h2 className="content-block-heading">{proteinMetadata.ko_name[0]}</h2>
        <div className="content-block-content img-description">
          <div className="vertical-center">
            <img
              border="0"
              alt="W3Schools"
              src={"https://image.flaticon.com/icons/png/512/1951/1951420.png"}
              width="80%"
              height="80%"
            ></img>
          </div>

          <div className="metadata-description">
            <p>
              <b>Name:</b> {proteinMetadata.ko_name[0]}
            </p>
            <p>
              <b>KO Number:</b>{" "}
              <a
                href={
                  "https://www.genome.jp/dbget-bin/www_bget?ko:" +
                  proteinMetadata.ko_number
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {proteinMetadata.ko_number}
              </a>
            </p>
            <p>
              <b>Uniprot IDs:</b> {uniprot_links}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export { MetadataSection };
