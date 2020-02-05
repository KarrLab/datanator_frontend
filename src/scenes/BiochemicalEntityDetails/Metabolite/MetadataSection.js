import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";
import {
  formatChemicalFormula,
  upperCaseFirstLetter,
  strCompare,
  removeDuplicates,
  parseHistoryLocationPathname
} from "~/utils/utils";

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
    history: PropTypes.object.isRequired,
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.cancelTokenSource = null;

    this.state = { metadata: null };
  }

  componentDidMount() {
    this.locationPathname = this.props.history.location.pathname;
    this.unlistenToHistory = this.props.history.listen(location => {
      if (location.pathname !== this.locationPathname) {
        this.locationPathname = this.props.history.location.pathname;
        this.updateStateFromLocation();
      }
    });
    this.updateStateFromLocation();
  }

  componentWillUnmount() {
    this.unlistenToHistory();
    this.unlistenToHistory = null;
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      this.setState({ metadata: null });
      this.props["set-scene-metadata"](null);
      this.getMetadataFromApi();
    }
  }

  getMetadataFromApi() {
    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;
    const organism = route.organism;
    const abstract = true;

    // cancel earlier query
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    const url =
      "metabolites/concentration/" +
      "?metabolite=" +
      query +
      "&abstract=" +
      abstract +
      (organism ? "&species=" + organism : "");
    this.cancelTokenSource = axios.CancelToken.source();
    getDataFromApi(
      [url],
      { cancelToken: this.cancelTokenSource.token },
      "Unable to retrieve data about metabolite '" + query + "'."
    )
      .then(response => {
        if (!response) return;
        this.formatMetadata(response.data);
      })
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  formatMetadata(data) {
    if (data == null) {
      return;
    }

    let metadata = null;
    for (const datum of data) {
      for (const met of datum) {
        metadata = {};

        metadata.name = met.name;

        metadata.synonyms = met.synonyms.synonym;
        metadata.synonyms.sort((a, b) => {
          return strCompare(a, b);
        });

        if (met.description != null && met.description !== undefined) {
          metadata.description = reactStringReplace(
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
        } else {
          metadata.description = null;
        }

        metadata.smiles = met.smiles;
        metadata.inchi = met.inchi;
        metadata.inchiKey = met.inchikey;
        metadata.formula = formatChemicalFormula(met.chemical_formula);
        metadata.molWt = met.average_molecular_weight;
        metadata.charge = met.property.find(
          el => el.kind === "formal_charge"
        ).value;
        metadata.physiologicalCharge = met.property.find(
          el => el.kind === "physiological_charge"
        ).value;

        metadata.pathways = met.pathways.pathway;
        if (metadata.pathways) {
          if (!Array.isArray(metadata.pathways)) {
            metadata.pathways = [metadata.pathways];
          }
        } else {
          metadata.pathways = [];
        }

        metadata.pathways = removeDuplicates(metadata.pathways, el => el.name);
        metadata.pathways.sort((a, b) => {
          return strCompare(a.name, b.name);
        });

        metadata.cellularLocations = met.cellular_locations.cellular_location;
        if (!Array.isArray(metadata.cellularLocations)) {
          if (metadata.cellularLocations) {
            metadata.cellularLocations = [metadata.cellularLocations];
          } else {
            metadata.cellularLocations = [];
          }
        }

        metadata.dbLinks = {
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
      if (metadata != null) {
        break;
      }
    }

    this.setState({ metadata: metadata });

    let title = metadata.name;
    title = upperCaseFirstLetter(title);

    const sections = [
      { id: "description", title: "Description" },
      { id: "synonyms", title: "Synonyms" },
      { id: "links", title: "Database links" },
      { id: "physics", title: "Physics" },
      { id: "localizations", title: "Localizations" },
      { id: "pathways", title: "Pathways" }
    ];
    this.props["set-scene-metadata"]({
      title: title,
      metadataSections: sections
    });
  }

  render() {
    const metadata = this.state.metadata;

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
          <div className="content-block" id="synonyms" data-testid="synonyms">
            <h2 className="content-block-heading">Synonyms</h2>
            <div className="content-block-content">
              <ul className="three-col-list">{synonyms}</ul>
            </div>
          </div>
        )}

        {dbLinks.length > 0 && (
          <div className="content-block" id="links" data-testid="links">
            <h2 className="content-block-heading">Database links</h2>
            <div className="content-block-content">
              <ul className="key-value-list three-col-list link-list">
                {dbLinks}
              </ul>
            </div>
          </div>
        )}

        {physicalProps.length > 0 && (
          <div className="content-block" id="physics" data-testid="physics">
            <h2 className="content-block-heading">Physical properties</h2>
            <div className="content-block-content">
              <ul className="key-value-list">{physicalProps}</ul>
            </div>
          </div>
        )}

        {metadata.cellularLocations && metadata.cellularLocations.length > 0 && (
          <div
            className="content-block"
            id="localizations"
            data-testid="localizations"
          >
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
          <div className="content-block" id="biology" data-testid="biology">
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

export default withRouter(MetadataSection);
