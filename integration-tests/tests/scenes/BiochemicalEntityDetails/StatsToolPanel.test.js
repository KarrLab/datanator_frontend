/* global cy, describe, it */

describe("StatsToolPanel", function() {
  it("Display stats of selected rows correctly", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const url = "/" + route + "/" + entity;
    const dataContainerId = "concentration";

    cy.visit(url);

    // open stats tool panel
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .eq(2)
      .click();

    // select some rows
    cy.get(
      "#" + dataContainerId + " .ag-root .ag-center-cols-container .ag-row"
    ).each($row => {
      cy.wrap($row)
        .find(".ag-selection-checkbox")
        .click();
    });
  });
});
