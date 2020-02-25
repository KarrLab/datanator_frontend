import React, { Component } from "react";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";

class HalfLifeDataTable extends Component {
  static getUrl(query) {
    return (
      "/rna/halflife/get_info_by_protein_name/" +
      "?protein_name=" +
      query +
      "&_from=0" +
      "&size=1000"
    );
  }

  static formatData(rawData) {
    const measurements = rawData[0].halflives;
    const formattedData = [];
    for (const measurement of measurements) {
      formattedData.push({
        halfLife: parseFloat(measurement.halflife),
        organism: measurement.species,
        growthMedium: measurement.growth_medium,
        source: measurement.reference[0].doi
      });
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
            col: ["halfLife"]
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
        headerName: "Half-life (s^{-1})",
        headerComponentFramework: HtmlColumnHeader,
        headerComponentParams: {
          name: (
            <span>
              Half-life (s<sup>-1</sup>)
            </span>
          )
        },
        field: "halfLife",
        cellRenderer: "numericCellRenderer",
        type: "numericColumn",
        filter: "numberFilter",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        headerName: "Organism",
        field: "organism",
        filter: "textFilter"
      },
      /*
      {
        headerName: "Taxonomic distance",
        field: "taxonomicProximity",
        hide: true,
        filter: "taxonomyFilter",
        valueFormatter: params => {
          const value = params.value;
          return value;
        }
      },
      */
      {
        headerName: "Media",
        field: "growthMedium",
        filter: "textFilter",
        hide: false
      },
      {
        headerName: "Source",
        field: "source",
        cellRenderer: function(params) {
          return (
            '<a href="https://dx.doi.org/' +
            params.value +
            '" target="_blank" rel="noopener noreferrer">' +
            "DOI" +
            "</a>"
          );
        },
        filterValueGetter: () => "DOI",
        filter: "textFilter"
      }
    ];
  }

  render() {
    return (
      <DataTable
        id="half-life"
        title="Half-life"
        entity-type="RNA"
        data-type="half-life"
        get-data-url={HalfLifeDataTable.getUrl}
        format-data={HalfLifeDataTable.formatData}
        get-side-bar-def={HalfLifeDataTable.getSideBarDef}
        get-col-defs={HalfLifeDataTable.getColDefs}
      />
    );
  }
}
export { HalfLifeDataTable };
