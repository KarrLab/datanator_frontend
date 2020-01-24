import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/RestApi";
import { abstractMolecule } from "~/data/actions/pageAction";
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
    moleculeAbstract: store.page.moleculeAbstract,
    measuredConcs: store.results.totalData
  };
}) //the names given here will be the names of props
class Metabolite extends Component {
  static propTypes = {
    moleculeAbstract: PropTypes.bool.isRequired,
    measuredConcs: PropTypes.array,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      metadata: [],
      lineage: [],
      tanimoto: false
    };

    this.formatData = this.formatData.bind(this);
  }
  componentDidMount() {
    this.getDataFromApi();
  }

  componentDidUpdate(prevProps) {
    if (this.props.moleculeAbstract === true) {
      this.props.dispatch(abstractMolecule(false));
    }

    if (
      this.props.match.params.metabolite !==
        prevProps.match.params.metabolite ||
      this.props.match.params.organism !== prevProps.match.params.organism
    ) {
      this.setState({ metadata: [] });
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const abs_default = false;
    const metabolite = this.props.match.params.metabolite;
    const organism = this.props.match.params.organism;
    getDataFromApi(
      [
        "metabolites/concentration/?abstract=" +
          abs_default +
          "&metabolite=" +
          metabolite +
          (organism ? "&species=" + organism : "")
      ],
      {},
      "Unable to retrieve data about metabolite '" + metabolite + "'."
    )
      .then(response => {
        this.formatData(response.data);
      })
      .catch(() => {
        //alert('Nothing Found');
        this.setState({ orig_json: null });
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
    if (data != null) {
      const f_concentrations = [];

      const newMetaboliteMetadataDict = {};

      let tani = false;
      for (let n = data[0].length; n > 0; n--) {
        const datum = data[0][n - 1];

        if (datum.tanimoto_similarity < 1) {
          this.setState({ tanimoto: true });
          tani = true;
        } else {
          this.setState({ tanimoto: false });
          //this.props.dispatch(abstractMolecule(false))
        }

        const concs = datum.concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (const key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (Object.prototype.hasOwnProperty.call(concs, key)) {
                concs[key] = [concs[key]];
              }
            }
          }

          let new_dict = newMetaboliteMetadataDict[datum.inchikey];
          if (!new_dict) {
            new_dict = {};
          }
          new_dict = {
            name: datum.name,
            synonyms: datum.synonyms.synonym,
            description: datum.description,
            pathways: datum.pathways.pathway,
            cellularLocations: datum.cellular_locations.cellular_location,
            inchi: datum.inchi,
            inchiKey: datum.inchikey,
            smiles: datum.smiles,
            formula: formatChemicalFormula(datum.chemical_formula),
            molWt: datum.average_molecular_weight,
            charge: datum.property.find(el => el["kind"] === "formal_charge")
              .value,
            physiologicalCharge: datum.property.find(
              el => el["kind"] === "physiological_charge"
            ).value,
            dbLinks: {
              biocyc: datum.biocyc_id,
              cas: datum.cas_registry_number,
              chebi: datum.chebi_id,
              chemspider_id: datum.chemspider_id,
              ecmdb: datum.ecmdb_id,
              foodb: datum.foodb_id,
              hmdb: datum.hmdb_id,
              kegg: datum.kegg_id,
              pubchem: datum.pubchem_compound_id,
              ymdb: datum.ymdb_id
            }
          };

          newMetaboliteMetadataDict[datum.inchikey] = new_dict;

          for (let i = concs.concentration.length - 1; i >= 0; i--) {
            let growth_phase = "";
            let organism = "Escherichia coli";

            if (concs.growth_status[i] != null) {
              if (
                concs.growth_status[i].toLowerCase().indexOf("stationary") >= 0
              ) {
                growth_phase = "Stationary Phase";
              } else if (
                concs.growth_status[i].toLowerCase().indexOf("log") >= 0
              ) {
                growth_phase = "Log Phase";
              }
            }
            if ("strain" in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + " " + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: datum.name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_conditions: concs.growth_system[i],
              growth_media: concs.growth_media[i],
              taxonomic_proximity: datum.taxon_distance,
              tanimoto_similarity: datum.tanimoto_similarity,
              source_link: { source: "ecmdb", id: datum.m2m_id }
            });
          }
        }
      }

      for (let n = data[1].length; n > 0; n--) {
        const datum = data[1][n - 1];

        if (datum.tanimoto_similarity < 1) {
          this.setState({ tanimoto: true });
          tani = true;
        }

        const concs = datum.concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (const key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (Object.prototype.hasOwnProperty.call(concs, key)) {
                concs[key] = [concs[key]];
              }
            }
          }

          let new_dict = newMetaboliteMetadataDict[datum.inchikey];
          if (!new_dict) {
            new_dict = {};
          }

          const chargeEl = datum.property.find(
            el => el["kind"] === "formal_charge"
          );
          const physiologicalChargeEl = datum.property.find(
            el => el["kind"] === "physiological_charge"
          );

          new_dict = {
            name: datum.name,
            synonyms: datum.synonyms.synonym,
            description: datum.description,
            pathways: datum.pathways.pathway,
            cellularLocations: datum.cellular_locations.cellular_location,
            inchi: datum.inchi,
            inchiKey: datum.inchikey,
            smiles: datum.smiles,
            formula: formatChemicalFormula(datum.chemical_formula),
            molWt: datum.average_molecular_weight,
            charge: chargeEl !== undefined ? chargeEl.value : null,
            physiologicalCharge:
              physiologicalChargeEl !== undefined
                ? physiologicalChargeEl.value
                : null,
            dbLinks: {
              biocyc: datum.biocyc_id,
              cas: datum.cas_registry_number,
              chebi: datum.chebi_id,
              chemspider_id: datum.chemspider_id,
              ecmdb: datum.ecmdb_id,
              foodb: datum.foodb_id,
              hmdb: datum.hmdb_id,
              kegg: datum.kegg_id,
              pubchem: datum.pubchem_compound_id,
              ymdb: datum.ymdb_id
            }
          };

          newMetaboliteMetadataDict[datum.inchikey] = new_dict;

          for (let i = concs.concentration.length - 1; i >= 0; i--) {
            let growth_phase = "";
            let organism = datum.species;
            if ("strain" in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + " " + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: datum.name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_media: concs.growth_media[i],
              taxonomic_proximity: datum.taxon_distance,
              tanimoto_similarity: datum.tanimoto_similarity,
              source_link: { source: "ymdb", id: datum.ymdb_id }
            });
          }
        }
      }

      if (tani) {
        //this.props.dispatch(abstractMolecule(true))
        this.setState({ tanimoto: true });
      } else {
        //this.props.dispatch(abstractMolecule(false))
        this.setState({ tanimoto: false });
      }

      const metadata = Object.values(newMetaboliteMetadataDict);

      this.props.dispatch(setTotalData(f_concentrations));
      this.setState({
        metadata: metadata
        //displayed_data: f_concentrations
      });
    } else {
      //alert('Nothing Found');
    }
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
    for (let i = event.api.getSelectedNodes().length - 1; i >= 0; i--) {
      selectedRows.push(event.api.getSelectedNodes()[i].data);
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
    if (this.state.metadata.length === 0 || this.props.measuredConcs == null) {
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
          abstract={this.state.tanimoto}
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
