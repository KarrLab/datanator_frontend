import React, { Component } from "react";
import PropTypes from "prop-types";
import { getNumProperties } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";

class AbundanceDataTable extends Component {
  static propTypes = {
    uniprotIdToTaxonDist: PropTypes.object.isRequired
  };

  getUrl() {
    const queryArgs = Object.keys(this.props.uniprotIdToTaxonDist)
      .map(el => "uniprot_id=" + el)
      .join("&");
    return "proteins/meta/meta_combo/?" + queryArgs;
  }

  formatData(rawData) {
    if (rawData != null && typeof rawData != "string") {
      if (!(rawData[0].uniprot_id === "Please try another input combination")) {
        let start = 0;
        if (getNumProperties(rawData[0]) === 1) {
          start = 1;
        }

        const formattedData = [];
        for (const rawDatum of rawData.slice(start)) {
          if (rawDatum.abundances !== undefined) {
            for (const measurement of rawDatum.abundances) {
              let proteinName = rawDatum.protein_name;
              if (proteinName.includes("(")) {
                proteinName = proteinName.substring(
                  0,
                  proteinName.indexOf("(")
                );
              }

              formattedData.push({
                abundance: parseFloat(measurement.abundance),
                proteinName: proteinName,
                uniprotId: rawDatum.uniprot_id,
                geneSymbol: rawDatum.gene_name,
                organism: rawDatum.species_name,
                taxonomicProximity: this.props.uniprotIdToTaxonDist[
                  rawDatum.uniprot_id
                ],
                organ: measurement.organ
              });
            }
          }
        }
        return formattedData;
      }
    }
  }

  getSideBarDef() {
    return {
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
            col: ["abundance"]
          }
        }
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false
    };
  }

  getColDefs() {
    return [
      {
        headerName: "Abundance",
        field: "abundance",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "agNumberColumnFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        headerName: "Protein",
        field: "proteinName",
        filter: "agSetColumnFilter"
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
        field: "geneSymbol",
        filter: "agSetColumnFilter",
        hide: true
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
        filter: "taxonomyFilter"
      },
      {
        headerName: "Organ",
        field: "organ",
        filter: "agSetColumnFilter",
        hide: false
      },
      {
        headerName: "Source",
        field: "uniprotId",
        cellRenderer: function(params) {
          return (
            '<a href="https://pax-db.org/search?q=' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            "PAXdb" +
            "</a>"
          );
        },
        filterValueGetter: () => "PAXdb",
        filter: "agSetColumnFilter"
      }
    ];
  }

  render() {
    return (
      <DataTable
        id="abundance"
        title="Abundance"
        entity-type="ortholog group"
        data-type="abundance"
        get-data-url={this.getUrl.bind(this)}
        format-data={this.formatData.bind(this)}
        get-side-bar-def={this.getSideBarDef}
        get-col-defs={this.getColDefs}
      />
    );
  }
}
export { AbundanceDataTable };
