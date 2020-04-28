import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  formatChemicalFormula,
  upperCaseFirstLetter,
  strCompare,
  removeDuplicates,
  castToArray
} from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";
import Pathways from "../Pathways";
import LazyLoad from "react-lazyload";
import ReactionSearchResultsList from "./ReactionSearchResultsList";

const htmlEntityDecoder = require("html-entity-decoder");
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

  static getMetadataUrl(query) {
    return "/metabolites/meta/?_input=" + query;
  }

  static processMetadata(rawData) {
    let processedData = {};
    const met = rawData;
    processedData = {};
    processedData.synonyms = null;
    processedData.description = null;
    processedData.pathways = null;
    processedData.cellularLocations = null;

    processedData.name = met.name;
    if (met.synonyms.synonym) {
      if (typeof met.synonyms.synonym === "string") {
        met.synonyms.synonym = [met.synonyms.synonym];
      }

      processedData.synonyms = met.synonyms.synonym.map(syn => {
        return htmlEntityDecoder.feed(syn);
      });
      processedData.synonyms.sort((a, b) => {
        return strCompare(a, b);
      });
    }

    if (met.description != null && met.description !== undefined) {
      processedData.description = reactStringReplace(
        met.description,
        /[([]PMID:? *(\d+)[)\]]/gi,
        pmid => {
          return (
            <span key={pmid}>
              [
              <a href={"https://www.ncbi.nlm.nih.gov/pubmed/" + pmid}>
                PubMed: {pmid}
              </a>
              ]
            </span>
          );
        }
      );
    }

    processedData.physics = {
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

    if (met.pathways) {
      if (!Array.isArray(met.pathways.pathway)) {
        met.pathways.pathway = [met.pathways.pathway];
      }
      processedData.pathways = castToArray(met.pathways.pathway);

      processedData.pathways = removeDuplicates(
        processedData.pathways,
        el => el.name
      );
      processedData.pathways.sort((a, b) => {
        return strCompare(a.name, b.name);
      });
    }

    if (met.cellularLocations) {
      processedData.cellularLocations = castToArray(
        met.cellular_locations.cellular_location
      );
    }

    processedData.dbLinks = {
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
    console.log(processedData);
    return processedData;
  }

  static formatTitle(processedData) {
    return upperCaseFirstLetter(processedData.name);
  }

  static formatMetadata(processedData) {
    const sections = [];
    if (processedData.description) {
      let structure;
      if (processedData.physics.smiles) {
        structure = { type: "", value: processedData.physics.smiles };
      } else if (processedData.physics.inchi) {
        structure = { type: "InChI=", value: processedData.physics.inchi };
      } else if (processedData.physics.inchiKey) {
        structure = {
          type: "InChIKey=",
          value: processedData.physics.inchiKey
        };
      }

      sections.push({
        id: "description",
        title: "Description",
        content: (
          <div className="icon-description">
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
            <div>{processedData.description}</div>
          </div>
        )
      });
    }

    if (processedData.synonyms) {
      sections.push({
        id: "synonyms",
        title: "Synonyms",
        content: (
          <ul className="three-col-list">
            {processedData.synonyms.map(syn => {
              return (
                <li key={syn}>
                  <div
                    className="bulleted-list-item"
                    dangerouslySetInnerHTML={{ __html: syn }}
                  ></div>
                </li>
              );
            })}
          </ul>
        )
      });
    }

    if (Object.keys(processedData.dbLinks).length > 0) {
      const dbLinks = [];
      for (const dbKey in processedData.dbLinks) {
        const dbId = processedData.dbLinks[dbKey];
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

      sections.push({
        id: "cross-refs",
        title: "Cross references",
        content: (
          <ul className="key-value-list three-col-list link-list">{dbLinks}</ul>
        )
      });
    }

    if (Object.values(processedData.physics).some(val => val !== undefined)) {
      let physicalProps = [
        { name: "SMILES", value: processedData.physics.smiles },
        { name: "InChI", value: processedData.physics.inchi },
        { name: "Formula", value: processedData.physics.formula },
        { name: "Molecular weight", value: processedData.physics.molWt },
        { name: "Charge", value: processedData.physics.charge },
        {
          name: "Physiological charge",
          value: processedData.physics.physiologicalCharge
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

      sections.push({
        id: "physics",
        title: "Physics",
        content: <ul className="key-value-list">{physicalProps}</ul>
      });
    }

    if (processedData.cellularLocations) {
      sections.push({
        id: "localizations",
        title: "Localizations",
        content: (
          <ul className="two-col-list">
            {processedData.cellularLocations.map(el => (
              <li key={el}>
                <div className="bulleted-list-item">{el}</div>
              </li>
            ))}
          </ul>
        )
      });
    }

    sections.push({
      id: "reactions",
      title: "Reactions",
      content: <ReactionSearchResultsList />
    });
    if (processedData.pathways) {
      sections.push({
        id: "pathways",
        title: "Pathways",
        content: <Pathways pathways={processedData.pathways} page-size={30} />
      });
    }

    return sections;
  }

  render() {
    return (
      <BaseMetadataSection
        entity-type="metabolite"
        get-metadata-url={MetadataSection.getMetadataUrl}
        process-metadata={MetadataSection.processMetadata}
        format-title={MetadataSection.formatTitle}
        format-metadata={MetadataSection.formatMetadata}
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { MetadataSection };
