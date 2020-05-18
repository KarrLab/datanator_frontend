import React, { Component } from "react";
import { upperCaseFirstLetter } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import Tooltip from "@material-ui/core/Tooltip";
import { TAXONOMIC_PROXIMITY_TOOLTIP } from "../ColumnsToolPanel/TooltipDescriptions";

class RnaHalfLifeDataTable extends Component {
  static getUrl(query, organism) {
    let url =
      "rna/halflife/get_info_by_ko/" +
      "?ko_number=" +
      query +
      "&_from=0" +
      "&size=1000";

    if (organism) {
      url = url + "&taxon_distance=true&species=" + organism;
    }
    return url;
  }

  static formatData(rawData, organism, lengthOfTaxonomicRanks) {
    const formattedData = [];
    for (const rawDatum of rawData) {
      if (rawDatum.halflives) {
        const measurements = rawDatum.halflives;
        for (const measurement of measurements) {
          let formattedDatum = {
            halfLife: parseFloat(measurement.halflife),
            proteinName: rawDatum.protein_names[0],
            geneName: rawDatum.kegg_meta.gene_name[0],
            uniprotId: rawDatum.uniprot_id,
            organism: measurement.species,
            growthMedium: measurement.growth_medium,
            source: measurement.reference[0].doi
          };

          if (organism != null) {
            let distance = "";
            const keys = Object.keys(measurement.taxon_distance);
            if (keys.length === 4) {
              distance = measurement.taxon_distance[organism] - 1;
            } else {
              distance = lengthOfTaxonomicRanks;
            }
            formattedDatum["taxonomicProximity"] = distance;
          }

          formattedData.push(formattedDatum);
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
            col: ["halfLife"]
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
        headerName: "Half-life (s^{-1})",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              Half-life (s<sup>-1</sup>)
            </span>
          )
        },
        field: "halfLife",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        comparator: DataTable.numericComparator
      },
      {
        headerName: "Protein",
        field: "proteinName",
        filter: "textFilter"
      },
      {
        headerName: "UniProt id",
        field: "uniprotId",
        cellRenderer: function(params) {
          return (
            '<a href="https://www.uniprot.org/uniprot/' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            params.value +
            "</a>"
          );
        }
      },
      {
        headerName: "Gene",
        field: "geneName",
        filter: "textFilter",
        hide: true
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
        headerName: "Media",
        field: "growthMedium",
        filter: "textFilter",
        hide: false
      },
      {
        headerName: "Source",
        field: "source",
        cellRenderer: function(params) {
          return (
            '<a href="https://dx.doi.org/' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            "Journal article" +
            "</a>"
          );
        },
        filterValueGetter: () => "Journal article",
        filter: "textFilter"
      }
    ];

    if (!organism) {
      colDefs.splice(-3, 1);
    }
    return colDefs;
  }

  static getColSortOrder() {
    return ["halfLife"];
  }

  render() {
    return (
      <DataTable
        id="rna-half-life"
        title="RNA half-life"
        entity-type="ortholog group"
        data-type="RNA half-life"
        get-data-url={RnaHalfLifeDataTable.getUrl}
        format-data={RnaHalfLifeDataTable.formatData}
        get-side-bar-def={RnaHalfLifeDataTable.getSideBarDef}
        get-col-defs={RnaHalfLifeDataTable.getColDefs}
        get-col-sort-order={RnaHalfLifeDataTable.getColSortOrder}
        dom-layout="normal"
      />
    );
  }
}
export { RnaHalfLifeDataTable };
