import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import Tooltip from "@material-ui/core/Tooltip";
import { TAXONOMIC_PROXIMITY_TOOLTIP } from "../ColumnsToolPanel/TooltipDescriptions";

class RateConstantsDataTable extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired
  };

  static getUrl(query, organism) {
    const args = ["_from=0", "size=1000", "bound=tight"];

    const substratesProducts = query.split("-->");
    args.push(
      "substrates=" +
        substratesProducts[0].split(",").join(encodeURIComponent("|"))
    );
    if (substratesProducts.length >= 2) {
      args.push(
        "products=" +
          substratesProducts[1].split(",").join(encodeURIComponent("|"))
      );
    }

    if (organism) {
      args.push("taxon_distance=true");
      args.push("species=" + organism);
    }

    return "reactions/kinlaw_by_name/?" + args.join("&");
  }

  static formatData(rawData, organism, lengthOfTaxonomicRanks) {
    const formattedData = [];

    for (const datum of rawData) {
      let wildtypeMutant = null;
      if (datum["taxon_wildtype"] === 1) {
        wildtypeMutant = "wildtype";
      } else if (datum["taxon_wildtype"] === 0) {
        wildtypeMutant = "mutant";
      }

      const formattedDatum = {
        kcat: RateConstantsDataTable.getKcatValues(datum.parameter),
        km: RateConstantsDataTable.getKmValues(datum.parameter),
        organism: datum.taxon_name,
        wildtypeMutant: wildtypeMutant,
        temperature: datum.temperature,
        ph: datum.ph,
        source: datum["kinlaw_id"]
      };

      if (organism != null) {
        let distance = "";
        if (organism in datum.taxon_distance) {
          distance = datum.taxon_distance[organism];
        } else {
          distance = lengthOfTaxonomicRanks + 1;
        }
        formattedDatum["taxonomicProximity"] = distance;
      }

      if (
        formattedDatum.kcat != null ||
        Object.keys(formattedDatum.km).length > 0
      ) {
        formattedData.push(formattedDatum);
      }
    }

    return formattedData;
  }

  static getKcatValues(parameters) {
    for (const parameter of parameters) {
      if (parameter.name === "k_cat") {
        return parseFloat(parameter.value);
      }
    }
  }

  static getKmValues(parameters) {
    const kms = {};
    for (const parameter of parameters) {
      if (
        parameter.type === 27 &&
        parameter.observed_name.toLowerCase() === "km"
      ) {
        kms[parameter.name] = parseFloat(parameter.value);
      }
    }
    return kms;
  }

  static getSideBarDef(formattedData) {
    const sideBar = {
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
          id: "stats-kcat",
          labelDefault: (
            <span>
              Stats: k<sub>cat</sub> (s<sup>-1</sup>)
            </span>
          ),
          labelKey: "chart",
          iconKey: "chart",
          toolPanel: "statsToolPanel",
          toolPanelParams: {
            col: ["kcat"]
          }
        }
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false
    };

    // K_M tool panels
    let kmMets = {};
    for (const formattedDatum of formattedData) {
      for (const met in formattedDatum.km) {
        kmMets[met] = true;
      }
    }
    kmMets = Object.keys(kmMets);
    kmMets.sort();

    for (const kmMet of kmMets) {
      sideBar["toolPanels"].push({
        id: "stats-km-" + kmMet,
        labelDefault: (
          <span>
            Stats: K<sub>M</sub> {kmMet} (M)
          </span>
        ),
        labelKey: "chart",
        iconKey: "chart",
        toolPanel: "statsToolPanel",
        toolPanelParams: {
          col: ["km", kmMet]
        }
      });
    }

    // return all tool panels
    return sideBar;
  }

  static getColDefs(organism, formattedData, taxonomicRanks) {
    const colDefs = [];

    // k_cat column
    let hasKcat = false;
    for (const formattedDatum of formattedData) {
      if (formattedDatum.kcat != null) {
        hasKcat = true;
        break;
      }
    }

    if (hasKcat) {
      colDefs.push({
        headerName: "k_{cat}",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              k<sub>cat</sub> (s<sup>-1</sup>)
            </span>
          )
        },
        field: "kcat",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        comparator: DataTable.numericComparator
      });
    }

    // K_M columns
    let kmMets = {};
    for (const formattedDatum of formattedData) {
      for (const kmMet in formattedDatum.km) {
        kmMets[kmMet] = true;
      }
    }
    kmMets = Object.keys(kmMets);
    kmMets.sort();

    for (const kmMet of kmMets) {
      colDefs.push({
        headerName: "K_M " + kmMet + " (M)",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              K<sub>M</sub> {kmMet} (M)
            </span>
          )
        },
        field: "km." + kmMet,
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        comparator: DataTable.numericComparator
      });
    }

    // metadata columns
    colDefs.push({
      headerName: "Organism",
      field: "organism",
      filter: "textFilter"
    });

    colDefs.push({
      headerName: "Variant",
      field: "wildtypeMutant",
      hide: true,
      filter: "textFilter"
    });

    colDefs.push({
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
        const value = taxonomicRanks[params.value - 1];
        return upperCaseFirstLetter(value);
      }
    });

    colDefs.push({
      headerName: "Temperature (C)",
      field: "temperature",
      cellRenderer: "numericCellRenderer",
      type: "numericColumn",
      filter: "numberFilter"
    });

    colDefs.push({
      headerName: "pH",
      field: "ph",
      cellRenderer: "numericCellRenderer",
      type: "numericColumn",
      filter: "numberFilter"
    });

    colDefs.push({
      headerName: "Source",
      field: "source",
      cellRenderer: function(params) {
        return (
          '<a href="http://sabiork.h-its.org/newSearch/index?q=EntryID:' +
          params.value +
          '" target="_blank" rel="noopener noreferrer">' +
          "SABIO-RK" +
          "</a>"
        );
      },
      filterValueGetter: () => "SABIO-RK",
      filter: "textFilter"
    });

    if (!organism) {
      colDefs.splice(-4, 1);
    }

    // return column definitions
    return colDefs;
  }

  static getColSortOrder(organism, formattedData) {
    const sortOrder = [];

    // k_cat column
    let hasKcat = false;
    for (const formattedDatum of formattedData) {
      if (formattedDatum.kcat != null) {
        hasKcat = true;
        break;
      }
    }

    if (hasKcat) {
      sortOrder.push("kcat");
    }

    // K_M columns
    let kmMets = {};
    for (const formattedDatum of formattedData) {
      for (const kmMet in formattedDatum.km) {
        kmMets[kmMet] = true;
      }
    }
    kmMets = Object.keys(kmMets);
    kmMets.sort();

    for (const kmMet of kmMets) {
      sortOrder.push("km." + kmMet);
    }

    return sortOrder;
  }

  render() {
    return (
      <DataTable
        id="rate-constants"
        title="Rate constants"
        entity-type="reaction"
        data-type="rate constants"
        get-data-url={RateConstantsDataTable.getUrl}
        format-data={RateConstantsDataTable.formatData}
        get-side-bar-def={RateConstantsDataTable.getSideBarDef}
        get-col-defs={RateConstantsDataTable.getColDefs}
        get-col-sort-order={RateConstantsDataTable.getColSortOrder}
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { RateConstantsDataTable };
