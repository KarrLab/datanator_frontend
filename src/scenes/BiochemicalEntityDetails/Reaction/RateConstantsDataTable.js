import React, { Component } from "react";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";

class RateConstantsDataTable extends Component {
  static getUrl(query) {
    const substratesProducts = query.split("-->");
    const substrates = substratesProducts[0].trim();
    const products = substratesProducts[1].trim();
    return (
      "reactions/kinlaw_by_name/" +
      "?substrates=" +
      substrates +
      "&products=" +
      products +
      "&_from=0" +
      "&size=1000" +
      "&bound=tight"
    );
  }

  static formatData(rawData) {
    const formattedData = [];

    for (const datum of rawData) {
      let wildtypeMutant = null;
      if (datum["taxon_wildtype"] === "1") {
        wildtypeMutant = "wildtype";
      } else if (datum["taxon_wildtype"] === "0") {
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

  static getConcBarDef(formattedData) {
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

  static getColDefs(organism, formattedData) {
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
        headerCheckboxSelectionFilteredOnly: true
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
        filter: "numberFilter"
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

    /*
    colDefs.push({
      headerName: "Taxonomic distance",
      field: "taxonomicProximity",
      hide: true,
      filter: "taxonomyFilter",
      valueFormatter: params => {
        const value = params.value;
        return value;
      }
    })
    */

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

    // return column definitions
    return colDefs;
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
        get-side-bar-def={RateConstantsDataTable.getConcBarDef}
        get-col-defs={RateConstantsDataTable.getColDefs}
      />
    );
  }
}
export { RateConstantsDataTable };