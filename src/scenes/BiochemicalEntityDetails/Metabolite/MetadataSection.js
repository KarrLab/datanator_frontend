import React, { Component } from "react";
import PropTypes from "prop-types";

const sprintf = require("sprintf-js").sprintf;

const STRUCTURE_IMG_ARGS = {
  format: "png",
  width: 300,
  height: 300,
  linewidth: 1,
  symbolfontsize: 10,
  bgcolor: "transparent",
  antialiasing: 0,
  crop: 0,
};
const STRUCTURE_IMG_URL = "http://cactus.nci.nih.gov/chemical/structure/%s%s/image?" + 
  Object.keys(STRUCTURE_IMG_ARGS).map(el => {return el + "=" + STRUCTURE_IMG_ARGS[el]}).join("&");

const DATABASES = {
  biocyc: {
    name: "BioCyC",
    url: "https://biocyc.org/compound?id=%s"
  },
  cas: {
    name: "CAS",
    url: "https://webbook.nist.gov/cgi/cbook.cgi?ID=%s"
  },
  chebi: {
    name: "CHEBI",
    url: "https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:%s"
  },
  chemspider: {
    name: "ChemSpider",
    url: "http://www.chemspider.com/Chemical-Structure.%s.html"
  },
  ecmdb: {
    name: "ECMDB",
    url: "http://ecmdb.ca/compounds/%s"
  },
  foodb: {
    name: "FooDB",
    url: "http://foodb.ca/compounds/%s"
  },
  hmdb: {
    name: "HMDB",
    url: "http://www.hmdb.ca/metabolites/%s"
  },
  kegg: {
    name: "KEGG",
    url: "https://www.genome.jp/dbget-bin/www_bget?cpd:%s"
  },
  pubchem: {
    name: "PubChem",
    url: "https://pubchem.ncbi.nlm.nih.gov/compound/%s"
  },
  ymdb: {
    name: "YMDB",
    url: "http://www.ymdb.ca/compounds/%s"
  }
};

class MetadataSection extends Component {
  static propTypes = {
    metabolite: PropTypes.string.isRequired,
    metadata: PropTypes.object.isRequired,
    organism: PropTypes.string,
    dispatch: PropTypes.func
  };

  render() {
    const metadata = this.props.metadata;

    if (!metadata) {
      return <div></div>;
    }

    // physical properties
    const physicalProps = [
      { name: "SMILES", value: metadata.smiles },
      { name: "InChI", value: metadata.inchi },
      { name: "Formula", value: metadata.formula },
      { name: "Molecular weight", value: metadata.molWt },
      { name: "Charge", value: metadata.charge },
      {
        name: "Physiological charge",
        value: metadata.physiologicalCharge
      }
    ]
      .filter(prop => {
        return prop.value !== undefined;
      })
      .map(prop => {
        return (
          <li key={prop.name}>
            <b>{prop.name}:</b> {prop.value}
          </li>
        );
      });

    let structure = null;
    if (metadata.smiles) {
      structure = { type: "", value: metadata.smiles };
    } else if (metadata.smiles) {
      structure = { type: "InChI=", value: metadata.inchi };
    } else if (metadata.smiles) {
      structure = { type: "InChIKey=", value: metadata.inchiKey };
    }

    let synonym_list = []
    for (var i = metadata.synonyms.length - 1; i >= 0; i--) {
      synonym_list.push(<li>{metadata.synonyms[i]}</li>)
    }

    // database links
    const dbLinks = [];
    for (const dbKey in metadata.dbLinks) {
      const dbId = metadata.dbLinks[dbKey];
      if (dbId != null && dbId !== undefined && dbKey in DATABASES) {
        const db = DATABASES[dbKey];
        dbLinks.push(
          <li key={dbKey}>
            <b>{db["name"]}:</b>{" "}
            <a
              href={sprintf(db["url"], dbId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {dbId}
            </a>
          </li>
        );
      }
    }

    let cellularLocations;
    if (Array.isArray(metadata.cellularLocations)) {
      cellularLocations = metadata.cellularLocations.join(', ');
    } else if (metadata.cellularLocations) {
      cellularLocations = metadata.cellularLocations;
    }

    // render
    return (
      <div>        
        {metadata.description && (
          <div className="content-block" id="description">
            <h2 className="content-block-heading">Description</h2>
            <div className="content-block-content icon-description">
              {structure && (
              <img
                src={sprintf(
                  STRUCTURE_IMG_URL,
                  structure.type,
                  structure.value
                )}
                className="entity-scene-icon hover-zoom"
                alt="Chemical structure"
                aria-label="Chemical structure"
              />
              )}
              <div>
                {metadata.description}
              </div>
            </div>
          </div>
        )}

        {synonym_list.length > 0 && (
          <div className="content-block" id="synonyms">
            <h2 className="content-block-heading">Synonyms</h2>
            <div className="content-block-content">
              <ul>
                {synonym_list}
              </ul>
            </div>
          </div>
        )}

        {dbLinks.length > 0 && (
          <div className="content-block" id="links">
            <h2 className="content-block-heading">Database links</h2>
            <div className="content-block-content">
              <ul className="key-value-list">
                {dbLinks.reduce(
                  (acc, x) => (acc === null ? [x] : [acc, x]),
                  null
                )}
              </ul>
            </div>
          </div>
        )}

        {physicalProps.length > 0 && (
          <div className="content-block" id="physics">
            <h2 className="content-block-heading">Physical properties</h2>
            <div className="content-block-content">
              <ul className="key-value-list">
                {physicalProps.reduce(
                  (acc, x) => (acc === null ? [x] : [acc, x]),
                  null
                )}
              </ul>
            </div>
          </div>
        )}

        {((metadata.pathways && metadata.pathways.length > 0) ||
          (metadata.cellularLocations &&
            metadata.cellularLocations.length > 0)) && (
          <div className="content-block" id="biology">
            <h2 className="content-block-heading">Biological context</h2>
            <div className="content-block-content">
              <ul className="key-value-list key-value-list-spaced">
              {metadata.pathways && metadata.pathways.length > 0 && (
                <li>
                  <b>Pathways:</b>{" "}
                  {metadata.pathways
                    .map(el => {
                      return (
                        <a
                          key={el.kegg_map_id}
                          href={
                            "https://www.genome.jp/dbget-bin/www_bget?map" +
                            el.kegg_map_id
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {el.name}
                        </a>
                      );
                    })
                    .reduce((acc, x) => (acc === null ? [x] : [acc, x]), null)}
                </li>
              )}

              {cellularLocations && (
                  <li>
                    <b>Localizations:</b>{" "}{cellularLocations}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}        
      </div>
    );
  }
}

export { MetadataSection };
