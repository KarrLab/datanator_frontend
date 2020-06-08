import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";
import Tooltip from "@material-ui/core/Tooltip";
import { TAXONOMIC_PROXIMITY_TOOLTIP } from "../ColumnsToolPanel/TooltipDescriptions";

class RateConstantsDataTable extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired,
  };

  static getUrl(query, organism) {
    const args = ["_from=0", "size=1000", "bound=tight", "dof=0"];

    const substratesProducts = query.split("-->");
    args.push("substrates=" + substratesProducts[0]);
    if (substratesProducts.length >= 2) {
      args.push("products=" + substratesProducts[1]);
    }

    if (organism) {
      args.push("taxon_distance=true");
      args.push("species=" + organism);
    }

    return "reactions/kinlaw_by_rxn/?" + args.join("&");
  }

  static formatData(query, organism, rawData) {
    const formattedData = [];

    for (const datum of rawData) {
      let enzymeName = null;
      let enzymeSubunitUniprotIds = null;
      for (const enz of datum.enzymes) {
        if ("enzyme" in enz) {
          enzymeName = enz["enzyme"][0].enzyme_name;
        } else if ("subunit" in enz) {
          enzymeSubunitUniprotIds = enz["subunit"].map(
            (subunit) => subunit.uniprot_id
          );
          enzymeSubunitUniprotIds.sort();
        }
      }

      let wildtypeMutant = null;
      if (datum["taxon_wildtype"] === 1) {
        wildtypeMutant = "wildtype";
      } else if (datum["taxon_wildtype"] === 0) {
        wildtypeMutant = "mutant";
      }

      const formattedDatum = {
        kcat: RateConstantsDataTable.getKcatValues(datum.parameter),
        km: RateConstantsDataTable.getKmValues(datum.parameter),
        ki: RateConstantsDataTable.getKiValues(datum.parameter),
        enzyme:
          enzymeName == null && enzymeSubunitUniprotIds == null
            ? null
            : { name: enzymeName, subunits: enzymeSubunitUniprotIds },
        organism: datum.taxon_name,
        wildtypeMutant: wildtypeMutant,
        temperature: datum.temperature,
        ph: datum.ph,
        source: datum["kinlaw_id"],
      };

      if (organism != null) {
        formattedDatum["taxonomicProximity"] = DataTable.calcTaxonomicDistance(
          datum.taxon_distance,
          organism,
          datum.taxon_name
        );
      }

      if (
        formattedDatum.kcat != null ||
        Object.keys(formattedDatum.km).length > 0 ||
        Object.keys(formattedDatum.ki).length > 0
      ) {
        formattedData.push(formattedDatum);
      }
    }

    return formattedData;
  }

  static getKcatValues(parameters) {
    for (const parameter of parameters) {
      if (
        parameter.type === 25 ||
        parameter.sbo_type === 25 ||
        parameter.type === 186 ||
        parameter.sbo_type === 186
      ) {
        if (parameter.value != null) {
          return {
            value: parseFloat(parameter.value),
            units: parameter.units,
          };
        } else if (parameter.observed_value != null) {
          return {
            value: parseFloat(parameter.observed_value),
            units: parameter.observed_units,
          };
        }
      }
    }
  }

  static getKmValues(parameters) {
    const kms = {};
    for (const parameter of parameters) {
      if (parameter.type === 27 || parameter.sbo_type === 27) {
        if (parameter.value != null) {
          kms[parameter.name] = {
            value: parseFloat(parameter.value),
            units: parameter.units,
          };
        } else if (parameter.observed_value != null) {
          kms[parameter.name] = {
            value: parseFloat(parameter.observed_value),
            units: parameter.observed_units,
          };
        }
      }
    }
    return kms;
  }

  static getKiValues(parameters) {
    const kis = {};
    for (const parameter of parameters) {
      if (parameter.type === 261 || parameter.sbo_type === 261) {
        if (parameter.value != null) {
          kis[parameter.name] = {
            value: parseFloat(parameter.value),
            units: parameter.units,
          };
        } else if (parameter.observed_value != null) {
          kis[parameter.name] = {
            value: parseFloat(parameter.observed_value),
            units: parameter.observed_units,
          };
        }
      }
    }
    return kis;
  }

  static getSideBarDef(query, organism, formattedData) {
    const sideBar = {
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
      ],
      position: "left",
      defaultToolPanel: "filters",
      hiddenByDefault: false,
    };

    // k_cat tool panel
    let hasKcat = false;
    for (const formattedDatum of formattedData) {
      if (formattedDatum.kcat != null) {
        hasKcat = true;
        break;
      }
    }

    if (hasKcat) {
      sideBar["toolPanels"].push({
        id: "stats-kcat",
        labelDefault: (
          <span>
            Stats: k<sub>cat</sub>
          </span>
        ),
        labelKey: "chart",
        iconKey: "chart",
        toolPanel: "statsToolPanel",
        toolPanelParams: {
          col: ["kcat", "value"],
        },
      });
    }

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
            Stats: K<sub>M</sub> {kmMet}
          </span>
        ),
        labelKey: "chart",
        iconKey: "chart",
        toolPanel: "statsToolPanel",
        toolPanelParams: {
          col: ["km", kmMet, "value"],
        },
      });
    }

    // K_I tool panels
    let kiMets = {};
    for (const formattedDatum of formattedData) {
      for (const met in formattedDatum.ki) {
        kiMets[met] = true;
      }
    }
    kiMets = Object.keys(kiMets);
    kiMets.sort();

    for (const kiMet of kiMets) {
      sideBar["toolPanels"].push({
        id: "stats-ki-" + kiMet,
        labelDefault: (
          <span>
            Stats: K<sub>I</sub> {kiMet}
          </span>
        ),
        labelKey: "chart",
        iconKey: "chart",
        toolPanel: "statsToolPanel",
        toolPanelParams: {
          col: ["ki", kiMet, "value"],
        },
      });
    }

    // return all tool panels
    return sideBar;
  }

  static getColDefs(query, organism, formattedData, taxonomicRanks) {
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
        headerName: "k_{cat} value",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              k<sub>cat</sub> value
            </span>
          ),
        },
        field: "kcat.value",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        comparator: DataTable.numericComparator,
        minWidth: 120,
      });
      colDefs.push({
        headerName: "k_{cat} units",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              k<sub>cat</sub> units
            </span>
          ),
        },
        field: "kcat.units",
        minWidth: 80,
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
        headerName: "K_M " + kmMet + " value",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              K<sub>M</sub> {kmMet} value
            </span>
          ),
        },
        field: "km." + kmMet + ".value",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        comparator: DataTable.numericComparator,
        minWidth: 120,
      });
      colDefs.push({
        headerName: "K_M " + kmMet + " units",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              K<sub>M</sub> {kmMet} units
            </span>
          ),
        },
        field: "km." + kmMet + ".units",
        minWidth: 120,
      });
    }

    // K_I columns
    let kiMets = {};
    for (const formattedDatum of formattedData) {
      for (const kiMet in formattedDatum.ki) {
        kiMets[kiMet] = true;
      }
    }
    kiMets = Object.keys(kiMets);
    kiMets.sort();

    for (const kiMet of kiMets) {
      colDefs.push({
        headerName: "K_I " + kiMet + " value",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              K<sub>I</sub> {kiMet} value
            </span>
          ),
        },
        field: "ki." + kiMet + ".value",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        comparator: DataTable.numericComparator,
        minWidth: 120,
      });
      colDefs.push({
        headerName: "K_I " + kiMet + " units",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              K<sub>I</sub> {kiMet} units
            </span>
          ),
        },
        field: "ki." + kiMet + ".units",
        minWidth: 120,
      });
    }

    // metadata columns
    colDefs.push({
      headerName: "Enzyme",
      field: "enzyme.name",
      filter: "textFilter",
    });

    colDefs.push({
      headerName: "Enzyme subunits",
      field: "enzyme.subunits",
      filter: "textFilter",
      valueFormatter: (params) => {
        if (params.value != null) {
          return params.value.join(", ");
        } else {
          return null;
        }
      },
      cellRenderer: function (params) {
        const subunits = params.value;
        if (subunits != null) {
          return (
            '<ul class="comma-separated-list">' +
            subunits
              .filter((subunit) => subunit != null)
              .map(
                (subunit) =>
                  "<li>" +
                  "<a" +
                  ' href="https://www.uniprot.org/uniprot/' +
                  subunit +
                  '"' +
                  ' target="_blank"' +
                  ' rel="noopener noreferrer"' +
                  ">" +
                  subunit +
                  "</a>" +
                  "</li>"
              )
              .join("") +
            "</ul>"
          );
        } else {
          return null;
        }
      },
      filterValueGetter: (params) => {
        if (params.data.enzyme && params.data.enzyme.subunits.length) {
          return params.data.enzyme.subunits;
        } else {
          return null;
        }
      },
      processCellCallback: (value) => {
        if (value) {
          return value.join(", ");
        } else {
          return null;
        }
      },
    });

    colDefs.push({
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
    });

    colDefs.push({
      headerName: "Variant",
      field: "wildtypeMutant",
      hide: true,
      filter: "textFilter",
    });

    colDefs.push({
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
    });

    colDefs.push({
      headerName: "Temperature (C)",
      field: "temperature",
      cellRenderer: "numericCellRenderer",
      type: "numericColumn",
      filter: "numberFilter",
    });

    colDefs.push({
      headerName: "pH",
      field: "ph",
      cellRenderer: "numericCellRenderer",
      type: "numericColumn",
      filter: "numberFilter",
    });

    colDefs.push({
      headerName: "Source",
      field: "source",
      cellRenderer: function (params) {
        return (
          '<a href="http://sabiork.h-its.org/newSearch/index?q=EntryID:' +
          params.value +
          '" target="_blank" rel="noopener noreferrer">' +
          "SABIO-RK" +
          "</a>"
        );
      },
      filterValueGetter: () => "SABIO-RK",
      filter: "textFilter",
      processCellCallback: (value) => {
        if (value) {
          return "SABIO-RK: " + value;
        } else {
          return null;
        }
      },
    });

    if (!organism) {
      colDefs.splice(-4, 1);
    }

    // return column definitions
    return colDefs;
  }

  static getColSortOrder(query, organism, formattedData) {
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

    // K_I columns
    let kiMets = {};
    for (const formattedDatum of formattedData) {
      for (const kiMet in formattedDatum.ki) {
        kiMets[kiMet] = true;
      }
    }
    kiMets = Object.keys(kiMets);
    kiMets.sort();

    for (const kiMet of kiMets) {
      sortOrder.push("ki." + kiMet);
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
