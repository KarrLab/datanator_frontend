import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  getNumProperties,
  upperCaseFirstLetter,
  isKeggOrthologyId
} from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import Tooltip from "@material-ui/core/Tooltip";
import { TAXONOMIC_PROXIMITY_TOOLTIP } from "../ColumnsToolPanel/TooltipDescriptions";

class ProteinModificationDataTable extends Component {
  static propTypes = {
    "uniprot-id-to-taxon-dist": PropTypes.object,
    "set-scene-metadata": PropTypes.func.isRequired
  };

  static defaultProps = {
    "uniprot-id-to-taxon-dist": null
  };

  getUrl(query, organism) {
    if (isKeggOrthologyId(query)) {
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
        args.push("taget_species=" + organism);
      }
      return "proteins/precise_abundance/?" + args.join("&");
    }
  }

  formatData(query, organism, rawData) {
    if (isKeggOrthologyId(query)) {
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
              processedSequence: measurement.processsed_sequence_iubmb,
              matureSequence: measurement.modified_sequence_abbreviated_bpforms,
              proteinName: proteinName,
              uniprotId: rawDatum.uniprot_id,
              geneSymbol: rawDatum.gene_name,
              organism: rawDatum.species_name,
              source: measurement.pro_id
            };
            if (organism != null) {
              if (rawDatum.canon_ancestors.includes(organism)) {
                row["taxonomicProximity"] = 0;
              } else {
                row["taxonomicProximity"] = docs.distance;
              }
            }
            formattedData.push(row);
          }
        }
      }
    }
    return formattedData;
  }

  formatProteinData(query, organism, rawData) {
    if (!Array.isArray(rawData)) {
      return [];
    }

    const formattedData = [];
    for (const rawDatum of rawData) {
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

          const formattedDatum = {
            processing: measurement.processing,
            modifications: measurement.modifications,
            crosslinks: measurement.crosslinks,
            deletions: measurement.deletions,
            processedSequence: measurement.processsed_sequence_iubmb,
            matureSequence: measurement.modified_sequence_abbreviated_bpforms,
            proteinName: proteinName,
            uniprotId: rawDatum.uniprot_id,
            geneSymbol: rawDatum.gene_name,
            organism: rawDatum.species_name,
            source: measurement.pro_id
          };

          if (organism != null) {
            formattedDatum[
              "taxonomicProximity"
            ] = DataTable.calcTaxonomicDistance(
              rawDatum.taxon_distance,
              organism,
              rawDatum.species_name
            );
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
        }
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false
    };
  }

  static getColDefs(query, organism, formattedData, taxonomicRanks) {
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
        headerName: "Processed sequence (IUBMB)",
        field: "processedSequence",
        hide: true
      },
      {
        headerName: "Mature sequence (BpForms)",
        field: "matureSequence",
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
        filter: "textFilter",
        cellRenderer: function(params) {
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
        }
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
          if (params.value != null) {
            const value = taxonomicRanks[params.value];
            return upperCaseFirstLetter(value);
          } else {
            return null;
          }
        },
        comparator: DataTable.numericComparator
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
        id="protein-modifications"
        title="Protein modifications"
        entity-type="ortholog group"
        data-type="protein modifications"
        get-data-url={this.getUrl.bind(this)}
        format-data={this.formatData.bind(this)}
        get-side-bar-def={ProteinModificationDataTable.getSideBarDef}
        get-col-defs={ProteinModificationDataTable.getColDefs}
        get-col-sort-order={ProteinModificationDataTable.getColSortOrder}
        dom-layout="normal"
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { ProteinModificationDataTable };
