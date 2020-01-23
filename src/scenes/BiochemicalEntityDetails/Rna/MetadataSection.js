import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { abstractMolecule } from "~/data/actions/pageAction";
import rnaIcon from "~/scenes/Home/images/trna.svg";



class MetadataSection extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {

    };
  }



  render() {
    let rnaMetadata = this.props.rnaMetadata;

    if (rnaMetadata[0] === undefined || rnaMetadata[0].length === 0) {
      return <div></div>;
    }
    rnaMetadata = rnaMetadata[0];



    return (
      <div className="content-block">
        <h2 className="content-block-heading">{rnaMetadata.gene_name}</h2>
        <div className="content-block-content img-description">
          <div className="vertical-center">
            <object
                  data={rnaIcon}
                  className="section-column-icon hover-zoom"
                  alt="RNA icon"
                  aria-label="RNA icon"
                />
          </div>

          <div className="metadata-description">
            <p>
              <b>Gene Name:</b> {rnaMetadata.gene_name}
            </p>
            <p>
              <b>Protein Name:</b> {rnaMetadata.protein_name}
            </p>
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
