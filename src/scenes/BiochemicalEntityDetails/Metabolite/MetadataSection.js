import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";

const sprintf = require("sprintf-js").sprintf;

const STRUCTURE_IMG_ARGS = {
  format: "png",
  width: 300,
  height: 300,
  linewidth: 1,
  symbolfontsize: 10,
  bgcolor: "transparent",
  antialiasing: 0,
  crop: 0
};
const STRUCTURE_IMG_URL =
  "https://cactus.nci.nih.gov/chemical/structure/%s%s/image?" +
  Object.keys(STRUCTURE_IMG_ARGS)
    .map(el => {
      return el + "=" + STRUCTURE_IMG_ARGS[el];
    })
    .join("&");

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
    url: "https://www.chemspider.com/Chemical-Structure.%s.html"
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

    // structure
    let structure = null;
    if (metadata.smiles) {
      structure = { type: "", value: metadata.smiles };
    } else if (metadata.smiles) {
      structure = { type: "InChI=", value: metadata.inchi };
    } else if (metadata.smiles) {
      structure = { type: "InChIKey=", value: metadata.inchiKey };
    }

    // synonyms
    const synonyms = [];
    for (var i = metadata.synonyms.length - 1; i >= 0; i--) {
      synonyms.push(
        <li key={metadata.synonyms[i]}>
          <div className="bulleted-list-item">{metadata.synonyms[i]}</div>
        </li>
      );
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

    const cellularLocations = metadata.cellularLocations;

    // render
    return (
      <div>
        {metadata.description && (
          <div
            className="content-block"
            id="description"
            data-testid="description"
          >
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
                  crossOrigin=""
                />
              )}
              <div>{metadata.description}</div>
            </div>
          </div>
        )}

        {synonyms.length > 0 && (
          <div className="content-block" id="synonyms">
            <h2 className="content-block-heading">Synonyms</h2>
            <div className="content-block-content">
              <ul className="three-col-list">{synonyms}</ul>
            </div>
          </div>
        )}

        {dbLinks.length > 0 && (
          <div className="content-block" id="links">
            <h2 className="content-block-heading">Database links</h2>
            <div className="content-block-content">
              <ul className="key-value-list three-col-list link-list">
                {dbLinks}
              </ul>
            </div>
          </div>
        )}

        {physicalProps.length > 0 && (
          <div className="content-block" id="physics">
            <h2 className="content-block-heading">Physical properties</h2>
            <div className="content-block-content">
              <ul className="key-value-list">{physicalProps}</ul>
            </div>
          </div>
        )}

        {metadata.cellularLocations && metadata.cellularLocations.length > 0 && (
          <div className="content-block" id="localizations">
            <h2 className="content-block-heading">Cellular localizations</h2>
            <div className="content-block-content">
              <ul className="two-col-list">
                {cellularLocations.map(el => (
                  <li key={el}>
                    <div className="bulleted-list-item">{el}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {metadata.pathways && metadata.pathways.length > 0 && (
          <div className="content-block" id="biology">
            <h2 className="content-block-heading">Pathways</h2>
            <div className="content-block-content">
              <ul className="two-col-list link-list">
                {metadata.pathways.map(el => {
                  if (el.kegg_map_id) {
                    const map_id = el.kegg_map_id.substring(
                      2,
                      el.kegg_map_id.length
                    );
                    return (
                      <li key={el.name}>
                        <a
                          href={
                            "https://www.genome.jp/dbget-bin/www_bget?map" +
                            map_id
                          }
                          className="bulleted-list-item"
                          target="_blank"
                          rel="noopener noreferrer"
                          dangerouslySetInnerHTML={{
                            __html: upperCaseFirstLetter(el.name)
                          }}
                        ></a>
                      </li>
                    );
                  } else {
                    return (
                      <li key={el.name}>
                        <div
                          className="bulleted-list-item"
                          dangerouslySetInnerHTML={{
                            __html: upperCaseFirstLetter(el.name)
                          }}
                        ></div>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export { MetadataSection };
