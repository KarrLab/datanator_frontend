import React, { Component } from "react";
import PropTypes from "prop-types";
import { getNumProperties, upperCaseFirstLetter } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import Tooltip from "@material-ui/core/Tooltip";
import { TAXONOMIC_PROXIMITY_TOOLTIP } from "../ColumnsToolPanel/TooltipDescriptions";
import { isOrthoDbId } from "~/utils/utils";

class ProteinAbundanceDataTable extends Component {
  static propTypes = {
    "uniprot-id-to-taxon-dist": PropTypes.object,
    "set-scene-metadata": PropTypes.func.isRequired,
  };

  static defaultProps = {
    "uniprot-id-to-taxon-dist": null,
  };

  getUrl(query, organism) {
    if (isOrthoDbId(query)) {
      const args = ["kegg_id=" + query, "distance=40"];
      if (organism) {
        args.push("anchor=" + organism);
      }
      return (
        "proteins/proximity_abundance/proximity_abundance_kegg/?" +
        args.join("&")
      );
    } else {
      const args = ["uniprot_id=" + query];
      if (organism) {
        args.push("taxon_distance=true");
        args.push("target_species=" + organism);
      }
      return "proteins/precise_abundance/?" + args.join("&");
    }
  }

  formatData(query, organism, rawData) {
    if (isOrthoDbId(query)) {
      return this.formatOrthologGroupData(query, organism, rawData);
    } else {
      return this.formatProteinData(query, organism, rawData);
    }
  }

  formatOrthologGroupData(query, organism, rawData) {
    let start = 0;
    if (getNumProperties(rawData[0]) === 1) {
      start = 1;
    }

    const formattedData = [];
    for (let i = 0; i < rawData.slice(start).length; i++) {
      const docs = rawData.slice(start)[i];
      this.formatDocuments(
        null,
        organism,
        docs.distance,
        docs.documents,
        formattedData
      );
    }
    return formattedData;
  }

  formatProteinData(query, organism, rawData) {
    if (!Array.isArray(rawData)) {
      return [];
    }

    const formattedData = [];
    this.formatDocuments(query, organism, null, rawData, formattedData);
    return formattedData;
  }

  formatDocuments(uniprotId, organism, taxonDistance, rawData, formattedData) {
    for (const rawDatum of rawData) {
      if ("abundances" in rawDatum && rawDatum.abundances) {
        for (const measurement of rawDatum.abundances) {
          let proteinName = rawDatum.protein_name;
          if (proteinName.includes("(")) {
            proteinName = proteinName.substring(0, proteinName.indexOf("("));
          }

          const formattedDatum = {
            abundance: parseFloat(measurement.abundance),
            units: "ppm",
            proteinName: proteinName,
            uniprotId:
              "uniprot_id" in rawDatum ? rawDatum.uniprot_id : uniprotId,
            geneSymbol: rawDatum.gene_name,
            organism: rawDatum.species_name,
            organ: measurement.organ.replace("_", " ").toLowerCase(),
          };

          if (organism != null) {
            if ("taxon_distance" in rawDatum) {
              formattedDatum[
                "taxonomicProximity"
              ] = DataTable.calcTaxonomicDistance(
                rawDatum.taxon_distance,
                organism,
                rawDatum.species_name
              );
            } else {
              if (
                organism.toLowerCase() ===
                  rawDatum.species_name.toLowerCase() ||
                rawDatum.canon_ancestors
                  .map((el) => el.toLowerCase())
                  .includes(organism.toLowerCase())
              ) {
                formattedDatum["taxonomicProximity"] = 0;
              } else {
                formattedDatum["taxonomicProximity"] = taxonDistance;
              }
            }
          }

          formattedData.push(formattedDatum);
        }
      }
    }
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
            col: ["abundance"],
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
        headerName: "Abundance",
        field: "abundance",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        comparator: DataTable.numericComparator,
        minWidth: 140,
      },
      {
        headerName: "Units",
        field: "units",
        filter: "textFilter",
        minWidth: 60,
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
        field: "geneSymbol",
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
        headerName: "Organ",
        field: "organ",
        filter: "textFilter",
        hide: false,
      },
      {
        headerName: "Source",
        field: "uniprotId",
        cellRenderer: function (params) {
          return (
            '<a href="https://pax-db.org/search?q=' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            "PAXdb" +
            "</a>"
          );
        },
        filterValueGetter: () => "PAXdb",
        filter: "textFilter",
      },
    ];

    if (!organism) {
      colDefs.splice(-3, 1);
    }

    return colDefs;
  }

  static getColSortOrder() {
    return [
      { colId: "taxonomicProximity", sort: "asc" },
      { colId: "organism", sort: "asc" },
      // { colId: "organ", sort: "asc" },
      { colId: "abundance", sort: "asc" },
    ];
  }

  render() {
    return (
      <DataTable
        id="protein-abundance"
        title="Protein abundance"
        entity-type="ortholog group"
        data-type="protein abundance"
        get-data-url={this.getUrl.bind(this)}
        format-data={this.formatData.bind(this)}
        get-side-bar-def={ProteinAbundanceDataTable.getSideBarDef}
        get-col-defs={ProteinAbundanceDataTable.getColDefs}
        get-col-sort-order={ProteinAbundanceDataTable.getColSortOrder}
        dom-layout="normal"
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { ProteinAbundanceDataTable };
