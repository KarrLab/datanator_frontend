import React, { Component } from "react";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";

class RateConstantsDataTable extends Component {
  getUrl(query) {
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

  formatData(rawData) {
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

  getConcBarDef(formattedData) {
    const sideBar = {
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
          id: "stats-kcat",
          labelDefault: "Stats: k<sub>cat</sub> (s<sup>-1</sup>)",
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
        labelDefault: "Stats: K<sub>M</sub> " + kmMet + " (M)",
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

  getColDefs(organism, formattedData) {
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
        filter: "agNumberColumnFilter",
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
        filter: "agNumberColumnFilter"
      });
    }

    // metadata columns
    colDefs.push({
      headerName: "Organism",
      field: "organism",
      filter: "agSetColumnFilter"
    });

    colDefs.push({
      headerName: "Variant",
      field: "wildtypeMutant",
      hide: true,
      filter: "agSetColumnFilter"
    });

    /*
    colDefs.push({
      headerName: "Taxonomic distance",
      field: "taxonomicProximity",
      hide: true,
      filter: "taxonomyFilter",
      filterParams: {
        taxonLineage: []
      },
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
      filter: "agNumberColumnFilter"
    });

    colDefs.push({
      headerName: "pH",
      field: "ph",
      cellRenderer: "numericCellRenderer",
      type: "numericColumn",
      filter: "agNumberColumnFilter"
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
      filter: "agSetColumnFilter"
    });

    // return column definitions
    return colDefs;
  }

  formatColHeadings(event) {
    const gridApi = event.api;
    const panelLabelClasses = {
      columns: "ag-column-tool-panel-column-label",
      filters: "ag-group-component-title"
    };
    for (const panelId in panelLabelClasses) {
      const panel = gridApi.getToolPanelInstance(panelId);
      const labels = panel.eGui.getElementsByClassName(
        panelLabelClasses[panelId]
      );
      for (const label of labels) {
        if (!label.innerHTML.startsWith("<span>")) {
          label.innerHTML =
            "<span>" +
            label.innerHTML
              .replace("k_{cat}", "k<sub>cat</sub>")
              .replace("K_M", "K<sub>M</sub>")
              .replace("s^{-1}", "s<sup>-1</sup>") +
            "</span>";
        }
      }
    }
  }

  render() {
    return (
      <DataTable
        id="rate-constants"
        title="Rate constants"
        entity-type="reaction"
        data-type="rate constants"
        get-data-url={this.getUrl}
        format-data={this.formatData}
        get-side-bar-def={this.getConcBarDef}
        get-col-defs={this.getColDefs}
        format-col-headings={this.formatColHeadings}
      />
    );
  }
}
export { RateConstantsDataTable };
