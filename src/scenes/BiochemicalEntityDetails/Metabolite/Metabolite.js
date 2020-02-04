import React, { Component } from "react";
import { withRouter } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";
import axios from "axios";
import {
  formatChemicalFormula,
  dictOfArraysToArrayOfDicts,
  upperCaseFirstLetter,
  scrollTo,
  strCompare,
  removeDuplicates,
  sizeGridColumnsToFit,
  updateGridHorizontalScrolling,
  gridDataExportParams,
  downloadData,
  parseHistoryLocationPathname
} from "~/utils/utils";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";

import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { LinkCellRenderer } from "../LinkCellRenderer";
import { NumericCellRenderer } from "../NumericCellRenderer";
import { StatsToolPanel } from "../StatsToolPanel/StatsToolPanel.js";
import { TaxonomyFilter } from "../TaxonomyFilter.js";
import { TanimotoFilter } from "../TanimotoFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";

const reactStringReplace = require("react-string-replace");

const frameworkComponents = {
  linkCellRenderer: LinkCellRenderer,
  numericCellRenderer: NumericCellRenderer,
  statsToolPanel: StatsToolPanel,
  taxonomyFilter: TaxonomyFilter,
  tanimotoFilter: TanimotoFilter
};

const sideBar = {
  toolPanels: [
    {
      id: "columns",
      labelDefault: "Columns",
      labelKey: "columns",
      iconKey: "columns",
      toolPanel: "agColumnsToolPanel",
      toolPanelParams: {
        suppressRowGroups: true,
        suppressValues: true,
        suppressPivots: true,
        suppressPivotMode: true,
        suppressSideButtons: false,
        suppressColumnFilter: true,
        suppressColumnSelectAll: true,
        suppressColumnExpandAll: true
      }
    },
    {
      id: "filters",
      labelDefault: "Filters",
      labelKey: "filters",
      iconKey: "filter",
      toolPanel: "agFiltersToolPanel",
      toolPanelParams: {
        suppressFilterSearch: true,
        suppressExpandAll: true
      }
    },
    {
      id: "stats",
      labelDefault: "Stats",
      labelKey: "chart",
      iconKey: "chart",
      toolPanel: "statsToolPanel",
      toolPanelParams: {
        col: "value"
      }
    }
  ],
  position: "left",
  defaultToolPanel: "filters",
  hiddenByDefault: false
};

const defaultColDef = {
  minWidth: 100,
  filter: "agTextColumnFilter",
  sortable: true,
  resizable: true,
  suppressMenu: true
};

