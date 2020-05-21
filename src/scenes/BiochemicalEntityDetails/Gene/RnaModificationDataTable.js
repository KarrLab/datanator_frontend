import React, { Component } from "react";
import PropTypes from "prop-types";
import { getNumProperties, upperCaseFirstLetter } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import Tooltip from "@material-ui/core/Tooltip";
import { TAXONOMIC_PROXIMITY_TOOLTIP } from "../ColumnsToolPanel/TooltipDescriptions";

class RnaModificationDataTable extends Component {
  static propTypes = {
    "uniprot-id-to-taxon-dist": PropTypes.object,
    "set-scene-metadata": PropTypes.func.isRequired
  };

  static defaultProps = {
    "uniprot-id-to-taxon-dist": null
  };

  getUrl(query, organism) {
    return (
      "rna_modification/proximity_abundance/proximity_abundance_kegg/?kegg_id=" +
      query +
      "&distance=40" +
      (organism ? "&anchor=" + organism : "")
    );
  }

  formatData(rawData, organism) {
    let start = 0;
    if (getNumProperties(rawData[0]) === 1) {
      start = 1;
    }

    const formattedData = [];
    for (let i = 0; i < rawData.slice(start).length; i++) {
      const docs = rawData.slice(start)[i];
      for (const rawDatum of docs.documents) {
        if ("modifications" in rawDatum) {
          for (const measurement of rawDatum.modifications) {
            if (
              measurement.concrete !== true ||
              measurement.pro_issues != null ||
              measurement.monomeric_form_issues != null
            ) {
              continue;
            }

            let proteinName = rawDatum.protein_name;
            if (proteinName.includes("(")) {
              proteinName = proteinName.substring(0, proteinName.indexOf("("));
            }

            const row = {
              processing: measurement.processing,
              modifications: measurement.modifications,
              crosslinks: measurement.crosslinks,
              deletions: measurement.deletions,
              mature_sequence:
                measurement.modified_sequence_abbreviated_bpforms,
              proteinName: proteinName,
              uniprotId: rawDatum.uniprot_id,
              geneSymbol: rawDatum.gene_name,
              organism: rawDatum.species_name,
              source: measurement.pro_id
            };
            if (organism != null) {
              row["taxonomicProximity"] = docs.distance;
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
        headerName: "Processing",
        field: "processing",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        headerName: "Modifications",
        field: "modifications"
      },
      {
        headerName: "Crosslinks",
        field: "crosslinks"
      },
      {
        headerName: "Deletions",
        field: "deletions"
      },
      {
        headerName: "Mature sequence (BpForms)",
        field: "mature_sequence",
        hide: true
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
        },
        hide: true
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
          const value = taxonomicRanks[params.value];
          return upperCaseFirstLetter(value);
        }
      },
      {
        headerName: "Source",
        field: "source",
        cellRenderer: function(params) {
          return (
            '<a href="https://proconsortium.org/app/entry/' +
            params.value +
            '/" target="_blank" rel="noopener noreferrer">' +
            params.value +
            "</a>"
          );
        },
        filterValueGetter: params => {
          return params.data.source;
        },
        filter: "textFilter"
      }
    ];

    if (!organism) {
      colDefs.splice(-2, 1);
    }

    return colDefs;
  }

  static getColSortOrder() {
    return ["abundance"];
  }

  render() {
    return (
      <DataTable
        id="rna-modifications"
        title="RNA modifications"
        entity-type="ortholog group"
        data-type="RNA modifications"
        get-data-url={this.getUrl.bind(this)}
        format-data={this.formatData.bind(this)}
        get-side-bar-def={RnaModificationDataTable.getSideBarDef}
        get-col-defs={RnaModificationDataTable.getColDefs}
        get-col-sort-order={RnaModificationDataTable.getColSortOrder}
        dom-layout="normal"
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { RnaModificationDataTable };
