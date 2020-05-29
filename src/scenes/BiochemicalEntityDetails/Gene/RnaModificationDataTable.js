import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
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
    const args = ["ko_number=" + query, "_from=0", "size=10"];
    if (organism) {
      args.push("taxon_distance=true");
      args.push("target_organism=" + organism);
    }

    return "rna/modification/get_modifications_by_ko/?" + args.join("&");
  }

  formatData(query, organism, rawData) {
    const formattedData = [];
    for (const rawDatum of rawData) {
      for (const measurement of rawDatum.modifications) {
        if (measurement.bpforms_errors != null) {
          continue;
        }

        const row = {
          numModifications: measurement.number_of_modifications,
          unmodifiedSequence: measurement.sequence_iupac,
          modifiedSequence: measurement.sequence_bpforms,
          aminoAcid: rawDatum.amino_acid,
          anticodon: measurement.anticodon,
          organism: measurement.organism,
          localization: measurement.organellum,
          source: "MODOMICS"
        };
        if (organism != null) {
          row["taxonomicProximity"] = DataTable.calcTaxonomicDistance(
            measurement.taxon_distance,
            organism,
            measurement.organism
          );
        }
        formattedData.push(row);
      }
    }

    this.props["set-scene-metadata"]({ coding: false }, true);

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
        headerName: "Modifications",
        field: "numModifications",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        comparator: DataTable.numericComparator
      },
      {
        headerName: "Unmodified sequence (IUPAC)",
        field: "unmodifiedSequence",
        filter: "textFilter"
      },
      {
        headerName: "Modified sequence (BpForms)",
        field: "modifiedSequence",
        filter: "textFilter"
      },
      {
        headerName: "Amino acid",
        field: "aminoAcid",
        filter: "textFilter"
      },
      {
        headerName: "Anticodon",
        field: "anticodon",
        filter: "textFilter"
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
        headerName: "Localization",
        field: "localization",
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
            '<a href="https://iimcb.genesilico.pl/modomics/sequences/" target="_blank" rel="noopener noreferrer">' +
            params.value +
            "</a>"
          );
        }
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
