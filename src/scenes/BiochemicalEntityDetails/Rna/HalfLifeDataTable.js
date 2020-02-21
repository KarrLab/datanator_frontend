import React, { Component } from "react";
import DataTable from "../DataTable/DataTable";
import { HtmlColumnHeader } from "../HtmlColumnHeader";

class HalfLifeDataTable extends Component {
  getUrl(query) {
    return (
      "/rna/halflife/get_info_by_protein_name/" +
      "?protein_name=" +
      query +
      "&_from=0" +
      "&size=1000"
    );
  }

  formatData(rawData) {
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

  getSideBarDef() {
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
          toolPanel: "agFiltersToolPanel",
          toolPanelParams: {
            suppressFilterSearch: true,
            suppressExpandAll: true
          }
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

  getColDefs() {
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
        filterParams: {
          taxonLineage: []
        },
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

  formatColHeadings(event) {
    const gridApi = event.api;
    const panelLabelClasses = {
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
            label.innerHTML.replace("s^{-1}", "s<sup>-1</sup>") +
            "</span>";
        }
      }
    }
  }

  render() {
    return (
      <DataTable
        id="half-life"
        title="Half-life"
        entity-type="RNA"
        data-type="half-life"
        get-data-url={this.getUrl}
        format-data={this.formatData}
        get-side-bar-def={this.getSideBarDef}
        get-col-defs={this.getColDefs}
        format-col-headings={this.formatColHeadings}
      />
    );
  }
}
export { HalfLifeDataTable };
