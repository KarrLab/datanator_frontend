import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter, isKeggOrthologyId } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import Tooltip from "@material-ui/core/Tooltip";
import { TAXONOMIC_PROXIMITY_TOOLTIP } from "../ColumnsToolPanel/TooltipDescriptions";

class RnaHalfLifeDataTable extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired,
  };

  static getUrl(query, organism) {
    let endpoint;
    const args = [];

    if (isKeggOrthologyId(query)) {
      endpoint = "rna/halflife/get_info_by_ko/";
      args.push("ko_number=" + query);
    } else {
      endpoint = "rna/halflife/get_info_by_uniprot/";
      args.push("uniprot_id=" + query);
    }

    args.push("_from=0");
    args.push("size=1000");

    if (organism) {
      args.push("taxon_distance=true");
      args.push("species=" + organism);
    }

    return endpoint + "?" + args.join("&");
  }

  static formatData(query, organism, rawData) {
    const formattedData = [];
    for (const rawDatum of rawData) {
      if (rawDatum.halflives) {
        const measurements = rawDatum.halflives;
        for (const measurement of measurements) {
          if ("halflife" in measurement) {
            let formattedDatum = {
              halfLife: parseFloat(measurement.halflife),
              units: measurement.unit,
              proteinName:
                "protein_names" in rawDatum && rawDatum.protein_names
                  ? rawDatum.protein_names[0]
                  : null,
              geneName:
                "kegg_meta" in rawDatum &&
                rawDatum.kegg_meta &&
                "gene_name" in rawDatum.kegg_meta &&
                rawDatum.kegg_meta.gene_name
                  ? rawDatum.kegg_meta.gene_name[0]
                  : null,
              uniprotId: "uniprot_id" in rawDatum ? rawDatum.uniprot_id : null,
              organism: measurement.species,
              cellLine: null,
              growthMedium:
                "growth_medium" in measurement
                  ? measurement.growth_medium
                  : null,
              source: {
                id: "DOI: " + measurement.reference[0].doi,
                url: "https://dx.doi.org/" + measurement.reference[0].doi,
              },
            };

            if (organism != null) {
              formattedDatum[
                "taxonomicProximity"
              ] = DataTable.calcTaxonomicDistance(
                measurement.taxon_distance,
                organism,
                measurement.species
              );
            }

            formattedData.push(formattedDatum);
          } else if ("values" in measurement) {
            const cellLineValues = {};

            for (const value of measurement.values) {
              let cellLine;
              for (const key in value) {
                if (
                  key !== "biological_replicates" &&
                  key !== "technical_replicates" &&
                  key !== "note" &&
                  key !== "unit"
                ) {
                  cellLine = key;
                }
              }

              let units = value.unit;
              let halfLife = value[cellLine];
              if (halfLife == null) {
                continue;
              }

              if (units === "hr") {
                units = "s";
                halfLife *= 60;
              }

              if ("biological_replicates" in value) {
                if (cellLine in cellLineValues) {
                  if ("values" in cellLineValues[cellLine]) {
                    cellLineValues[cellLine].values.push(halfLife);
                  }
                } else {
                  cellLineValues[cellLine] = {
                    values: [halfLife],
                    units: units,
                  };
                }
              } else {
                cellLineValues[cellLine] = { value: halfLife, units: units };
              }
            }

            for (const cellLine in cellLineValues) {
              const cellLineValue = cellLineValues[cellLine];

              let formattedDatum = {
                units: cellLineValue.units,
                proteinName:
                  "protein_names" in rawDatum && rawDatum.protein_names
                    ? rawDatum.protein_names[0]
                    : null,
                geneName:
                  "kegg_meta" in rawDatum &&
                  rawDatum.kegg_meta &&
                  "gene_name" in rawDatum.kegg_meta &&
                  rawDatum.kegg_meta.gene_name
                    ? rawDatum.kegg_meta.gene_name[0]
                    : null,
                uniprotId:
                  "uniprot_id" in rawDatum ? rawDatum.uniprot_id : null,
                organism: measurement.species,
                cellLine: cellLine.toUpperCase(),
                growthMedium:
                  "growth_medium" in measurement
                    ? measurement.growth_medium
                    : null,
                source: {
                  id: "DOI: " + measurement.reference[0].doi,
                  url: "https://dx.doi.org/" + measurement.reference[0].doi,
                },
              };

              if ("value" in cellLineValue) {
                formattedDatum.halfLife = cellLineValue.value;
              } else {
                formattedDatum.halfLife =
                  cellLineValue.values.reduce((a, b) => a + b, 0) /
                  cellLineValue.values.length;
              }

              if (organism != null) {
                formattedDatum[
                  "taxonomicProximity"
                ] = DataTable.calcTaxonomicDistance(
                  measurement.taxon_distance,
                  organism,
                  measurement.species
                );
              }

              formattedData.push(formattedDatum);
            }
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
            col: ["halfLife"],
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
        headerName: "Half-life",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: <span>Half-life</span>,
        },
        field: "halfLife",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        comparator: DataTable.numericComparator,
      },
      {
        headerName: "Units",
        field: "units",
        filter: "textFilter",
      },
      {
        headerName: "Protein",
        field: "proteinName",
        filter: "textFilter",
      },
      {
        headerName: "UniProt id",
        field: "uniprotId",
        cellRenderer: function (params) {
          return (
            '<a href="https://www.uniprot.org/uniprot/' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            params.value +
            "</a>"
          );
        },
      },
      {
        headerName: "Gene",
        field: "geneName",
        filter: "textFilter",
        hide: true,
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
          if (value) {
            return taxonomicRanks[value];
          } else {
            return null;
          }
        },
      },
      {
        headerName: "Cell line",
        field: "cellLine",
        filter: "textFilter",
        cellRenderer: function (params) {
          const cellLine = params.value;
          if (cellLine) {
            return (
              '<a href="https://www.coriell.org/0/Sections/Search/Sample_Detail.aspx?Ref=' +
              cellLine +
              '" target="_blank" rel="noopener noreferrer">' +
              cellLine +
              "</a>"
            );
          } else {
            return null;
          }
        },
      },
      {
        headerName: "Media",
        field: "growthMedium",
        filter: "textFilter",
        hide: false,
      },
      {
        headerName: "Source",
        field: "source",
        cellRenderer: function (params) {
          const source = params.value;
          return (
            '<a href="' +
            source.url +
            '" target="_blank" rel="noopener noreferrer">' +
            source.id +
            "</a>"
          );
        },
        filterValueGetter: (params) => {
          const source = params.data.source;
          return source.id;
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
      colDefs.splice(-4, 1);
    }
    return colDefs;
  }

  static getColSortOrder() {
    return [
      { colId: "taxonomicProximity", sort: "asc" },
      { colId: "organism", sort: "asc" },
      // { colId: "cellLine", sort: "asc" },
      // { colId: "geneName", sort: "asc" },
      { colId: "halfLife", sort: "asc" },
    ];
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
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { RnaHalfLifeDataTable };
