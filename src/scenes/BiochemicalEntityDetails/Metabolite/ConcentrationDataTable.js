import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import Tooltip from "@material-ui/core/Tooltip";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import {
  TAXONOMIC_PROXIMITY_TOOLTIP,
  CHEMICAL_SIMILARITY_TOOLTIP,
} from "../ColumnsToolPanel/TooltipDescriptions";

var htmlDecode = require("js-htmlencode").htmlDecode;

class ConcentrationDataTable extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired,
  };

  getUrl(query, organism) {
    const args = ["inchikey=" + query, "threshold=0.6"];
    if (organism) {
      args.push("target_species=" + organism);
      args.push("taxon_distance=true");
    } else {
      args.push("taxon_distance=false");
    }
    return "metabolites/concentrations/similar_compounds/?" + args.join("&");
  }

  static formatData(query, organism, rawData) {
    const formattedData = [];
    for (const metabolite of rawData) {
      if ("concentrations" in metabolite) {
        for (const metConc of metabolite["concentrations"]) {
          let uncertainty = parseFloat(metConc.error);
          if (uncertainty === 0 || isNaN(uncertainty)) {
            uncertainty = null;
          }
          const species = metConc.species_name;
          const conc = {
            name: metabolite.metabolite,
            link: {
              query: metabolite.inchikey,
              label: metabolite.metabolite,
            },
            tanimotoSimilarity:
              "similarity_score" in metabolite
                ? metabolite.similarity_score
                : null,
            value: parseFloat(metConc.concentration),
            uncertainty: uncertainty,
            units:
              "unit" in metConc ? metConc.unit : metConc.concentration_units,
            organism:
              Object.prototype.hasOwnProperty.call(metConc, "strain") &&
              metConc.strain
                ? species + " " + metConc.strain
                : species,
            growthPhase:
              "growth_status" in metConc ? metConc.growth_status : null,
            growthMedia:
              "growth_media" in metConc ? metConc.growth_media : null,
            growthConditions:
              "growth_system" in metConc ? metConc.growth_system : null,
            source: null,
          };

          if (conc.units === "M") {
            conc.value *= 1e6;
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "dM") {
            conc.value *= 1e5;
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "cM") {
            conc.value *= 1e4;
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "mM") {
            conc.value *= 1e3;
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "uM") {
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "nM") {
            conc.value *= 1e-3;
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "pM") {
            conc.value *= 1e-6;
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "fM") {
            conc.value *= 1e-9;
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "aM") {
            conc.value *= 1e-12;
            conc.units = htmlDecode("&#181;M");
          } else if (conc.units === "umol/g DW") {
            conc.units = htmlDecode("&#181;mol * gCDW-1");
          } else if (conc.units === "umol/L") {
            conc.units = htmlDecode("&#181;mol * L-1");
          } else if (conc.units != null && conc.units !== undefined) {
            conc.units = htmlDecode(conc.units);
          }

          if (organism != null) {
            conc["taxonomicProximity"] = DataTable.calcTaxonomicDistance(
              metConc.taxon_distance,
              organism,
              metConc.species_name
            );
          }
          if (conc.growthPhase && conc.growthPhase.indexOf(" phase") >= 0) {
            conc.growthPhase = conc.growthPhase.split(" phase")[0];
          }
          if (conc.growthPhase && conc.growthPhase.indexOf(" Phase") >= 0) {
            conc.growthPhase = conc.growthPhase.split(" Phase")[0];
          }
          if (metConc.reference) {
            if (metConc.reference.namespace === "doi") {
              conc.source = {
                id: "DOI: " + metConc.reference.id,
                url: "https://dx.doi.org/" + metConc.reference.id,
              };
            } else if (metConc.reference.namespace === "ecmdb") {
              conc.source = {
                id: "ECMDB: " + metConc.reference.id,
                url: "http://ecmdb.ca/compounds/" + metConc.reference.id,
              };
            } else if (metConc.reference.namespace === "ymdb") {
              conc.source = {
                id: "YMDB: " + metConc.reference.id,
                url: "http://www.ymdb.ca/compounds/" + metConc.reference.id,
              };
            } else if (
              metConc.reference.namespace === "pubmed" &&
              metConc.reference.id
            ) {
              conc.source = {
                id: "PubMed: " + metConc.reference.id,
                url:
                  "https://www.ncbi.nlm.nih.gov/pubmed/" + metConc.reference.id,
              };
            } else if (metConc.reference.text) {
              conc.source = {
                id: metConc.reference.text,
                url: null,
              };
            }
          }
          if (!isNaN(conc.value)) {
            formattedData.push(conc);
          }
        }
      }
    }
    return formattedData;
  }

  static getSideBarDef() {
    return {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "columnsToolPanel",
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "filtersToolPanel",
        },
        {
          id: "stats",
          labelDefault: "Stats",
          labelKey: "chart",
          iconKey: "chart",
          toolPanel: "statsToolPanel",
          toolPanelParams: {
            col: ["value"],
          },
        },
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false,
    };
  }

  static getColDefs(query, organism, formattedData, taxonomicRanks) {
    const colDefs = [
      {
        headerName: "Concentration",
        field: "value",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        comparator: DataTable.numericComparator,
      },
      {
        headerName: "Uncertainty",
        field: "uncertainty",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        hide: true,
        filter: "numberFilter",
      },
      {
        headerName: "Units",
        field: "units",
      },
      {
        headerName: "Metabolite",
        field: "link",
        filter: "textFilter",
        cellRenderer: "linkCellRenderer",
        cellRendererParams: {
          route: "metabolite",
          organism: organism,
        },
        filterValueGetter: (params) => {
          return params.data.name;
        },
        processCellCallback: (value) => {
          return value.label;
        },
      },
      {
        headerName: "Chemical similarity",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <Tooltip title={CHEMICAL_SIMILARITY_TOOLTIP} arrow>
              <span>Chemical similarity</span>
            </Tooltip>
          ),
        },
        field: "tanimotoSimilarity",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        hide: false,
        filter: "numberFilter",
        filterParams: {
          hiBound: 1.0,
        },
      },
      {
        headerName: "Organism",
        field: "organism",
        filter: "textFilter",
        cellRenderer: function (params) {
          const organism = params.value;
          if (organism) {
            return (
              '<a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=' +
              organism +
              '" target="_blank" rel="noopener noreferrer">' +
              organism +
              "</a>"
            );
          } else {
            return null;
          }
        },
      },
      {
        headerName: "Taxonomic similarity",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <Tooltip title={TAXONOMIC_PROXIMITY_TOOLTIP} arrow>
              <span>Taxonomic similarity</span>
            </Tooltip>
          ),
        },
        field: "taxonomicProximity",
        hide: true,
        filter: "taxonomyFilter",
        valueFormatter: (params) => {
          if (params.value != null) {
            const value = taxonomicRanks[params.value];
            return upperCaseFirstLetter(value);
          } else {
            return null;
          }
        },
        comparator: DataTable.numericComparator,
        processCellCallback: (value) => {
          if (value != null) {
            return taxonomicRanks[value];
          } else {
            return null;
          }
        },
      },
      {
        headerName: "Growth phase",
        field: "growthPhase",
        filter: "textFilter",
        hide: true,
      },
      {
        headerName: "Conditions",
        field: "growthConditions",
        filter: "textFilter",
        hide: true,
      },
      {
        headerName: "Media",
        field: "growthMedia",
        filter: "textFilter",
        hide: true,
      },
      {
        headerName: "Source",
        field: "source",
        cellRenderer: function (params) {
          const source = params.value;
          if (source) {
            if (source.url) {
              return (
                '<a href="' +
                source.url +
                '" target="_blank" rel="noopener noreferrer">' +
                source.id +
                "</a>"
              );
            } else {
              return source.id;
            }
          } else {
            return null;
          }
        },
        filterValueGetter: (params) => {
          const source = params.data.source;
          if (source) {
            return source.id;
          } else {
            return null;
          }
        },
        filter: "textFilter",
        processCellCallback: (value) => {
          if (value) {
            return value.id;
          } else {
            return null;
          }
        },
      },
    ];

    if (!organism) {
      colDefs.splice(6, 1);
    }
    return colDefs;
  }

  static getColSortOrder(query, organism) {
    if (organism) {
      return [
        { colId: "tanimotoSimilarity", sort: "desc" },
        { colId: "taxonomicProximity", sort: "asc" },
        { colId: "organism", sort: "asc" },
        { colId: "value", sort: "asc" },
      ];
    } else {
      return [
        { colId: "tanimotoSimilarity", sort: "desc" },
        { colId: "value", sort: "asc" },
      ];
    }
  }

  render() {
    return (
      <DataTable
        id="concentration"
        title="Concentration"
        entity-type="metabolite"
        data-type="concentration"
        get-data-url={ConcentrationDataTable.getUrl}
        format-data={ConcentrationDataTable.formatData}
        get-side-bar-def={ConcentrationDataTable.getSideBarDef}
        get-col-defs={ConcentrationDataTable.getColDefs}
        get-col-sort-order={ConcentrationDataTable.getColSortOrder}
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { ConcentrationDataTable };
