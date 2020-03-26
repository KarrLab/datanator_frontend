import React, { Component } from "react";
import PropTypes from "prop-types";
import { getNumProperties, upperCaseFirstLetter } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import Tooltip from "@material-ui/core/Tooltip";
import { TAXONOMIC_PROXIMITY_TOOLTIP } from "../ColumnsToolPanel/TooltipDescriptions";

class AbundanceDataTable extends Component {
  static propTypes = {
    "uniprot-id-to-taxon-dist": PropTypes.object
  };

  static defaultProps = {
    "uniprot-id-to-taxon-dist": null
  };

  getUrl(query, organism) {
    return (
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=" +
      query +
      "&distance=40" +
      (organism ? "&anchor=" + organism : "")
    );
  }

  formatData(rawData, rankings) {
    let start = 0;
    if (getNumProperties(rawData[0]) === 1) {
      start = 1;
    }

    const formattedData = [];
    for (let i = 0; i < rawData.slice(start).length; i++) {
      const docs = rawData.slice(start)[i];
      for (const rawDatum of docs.documents) {
        if (rawDatum.abundances !== undefined) {
          for (const measurement of rawDatum.abundances) {
            let proteinName = rawDatum.protein_name;
            if (proteinName.includes("(")) {
              proteinName = proteinName.substring(0, proteinName.indexOf("("));
            }

            const row = {
              abundance: parseFloat(measurement.abundance),
              proteinName: proteinName,
              uniprotId: rawDatum.uniprot_id,
              geneSymbol: rawDatum.gene_name,
              organism: rawDatum.species_name,
              organ: measurement.organ.replace("_", " ").toLowerCase()
            };
            if (rankings !== null) {
              row["taxonomicProximity"] = i;
            }
            formattedData.push(row);
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

  static getColDefs(organism, formattedData, rankings) {
    //rankings.push("cellular life");
    const colDefs = [
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
          const value = rankings[params.value];
          return upperCaseFirstLetter(value);
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

    if (!organism) {
      colDefs.splice(-3, 1);
    }

    return colDefs;
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
        get-side-bar-def={AbundanceDataTable.getSideBarDef}
        get-col-defs={AbundanceDataTable.getColDefs}
      />
    );
  }
}
export { AbundanceDataTable };
