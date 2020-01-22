import React, { Component } from "react";

import reactionIcon from "~/scenes/Home/images/left-right-arrows.svg";
import Typography from "@material-ui/core/Typography";

import { Link } from "react-router-dom";

const products = [{ id: "3", name: "bob" }];
const columns = [
  {
    dataField: "id",
    text: "Product ID"
  },
  {
    dataField: "name",
    text: "Product Name"
  },
  {
    dataField: "price",
    text: "Product Price"
  }
];

class MetadataSection extends Component {
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
      let substrates = cell[0]
        .toString()
        .split("==>")[0]
        .split(" + ");
      let products = cell[0]
        .toString()
        .split("==>")[1]
        .split(" + ");
      let url =
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
      for (var i = cell.length - 1; i >= 0; i--) {
        participants = participants + cell[i] + " + ";
      }
      participants = participants.substring(0, participants.length - 3);
      return <div>{participants}</div>;
    } else {
      return <div></div>;
    }
  };




  render() {
    let reactionMetadata = this.props.reactionMetadata[0];
    console.log(reactionMetadata.reaction_name)


    if (!this.props.reactionMetadata || this.props.reactionMetadata[0] == undefined) {
      return <div></div>;
    } else {
      return (
      <div className="definition-data">
        <Typography variant="h6" className={"green"}>
          {reactionMetadata.reaction_name}
        </Typography>

        <div className="img-description">
          <div className="vertical-center">
            <object
                  data={reactionIcon}
                  className="section-column-icon hover-zoom"
                  alt="Reaction rate constant icon"
                  aria-label="Reaction rate constant icon"
                />
          </div>

          <div className="metadata-description">
            <p>
              <b>Name:</b> {reactionMetadata.reaction_name}
            </p>
            <p>
              <b>Equation:</b> {" "}
                {reactionMetadata.equation}
            </p>
            <p>
              <b>EC Number:</b> {" "}
                {reactionMetadata.ecNumber}
            </p>

          </div>
        </div>
      </div>)
    }
  }
}

export { MetadataSection };
