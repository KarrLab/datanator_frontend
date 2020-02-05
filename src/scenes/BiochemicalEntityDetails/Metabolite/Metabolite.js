import React, { Component } from "react";
import { withRouter } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";
import axios from "axios";
import { getDataFromApi } from "~/services/RestApi";
import {
  formatChemicalFormula,
  upperCaseFirstLetter,
  scrollTo,
  strCompare,
  removeDuplicates,
  parseHistoryLocationPathname
} from "~/utils/utils";
import { MetadataSection } from "./MetadataSection";
import { ConcentrationDataTable } from "./ConcentrationDataTable";

import "../BiochemicalEntityDetails.scss";

const reactStringReplace = require("react-string-replace");

class Metabolite extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
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
  }

  render() {
    if (this.state.metadata == null) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;
    const organism = route.organism;

    let title = this.state.metadata.name;
    title = upperCaseFirstLetter(title);

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-metabolite-scene">
        <h1 className="page-title">Metabolite: {title}</h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <HashLink to="#description" scroll={scrollTo}>
                      Description
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#synonyms" scroll={scrollTo}>
                      Synonyms
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#links" scroll={scrollTo}>
                      Database links
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#physics" scroll={scrollTo}>
                      Physics
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#localizations" scroll={scrollTo}>
                      Localizations
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#pathways" scroll={scrollTo}>
                      Pathways
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#concentration" scroll={scrollTo}>
                      Concentration
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column section">
            <MetadataSection
              metadata={this.state.metadata}
              metabolite={query}
              organism={organism}
            />

            <ConcentrationDataTable />
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Metabolite);
