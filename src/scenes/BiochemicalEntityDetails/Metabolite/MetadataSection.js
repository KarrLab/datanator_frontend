import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import {
  formatChemicalFormula,
  upperCaseFirstLetter,
  strCompare,
  removeDuplicates,
  castToArray
} from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";
import LazyLoad from "react-lazyload";

const reactStringReplace = require("react-string-replace");
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
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  getMetadataUrl(query, organism) {
    const abstract = true;

    return (
      "metabolites/concentration/" +
      "?metabolite=" +
      query +
      "&abstract=" +
      abstract +
      (organism ? "&species=" + organism : "")
    );
  }

  formatMetadata(rawData, organism) {
    let formattedData = null;
    for (const rawDataum of rawData) {
      for (const met of rawDataum) {
        formattedData = {};

        formattedData.name = met.name;

        formattedData.synonyms = met.synonyms.synonym;
        formattedData.synonyms.sort((a, b) => {
          return strCompare(a, b);
        });

        formattedData.description = null;
        if (met.description != null && met.description !== undefined) {
          formattedData.description = reactStringReplace(
            met.description,
            /[([]PMID: *(\d+)[)\]]/gi,
            pmid => {
              return (
                <span key={pmid}>
                  [
                  <a href={"https://www.ncbi.nlm.nih.gov/pubmed/" + pmid}>
                    PMID: {pmid}
                  </a>
                  ]
                </span>
              );
            }
          );
        }

        formattedData.physics = {
          smiles: met.smiles,
          inchi: met.inchi,
          inchiKey: met.inchikey,
          formula: formatChemicalFormula(met.chemical_formula),
          molWt: met.average_molecular_weight,
          charge: met.property.find(el => el.kind === "formal_charge").value,
          physiologicalCharge: met.property.find(
            el => el.kind === "physiological_charge"
          ).value
        };

        formattedData.pathways = castToArray(met.pathways.pathway);

        formattedData.pathways = removeDuplicates(
          formattedData.pathways,
          el => el.name
        );
        formattedData.pathways.sort((a, b) => {
          return strCompare(a.name, b.name);
        });

        formattedData.cellularLocations = castToArray(
          met.cellular_locations.cellular_location
        );

        formattedData.dbLinks = {
          biocyc: met.biocyc_id,
          cas: met.cas_registry_number,
          chebi: met.chebi_id,
          chemspider: met.chemspider_id,
          ecmdb: met.m2m_id,
          foodb: met.foodb_id,
          hmdb: met.hmdb_id,
          kegg: met.kegg_id,
          pubchem: met.pubchem_compound_id,
          ymdb: met.ymdb_id
        };
        break;
      }
      if (formattedData != null) {
        break;
      }
    }

    this.setState({ metadata: formattedData });

    const title = upperCaseFirstLetter(formattedData.name);

    const sections = [];
    if (formattedData.description)
      sections.push({ id: "description", title: "Description" });
    if (formattedData.synonyms.length > 0)
      sections.push({ id: "synonyms", title: "Synonyms" });
    if (Object.keys(formattedData.dbLinks).length > 0)
      sections.push({ id: "links", title: "Database links" });
    if (Object.values(formattedData.physics).some(val => val !== undefined))
      sections.push({ id: "physics", title: "Physics" });
    if (formattedData.cellularLocations.length > 0)
      sections.push({ id: "localizations", title: "Localizations" });
    if (formattedData.pathways.length > 0)
      sections.push({ id: "pathways", title: "Pathways" });

    this.props["set-scene-metadata"]({
      title: title,
      organism: organism,
      metadataSections: sections
    });
  }

  render() {
    const metadata = this.state.metadata;

    let physicalProps = [];
    let structure = null;
    const synonyms = [];
    const dbLinks = [];
    let cellularLocations = [];

    if (metadata) {
      // physical properties
      physicalProps = [
        { name: "SMILES", value: metadata.physics.smiles },
        { name: "InChI", value: metadata.physics.inchi },
        { name: "Formula", value: metadata.physics.formula },
        { name: "Molecular weight", value: metadata.physics.molWt },
        { name: "Charge", value: metadata.physics.charge },
        {
          name: "Physiological charge",
          value: metadata.physics.physiologicalCharge
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
      if (metadata.physics.smiles) {
        structure = { type: "", value: metadata.physics.smiles };
      } else if (metadata.physics.inchi) {
        structure = { type: "InChI=", value: metadata.physics.inchi };
      } else if (metadata.physics.inchiKey) {
        structure = { type: "InChIKey=", value: metadata.physics.inchiKey };
      }

      // synonyms
      for (var i = metadata.synonyms.length - 1; i >= 0; i--) {
        synonyms.push(
          <li key={metadata.synonyms[i]}>
            <div className="bulleted-list-item">{metadata.synonyms[i]}</div>
          </li>
        );
      }

      // database links
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

      cellularLocations = metadata.cellularLocations;
    }

    // render
    return (
      <div>
        <BaseMetadataSection
          entity-type="metabolite"
          get-metadata-url={this.getMetadataUrl}
          format-metadata={this.formatMetadata.bind(this)}
          set-scene-metadata={this.props["set-scene-metadata"]}
        />

        {metadata && (
          <div>
            {metadata.description && (
              <div className="content-block" id="description">
                <h2 className="content-block-heading">Description</h2>
                <div className="content-block-content icon-description">
                  {structure && (
                    <div className="entity-scene-icon-container">
                      <LazyLoad>
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
                      </LazyLoad>
                    </div>
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

            {metadata.cellularLocations.length > 0 && (
              <div className="content-block" id="localizations">
                <h2 className="content-block-heading">
                  Cellular localizations
                </h2>
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

            {metadata.pathways.length > 0 && (
              <div className="content-block" id="pathways">
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
        )}
      </div>
    );
  }
}

export default withRouter(MetadataSection);
