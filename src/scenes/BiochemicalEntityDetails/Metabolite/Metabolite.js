import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import { setTotalData, setSelectedData } from "~/data/actions/resultsAction";

import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import StatsToolPanel from "./StatsToolPanel.js";
import { TaxonomyFilter } from "../TaxonomyFilter.js";
import { TanimotoFilter } from "../TanimotoFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import { formatChemicalFormula } from "~/utils/utils";

import "../BiochemicalEntityDetails.scss";
import "./Metabolite.scss";

const frameworkComponents = {
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
      toolPanel: "statsToolPanel"
    }
  ],
  position: "left",
  defaultToolPanel: "filters",
  hiddenByDefault: false
};

const defaultColDef = {
  filter: "agTextColumnFilter",
  sortable: true,
  resizable: true,
  suppressMenu: true
};

const columnDefs = [
  {
    headerName: "Concentration (µM)",
    field: "concentration",
    filter: "agNumberColumnFilter",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true
  },
  {
    headerName: "Uncertainty (µM)",
    field: "error",
    valueGetter: params => {
      const val = params.data.error;
      return val === 0 ? null : val;
    },
    hide: true,
    sortable: true,
    filter: "agNumberColumnFilter"
  },
  {
    headerName: "Metabolite",
    field: "name",
    filter: "agSetColumnFilter",
    menuTabs: ["filterMenuTab"]
  },
  {
    headerName: "Chemical similarity",
    field: "tanimoto_similarity",
    hide: true,
    filter: "tanimotoFilter"
  },
  {
    headerName: "Organism",
    field: "organism",
    filter: "agSetColumnFilter"
  },
  {
    headerName: "Taxonomic distance",
    field: "taxonomic_proximity",
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

@connect(store => {
  return {
    measuredConcs: store.results.totalData
  };
}) //the names given here will be the names of props
class Metabolite extends Component {
  static propTypes = {
    measuredConcs: PropTypes.array,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      metadata: null,
      lineage: []
    };

    this.formatData = this.formatData.bind(this);
  }
  componentDidMount() {
    this.getDataFromApi();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.match.params.metabolite !==
        prevProps.match.params.metabolite ||
      this.props.match.params.organism !== prevProps.match.params.organism
    ) {
      this.setState({ metadata: null });
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const abstract = false;
    const metabolite = this.props.match.params.metabolite;
    const organism = this.props.match.params.organism;
    getDataFromApi(
      [
        "metabolites/concentration/?abstract=" +
          abstract +
          "&metabolite=" +
          metabolite +
          (organism ? "&species=" + organism : "")
      ],
      {},
      "Unable to retrieve data about metabolite '" + metabolite + "'."
    ).then(response => {
      this.formatData(response.data);
    });
    if (organism) {
      getDataFromApi(
        ["taxon", "canon_rank_distance_by_name/?name=" + organism],
        {},
        "Unable to obtain taxonomic information about '" + organism + "'."
      ).then(response => {
        this.setState({ lineage: response.data });
      });
    }
  }

  formatData(data) {
    if (data == null) {
      return;
    }

    let metadata = null;
    for (let iSource = 0; iSource < data.length - 1; iSource++) {
      for (const met of data[iSource]) {
        metadata = {};

        metadata.name = met.name;
        metadata.synonyms = met.synonyms.synonym;
        metadata.description = met.description;

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
        metadata.cellularLocations = met.cellular_locations.cellular_location;
        metadata.dbLinks = {
          biocyc: met.biocyc_id,
          cas: met.cas_registry_number,
          chebi: met.chebi_id,
          chemspider_id: met.chemspider_id,
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
    for (let iSource = 0; iSource < data.length - 1; iSource++) {
      for (const met of data[iSource]) {
        const species = "species" in met ? met.species : "Escherichia coli";
        const metConcs = met.concentrations;
        for (let iConc = 0; iConc < metConcs.concentration.length; iConc++) {
          const conc = {
            name: met.name,
            tanimoto_similarity: met.tanimoto_similarity,
            concentration: parseFloat(metConcs.concentration[iConc]),
            units: metConcs.concentration_units[iConc],
            error: metConcs.error[iConc],
            organism:
              "strain" in metConcs && metConcs.strain[iConc]
                ? species + " " + metConcs.strain[iConc]
                : species,
            taxonomic_proximity: met.taxon_distance,
            growth_phase:
              "growth_status" in metConcs
                ? metConcs.growth_status[iConc]
                : null,
            growth_media:
              "growth_media" in metConcs ? metConcs.growth_media[iConc] : null,
            growth_conditions:
              "growth_system" in metConcs
                ? metConcs.growth_system[iConc]
                : null,
            source_link:
              "m2m_id" in met
                ? { source: "ecmdb", id: met.m2m_id }
                : { source: "ymdb", id: met.ymdb_id }
          };
          if (conc.growth_phase && conc.growth_phase.indexOf(" Phase") >= 0) {
            conc.growth_phase = conc.growth_phase.split(" Phase")[0];
          }
          if (!isNaN(conc.concentration)) {
            allConcs.push(conc);
          }
        }
      }
    }

    this.props.dispatch(setTotalData(allConcs));
    this.setState({ metadata: metadata });
  }

  onFirstDataRendered(params) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds);
  }

  onRowSelected(event) {
    const selectedRows = [];
    for (const selectedNode of event.api.getSelectedNodes()) {
      selectedRows.push(selectedNode.data);
    }
    this.props.dispatch(setSelectedData(selectedRows));
  }

  onFiltered(event) {
    event.api.deselectAll();
    this.props.dispatch(setSelectedData([]));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  render() {
    if (!this.state.metadata || this.props.measuredConcs == null) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    return (
      <div className="content-container biochemical-entity-scene biochemical-entity-metabolite-scene">
        <MetadataSection
          metadata={this.state.metadata}
          metabolite={this.props.match.params.metabolite}
          organism={this.props.match.params.organism}
        />

        <div className="content-block measurements-grid ag-theme-balham">
          <h2 className="content-block-heading">Concentration</h2>
          <AgGridReact
            modules={AllModules}
            frameworkComponents={frameworkComponents}
            sideBar={sideBar}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            rowData={this.props.measuredConcs}
            rowSelection="multiple"
            groupSelectsChildren={true}
            suppressMultiSort={true}
            suppressAutoSize={true}
            suppressMovableColumns={true}
            suppressCellSelection={true}
            suppressRowClickSelection={true}
            suppressContextMenu={true}
            domLayout="autoHeight"
            onGridReady={this.onGridReady.bind(this)}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            onFilterChanged={this.onFiltered.bind(this)}
            onSelectionChanged={this.onRowSelected.bind(this)}
            lineage={this.state.lineage}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default withRouter(Metabolite);
