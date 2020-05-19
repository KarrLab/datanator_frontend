import React, { Component } from "react";
import { upperCaseFirstLetter } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import Tooltip from "@material-ui/core/Tooltip";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import {
  TAXONOMIC_PROXIMITY_TOOLTIP,
  CHEMICAL_SIMILARITY_TOOLTIP
} from "../ColumnsToolPanel/TooltipDescriptions";

class ConcentrationDataTable extends Component {
  static getUrl(query, organism) {
    return (
      "metabolites/concentrations/similar_compounds/?inchikey=" +
      query +
      (organism ? "&species=" + organism : "")
    );
  }

  static formatData(rawData, organism) {
    const formattedData = [];
    for (const metabolite of rawData){ 
      for (const metConc of metabolite["concentrations"]) {
        let uncertainty = parseFloat(metConc.error);
        if (uncertainty === 0 || isNaN(uncertainty)) {
          uncertainty = null;
        }
        const species = metConc.species_name;
        const conc = {
          name: metabolite.metabolite,
  
          //tanimotoSimilarity: met.tanimoto_similarity,
          value: parseFloat(metConc.concentration),
          uncertainty: uncertainty,
          units: metConc.concentration_units,
          organism:
            Object.prototype.hasOwnProperty.call(metConc, "strain") &&
            metConc.strain
              ? species + " " + metConc.strain
              : species,
          growthPhase: "growth_status" in metConc ? metConc.growth_status : null,
          growthMedia: "growth_media" in metConc ? metConc.growth_media : null,
          growthConditions:
            "growth_system" in metConc ? metConc.growth_system : null
          //  source:
          //    "m2m_id" in met
          //      ? { source: "ecmdb", id: met.m2m_id }
          //      : { source: "ymdb", id: met.ymdb_id }
        };
        if (organism != null) {
          conc["taxonomicProximity"] = metConc.taxon_distance;
        }
        if (conc.growthPhase && conc.growthPhase.indexOf(" phase") >= 0) {
          conc.growthPhase = conc.growthPhase.split(" phase")[0];
        }
        if (conc.growthPhase && conc.growthPhase.indexOf(" Phase") >= 0) {
          conc.growthPhase = conc.growthPhase.split(" Phase")[0];
        }
        if (!isNaN(conc.value)) {
          formattedData.push(conc);
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
          toolPanel: "columnsToolPanel"
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "filtersToolPanel"
        },
        {
          id: "stats",
          labelDefault: "Stats",
          labelKey: "chart",
          iconKey: "chart",
          toolPanel: "statsToolPanel",
          toolPanelParams: {
            col: ["value"]
          }
        }
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false
    };
  }

  static getColDefs(organism, formattedData, taxonomicRanks) {
    const colDefs = [
      {
        headerName: "Concentration (µM)",
        field: "value",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        comparator: DataTable.numericComparator
      },
      {
        headerName: "Uncertainty (µM)",
        field: "uncertainty",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        hide: true,
        filter: "numberFilter"
      },
      {
        headerName: "Metabolite",
        field: "name",
        filter: "textFilter",
        cellRenderer: "linkCellRenderer",
        cellRendererParams: {
          route: "metabolite",
          organism: organism
        }
      },
      {
        headerName: "Chemical similarity",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <Tooltip title={CHEMICAL_SIMILARITY_TOOLTIP} arrow>
              <span>Chemical similarity</span>
            </Tooltip>
          )
        },
        field: "tanimotoSimilarity",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        hide: true,
        filter: "numberFilter",
        filterParams: {
          hiBound: 1.0
        },
        valueFormatter: params => {
          return params.value.toFixed(3);
        }
      },
      {
        headerName: "Organism",
        field: "organism",
        filter: "textFilter"
      },
      {
        headerName: "Taxonomic similarity",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <Tooltip title={TAXONOMIC_PROXIMITY_TOOLTIP} arrow>
              <span>Taxonomic similarity</span>
            </Tooltip>
          )
        },
        field: "taxonomicProximity",
        hide: true,
        filter: "taxonomyFilter",
        valueFormatter: params => {
          const value = taxonomicRanks[params.value];
          return upperCaseFirstLetter(value);
        }
      },
      {
        headerName: "Growth phase",
        field: "growthPhase",
        filter: "textFilter",
        hide: true
      },
      {
        headerName: "Conditions",
        field: "growthConditions",
        filter: "textFilter",
        hide: true
      },
      {
        headerName: "Media",
        field: "growthMedia",
        filter: "textFilter",
        hide: true
      }

      /**
      {
        headerName: "Source",
        field: "source",
        cellRenderer: function(params) {
          if (params.value.source === "ecmdb") {
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
        filterValueGetter: params => {
          return params.data.source.source.toUpperCase();
        },
        filter: "textFilter"
      }
      **/
    ];

    if (!organism) {
      colDefs.splice(5, 1);
    }
    return colDefs;
  }

  static getColSortOrder() {
    return ["value"];
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
      />
    );
  }
}
export { ConcentrationDataTable };
