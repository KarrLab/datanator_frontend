import React, { Component } from "react";
import PropTypes from "prop-types";
import { getNumProperties } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";

class AbundanceDataTable extends Component {
  static propTypes = {
    "uniprot-id-to-taxon-dist": PropTypes.object
  };

  static defaultProps = {
    "uniprot-id-to-taxon-dist": null
  };

  getUrl() {
    const queryArgs = Object.keys(this.props["uniprot-id-to-taxon-dist"])
      .map(el => "uniprot_id=" + el)
      .join("&");
    return "proteins/meta/meta_combo/?" + queryArgs;
  }

  formatData(rawData) {
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
            proteinName = proteinName.substring(0, proteinName.indexOf("("));
          }

          formattedData.push({
            abundance: parseFloat(measurement.abundance),
            proteinName: proteinName,
            uniprotId: rawDatum.uniprot_id,
            geneSymbol: rawDatum.gene_name,
            organism: rawDatum.species_name,
            taxonomicProximity: this.props["uniprot-id-to-taxon-dist"][
              rawDatum.uniprot_id
            ],
            organ: measurement.organ.replace("_", " ").toLowerCase()
          });
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
            col: ["abundance"]
          }
        }
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false
    };
  }

  static getColDefs() {
    return [
      {
        headerName: "Abundance",
        field: "abundance",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
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
        field: "geneSymbol",
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
        field: "taxonomicProximity",
        hide: true,
        filter: "taxonomyFilter",
        valueFormatter: params => {
          const value = params.value;
          return value;
        }
      },
      {
        headerName: "Organ",
        field: "organ",
        filter: "textFilter",
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
        filter: "textFilter"
      }
    ];
  }

  render() {
    if (this.props["uniprot-id-to-taxon-dist"] == null) {
      return <div></div>;
    } else {
      return (
        <DataTable
          id="abundance"
          title="Abundance"
          entity-type="ortholog group"
          data-type="abundance"
          get-data-url={this.getUrl.bind(this)}
          format-data={this.formatData.bind(this)}
          get-side-bar-def={AbundanceDataTable.getSideBarDef}
          get-col-defs={AbundanceDataTable.getColDefs}
        />
      );
    }
  }
}
export { AbundanceDataTable };
