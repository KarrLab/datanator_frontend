import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { abstractMolecule } from "~/data/actions/pageAction";

class MetadataSection extends Component {
  static propTypes = {
    metabolite: PropTypes.string.isRequired,
    "metabolite-metadata": PropTypes.array.isRequired,
    abstract: PropTypes.bool.isRequired,
    organism: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };

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
      ]
    };
    this.colFormatter = this.colFormatter.bind(this);
  }

  colFormatter = cell => {
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

  render() {
    let metaboliteMetadata = this.props["metabolite-metadata"];

    if (metaboliteMetadata.length === 0) {
      return <div></div>;
    }

    if (this.props.abstract === true) {
      const descriptions = [];
      for (const metaDatum of metaboliteMetadata) {
        descriptions.push(
          <div className="metadata-description-abstract">
            <p>
              <b>Name:</b>{" "}
              <Link
                to={"/metabolite/" + metaDatum.name + "/" + this.props.organism}
              >
                {metaDatum.name}
              </Link>
            </p>
            <p>
              <b>Chemical Formula:</b> {metaDatum.chemical_formula}
            </p>
          </div>
        );
      }

      return (
        <div className="content-block">
          <h2 className="content-block-heading">Similar metabolites</h2>
          <div className="content-block-content">
            {descriptions}
          </div>
        </div>
      );
    }

    metaboliteMetadata = metaboliteMetadata[0];

    return (
      <div className="content-block">
        <h2 className="content-block-heading">Similar metabolites</h2>
        <div className="content-block-content img-description">
          <div className="vertical-center">
            <img
              border="0"
              alt="W3Schools"
              src={
                "https://www.ebi.ac.uk/chebi/displayImage.do;jsessionid=25AAC07D77FBB12EBEFA4D5FEE270CD4?defaultImage=true&imageIndex=0&chebiId=" +
                metaboliteMetadata.chebi_id
              }
              width="200"
              height="200"
            />
          </div>

          <div className="metadata-description">
            <p>
              <b>Name:</b> {metaboliteMetadata.name}
            </p>
            <p>
              <b>Chemical Formula:</b> {metaboliteMetadata.chemical_formula}
            </p>
            <div className="inchi">
              <p>
                <b>InChI:</b> <font size="2">{metaboliteMetadata.inchi}</font>
              </p>
            </div>
            <p>
              <b>InChIKey:</b> {metaboliteMetadata.inchiKey}
            </p>
            <button
              type="button"
              onClick={() => {
                this.props.dispatch(abstractMolecule(true));
              }}
            >
              Include Structurally Similar Molecules
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export { MetadataSection };

/*
inchi:"InChI=1S/C9H15N2O15P3/c12-5-1-2-11(9(15)10-5)8-7(14)6(13)4(24-8)3-23-28(19,20)26-29(21,22)25-27(16,17)18/h1-2,4,6-8,13-14H,3H2,(H,19,20)(H,21,22)(H,10,12,15)(H2,16,17,18)/t4-,6-,7-,8-/m1/s1",
        inchiKey:"PGAVKCOVUIYSFO-XVFCMESISA-N",
        SMILES:"O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O",
        chemical_formula: "C9H15N2O15P3"
*/