class Metabolite extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.grid = React.createRef();

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.cancelDataTokenSource = null;
    this.cancelTaxonInfoTokenSource = null;

    this.state = {
      metadata: null,
      data: null,
      lineage: [],
      columnDefs: null
    };

    this.formatData = this.formatData.bind(this);
    this.sizeGridColumnsToFit = this.sizeGridColumnsToFit.bind(this);
    this.updateGridHorizontalScrolling = this.updateGridHorizontalScrolling.bind(
      this
    );
    this.onClickExportDataCsv = this.onClickExportDataCsv.bind(this);
    this.onClickExportDataJson = this.onClickExportDataJson.bind(this);
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
    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }
    if (this.cancelTaxonInfoTokenSource) {
      this.cancelTaxonInfoTokenSource.cancel();
    }
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      this.setColumnDefs();
      this.setState({ metadata: null, data: null });
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const route = parseHistoryLocationPathname(this.props.history);
    const query = route.query;
    const organism = route.organism;
    const abstract = true;

    // cancel earlier query
    if (this.cancelDataTokenSource) {
      this.cancelDataTokenSource.cancel();
    }

    const url =
      "metabolites/concentration/" +
      "?metabolite=" +
      query +
      "&abstract=" +
      abstract +
      (organism ? "&species=" + organism : "");
    this.cancelDataTokenSource = axios.CancelToken.source();
    getDataFromApi(
      [url],
      { cancelToken: this.cancelDataTokenSource.token },
      "Unable to retrieve data about metabolite '" + query + "'."
    )
      .then(response => {
        if (!response) return;
        this.formatData(response.data);
      })
      .finally(() => {
        this.cancelDataTokenSource = null;
      });

    if (organism) {
      // cancel earlier query
      if (this.cancelTaxonInfoTokenSource) {
        this.cancelTaxonInfoTokenSource.cancel();
      }

      this.cancelTaxonInfoTokenSource = axios.CancelToken.source();
      getDataFromApi(
        ["taxon", "canon_rank_distance_by_name/?name=" + organism],
        { cancelToken: this.cancelTaxonInfoTokenSource.token },
        "Unable to obtain taxonomic information about '" + organism + "'."
      )
        .then(response => {
          if (!response) return;
          this.setState({ lineage: response.data });
        })
        .finally(() => {
          this.cancelTaxonInfoTokenSource = null;
        });
    }
  }

  formatData(data) {
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
          el => el["kind"] === "formal_charge"
        ).value;
        metadata.physiologicalCharge = met.property.find(
          el => el["kind"] === "physiological_charge"
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

    const allConcs = [];
    for (const datum of data) {
      for (const met of datum) {
        const species = "species" in met ? met.species : "Escherichia coli";

        const metConcs = dictOfArraysToArrayOfDicts(met.concentrations);

        for (const metConc of metConcs) {
          let uncertainty = parseFloat(metConc.error);
          if (uncertainty === 0 || isNaN(uncertainty)) {
            uncertainty = null;
          }
          const conc = {
            name: met.name,
            tanimotoSimilarity: met.tanimoto_similarity,
            value: parseFloat(metConc.concentration),
            uncertainty: uncertainty,
            units: metConc.concentration_units,
            organism:
              Object.prototype.hasOwnProperty.call(metConc, "strain") &&
              metConc.strain
                ? species + " " + metConc.strain
                : species,
            taxonomicProximity: met.taxon_distance,
            growth_phase:
              "growth_status" in metConc ? metConc.growth_status : null,
            growth_media:
              "growth_media" in metConc ? metConc.growth_media : null,
            growth_conditions:
              "growth_system" in metConc ? metConc.growth_system : null,
            source_link:
              "m2m_id" in met
                ? { source: "ecmdb", id: met.m2m_id }
                : { source: "ymdb", id: met.ymdb_id }
          };
          if (conc.growth_phase && conc.growth_phase.indexOf(" phase") >= 0) {
            conc.growth_phase = conc.growth_phase.split(" phase")[0];
          }
          if (conc.growth_phase && conc.growth_phase.indexOf(" Phase") >= 0) {
            conc.growth_phase = conc.growth_phase.split(" Phase")[0];
          }
          if (!isNaN(conc.value)) {
            allConcs.push(conc);
          }
        }
      }
    }

    this.setState({
      metadata: metadata,
      data: allConcs
    });
  }

  setColumnDefs() {
    const route = parseHistoryLocationPathname(this.props.history);
    const organism = route.organism;

    const columnDefs = [
      {
        headerName: "Concentration (µM)",
        field: "value",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "agNumberColumnFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        headerName: "Uncertainty (µM)",
        field: "uncertainty",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        hide: true,
        filter: "agNumberColumnFilter"
      },
      {
        headerName: "Metabolite",
        field: "name",
        filter: "agSetColumnFilter",
        menuTabs: ["filterMenuTab"],
        cellRenderer: "linkCellRenderer",
        cellRendererParams: {
          route: "metabolite",
          organism: organism
        }
      },
      {
        headerName: "Chemical similarity",
        field: "tanimotoSimilarity",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        hide: true,
        filter: "tanimotoFilter",
        valueFormatter: params => {
          return params.value.toFixed(3);
        }
      },
      {
        headerName: "Organism",
        field: "organism",
        filter: "agSetColumnFilter"
      },
      {
        headerName: "Taxonomic distance",
        field: "taxonomicProximity",
        hide: true,
        filter: "taxonomyFilter",
        valueFormatter: params => {
          const value = params.value;
          return value;
        }
      },
      {
        headerName: "Growth phase",
        field: "growth_phase",
        filter: "agSetColumnFilter",
        hide: true
      },
      {
        headerName: "Conditions",
        field: "growth_conditions",
        filter: "agTextColumnFilter",
        hide: true
      },
      {
        headerName: "Media",
        field: "growth_media",
        filter: "agTextColumnFilter",
        hide: true
      },
      {
        headerName: "Source",
        field: "source_link",
        cellRenderer: function(params) {
          if (params.value["source"] === "ecmdb") {
            return (
              '<a href="http://ecmdb.ca/compounds/' +
              params.value.id +
              '" target="_blank" rel="noopener noreferrer">' +
              "ECMDB" +
              "</a>"
            );
          } else {
            return (
              '<a href="http://www.ymdb.ca/compounds/' +
              params.value.id +
              '" target="_blank" rel="noopener noreferrer">' +
              "YMDB" +
              "</a>"
            );
          }
        },
        filter: "agSetColumnFilter",
        filterValueGetter: params => {
          return params.data.source_link.source.toUpperCase();
        }
      }
    ];

    if (!organism) {
      columnDefs.splice(5, 1);
    }
    this.setState({
      columnDefs: columnDefs
    });
  }

  sizeGridColumnsToFit(event) {
    sizeGridColumnsToFit(event, this.grid.current);
  }

  updateGridHorizontalScrolling(event) {
    updateGridHorizontalScrolling(event, this.grid.current);
  }

  onClickExportDataCsv() {
    const gridApi = this.grid.current.api;
    gridApi.exportDataAsCsv(gridDataExportParams);
  }

  onClickExportDataJson() {
    downloadData(
      JSON.stringify(this.state.data),
      "data.json",
      "application/json"
    );
  }

  render() {
    if (this.state.metadata == null || this.state.data == null) {
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

            <div className="content-block measurements" id="concentration">
              <div className="content-block-heading-container">
                <h2 className="content-block-heading">Concentration</h2>
                <div className="content-block-heading-actions">
                  Export:{" "}
                  <button
                    className="text-button"
                    onClick={this.onClickExportDataCsv}
                  >
                    CSV
                  </button>{" "}
                  |{" "}
                  <button
                    className="text-button"
                    onClick={this.onClickExportDataJson}
                  >
                    JSON
                  </button>
                </div>
              </div>
              <div className="ag-theme-balham">
                <AgGridReact
                  ref={this.grid}
                  modules={AllModules}
                  frameworkComponents={frameworkComponents}
                  sideBar={sideBar}
                  defaultColDef={defaultColDef}
                  columnDefs={this.state.columnDefs}
                  rowData={this.state.data}
                  rowSelection="multiple"
                  groupSelectsChildren={true}
                  suppressMultiSort={true}
                  suppressAutoSize={true}
                  suppressMovableColumns={true}
                  suppressCellSelection={true}
                  suppressRowClickSelection={true}
                  suppressContextMenu={true}
                  domLayout="autoHeight"
                  onGridSizeChanged={this.sizeGridColumnsToFit}
                  onColumnVisible={this.sizeGridColumnsToFit}
                  onColumnResized={this.updateGridHorizontalScrolling}
                  onToolPanelVisibleChanged={this.sizeGridColumnsToFit}
                  onFirstDataRendered={this.sizeGridColumnsToFit}
                  lineage={this.state.lineage}
                ></AgGridReact>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Metabolite);
