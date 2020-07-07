import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  formatChemicalFormula,
  strCompare,
  removeDuplicates,
  castToArray,
} from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";
import KeggPathwaysMetadataSection from "../KeggPathwaysMetadataSection";
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
  crop: 0,
};
const STRUCTURE_IMG_URL =
  "https://cactus.nci.nih.gov/chemical/structure/%s/image?" +
  Object.keys(STRUCTURE_IMG_ARGS)
    .map((el) => {
      return el + "=" + STRUCTURE_IMG_ARGS[el];
    })
    .join("&");

const DATABASES = {
  biocyc: {
    name: "BioCyC",
    url: "https://biocyc.org/compound?id=%s",
  },
  cas: {
    name: "CAS",
    url: "https://webbook.nist.gov/cgi/cbook.cgi?ID=%s",
  },
  chebi: {
    name: "CHEBI",
    url: "https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:%s",
  },
  chemspider: {
    name: "ChemSpider",
    url: "https://www.chemspider.com/Chemical-Structure.%s.html",
  },
  ecmdb: {
    name: "ECMDB",
    url: "http://ecmdb.ca/compounds/%s",
  },
  foodb: {
    name: "FooDB",
    url: "http://foodb.ca/compounds/%s",
  },
  hmdb: {
    name: "HMDB",
    url: "http://www.hmdb.ca/metabolites/%s",
  },
  kegg: {
    name: "KEGG",
    url: "https://www.genome.jp/dbget-bin/www_bget?cpd:%s",
  },
  pubchem: {
    name: "PubChem",
    url: "https://pubchem.ncbi.nlm.nih.gov/compound/%s",
  },
  ymdb: {
    name: "YMDB",
    url: "http://www.ymdb.ca/compounds/%s",
  },
};

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  static getMetadataUrl(query) {
    return "metabolites/meta/?inchikey=" + query;
  }

  static processMetadata(query, organism, rawData) {
    let processedData = {};
    const met = rawData;
    processedData = {};
    processedData.synonyms = null;
    processedData.description = null;
    processedData.pathways = null;
    processedData.cellularLocations = null;

    processedData.name = met.name;
    if (met.synonyms && met.synonyms.synonym) {
      processedData.synonyms = castToArray(met.synonyms.synonym).map((syn) => {
        return htmlEntityDecoder.feed(syn);
      });
      processedData.synonyms.sort((a, b) => {
        return strCompare(a, b);
      });
    }

    if (met.description != null && met.description !== undefined) {
      processedData.description = met.description;
      processedData.description = processedData.description.replace(
        / *\((OMIM|Wikipedia)\)/gi,
        ""
      );
      processedData.description = processedData.description.replace(
        / *\[(OMIM|Wikipedia)\]/gi,
        ""
      );
      processedData.description = reactStringReplace(
        processedData.description,
        /[([]PMID:? *(\d+)[)\]]/gi,
        (pmid) => {
          return (
            <span key={"PubMed-" + pmid}>
              [
              <a
                href={"https://www.ncbi.nlm.nih.gov/pubmed/" + pmid}
                target="_blank"
                rel="noopener noreferrer"
              >
                PubMed: {pmid}
              </a>
              ]
            </span>
          );
        }
      );
      processedData.description = reactStringReplace(
        processedData.description,
        /EC (\d+\.\d+\.\d+\.\d+)/i,
        (ecNumber) => {
          return (
            <span key={"EC-" + ecNumber}>
              EC:{" "}
              <a
                href={"https://enzyme.expasy.org/EC/" + ecNumber}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ecNumber}
              </a>
            </span>
          );
        }
      );
      processedData.description = reactStringReplace(
        processedData.description,
        /[([]Biocyc *(.*?)[)\]]/gi,
        (id) => {
          return (
            <span key={"BioCyc-" + id}>
              [
              <a
                href={"https://biocyc.org/META/NEW-IMAGE?object=" + id}
                target="_blank"
                rel="noopener noreferrer"
              >
                BioCyc: {id}
              </a>
              ]
            </span>
          );
        }
      );
    }

    const formalCharge = met.property.find((el) => el.kind === "formal_charge");
    const physiologicalCharge = met.property.find(
      (el) => el.kind === "physiological_charge"
    );
    processedData.chemistry = {
      smiles: met.smiles,
      inchi: met.inchi,
      inchiKey: met.InChI_Key,
      formula: formatChemicalFormula(met.chemical_formula),
      molWt: met.average_molecular_weight,
      charge: formalCharge ? formalCharge.value : null,
      physiologicalCharge: physiologicalCharge
        ? physiologicalCharge.value
        : null,
    };

    if (met.pathways) {
      processedData.pathways = castToArray(met.pathways.pathway);

      processedData.pathways = removeDuplicates(
        processedData.pathways,
        (el) => el.name
      );
      processedData.pathways.sort((a, b) => {
        return strCompare(a.name, b.name);
      });
    }

    if (met.cellular_locations) {
      const locs = castToArray(met.cellular_locations);
      processedData.cellularLocations = {};
      for (const loc of locs) {
        let locs = castToArray(loc.cellular_location);

        for (const ref of castToArray(loc.reference)) {
          let taxon = null;
          if (ref === "ECMDB") {
            taxon = "Escherichia coli (ECMDB)";
          } else if (ref === "YMDB") {
            taxon = "Saccharomyces cerevisiae (YMDB)";
          }
          if (!(taxon in processedData.cellularLocations)) {
            processedData.cellularLocations[taxon] = [];
          }
          processedData.cellularLocations[
            taxon
          ] = processedData.cellularLocations[taxon].concat(locs);
          processedData.cellularLocations[taxon].sort();
        }
      }
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
      ymdb: met.ymdb_id,
    };
    return processedData;
  }

  static formatTitle(processedData) {
    return processedData.name;
  }

  static formatMetadata(query, organism, processedData) {
    const sections = [];

    sections.push({
      id: "id",
      title: "Id",
      content: query,
    });

    if (processedData.description) {
      let structure = null;
      if (processedData.chemistry.smiles) {
        structure = {
          type: null,
          value: encodeURIComponent(processedData.chemistry.smiles),
        };
      } else if (processedData.chemistry.inchiKey) {
        structure = {
          type: "stdinchikey",
          value: processedData.chemistry.inchiKey,
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
                      (structure.type ? structure.type + "/" : "") +
                        structure.value
                    )}
                    className="entity-scene-icon"
                    alt="Chemical structure"
                    aria-label="Chemical structure"
                    crossOrigin=""
                  />
                </LazyLoad>
              </div>
            )}
            <div>{processedData.description}</div>
          </div>
        ),
      });
    }

    if (processedData.synonyms) {
      sections.push({
        id: "synonyms",
        title: "Synonyms",
        content: (
          <ul className="three-col-list">
            {processedData.synonyms.map((syn) => {
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
        ),
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
        ),
      });
    }

    if (
      Object.values(processedData.chemistry).some((val) => val !== undefined)
    ) {
      let physicalProps = [
        { name: "SMILES", value: processedData.chemistry.smiles },
        { name: "InChI", value: processedData.chemistry.inchi },
        { name: "Formula", value: processedData.chemistry.formula },
        { name: "Molecular weight", value: processedData.chemistry.molWt },
        { name: "Charge", value: processedData.chemistry.charge },
        {
          name: "Physiological charge",
          value: processedData.chemistry.physiologicalCharge,
        },
      ]
        .filter((prop) => {
          return prop.value !== undefined;
        })
        .map((prop) => {
          return (
            <li key={prop.name}>
              <b>{prop.name}:</b> {prop.value}
            </li>
          );
        });

      sections.push({
        id: "chemistry",
        title: "Chemistry",
        content: <ul className="key-value-list">{physicalProps}</ul>,
      });
    }

    if (processedData.cellularLocations) {
      let section = {
        id: "localizations",
        title: "Localizations",
        content: null,
      };

      let taxa = Object.keys(processedData.cellularLocations);
      if (taxa.length) {
        taxa.sort();

        section.content = (
          <ul className="vertically-spaced">
            {taxa.map((taxon) => (
              <li key={taxon}>
                <div className="bulleted-list-item">
                  {taxon}
                  <ul>
                    {processedData.cellularLocations[taxon].map((loc) => (
                      <li key={loc}>{loc}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        );
      } else {
        section.content = "No data is available.";
      }

      sections.push(section);
    }

    sections.push({
      id: "reactions",
      title: "Reactions",
      content: <ReactionSearchResultsList />,
    });
    if (processedData.pathways) {
      sections.push({
        id: "pathways",
        title: "Pathways",
        content: (
          <KeggPathwaysMetadataSection
            pathways={processedData.pathways}
            page-size={30}
            kegg-id-name={"kegg_map_id"}
            kegg-description-name={"name"}
          />
        ),
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
