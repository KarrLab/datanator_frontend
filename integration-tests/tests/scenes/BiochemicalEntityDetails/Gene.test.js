/* global cy, describe, it */

describe("Protein scene", function() {
  /*
  it("Protein scene without organism successfully loads", function() {
    const route = "protein";
    const entity = "K00973";
    const url = "/" + route + "/" + entity;

    cy.visit(url);

    // page title
    cy.get(".page-title").should("have.text", "Protein: Glucose-1-phosphate thymidylyltransferase");

    // data table
    const dataContainerId = "abundance";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Abundance");
  });
  */

  it("Protein scene with organism successfully loads", function() {
    const route = "protein";
    const entity = "K00973";
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;

    cy.visit(url);

    // page title
    cy.get(".page-title").should(
      "have.text",
      "Gene: Glucose-1-phosphate thymidylyltransferase in " + organism
    );

    // data table
    const dataContainerId = "abundance";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Abundance");

    // open columns tool panel and toggle all columns
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .first()
      .click();
    cy.get(
      "#" +
        dataContainerId +
        " .biochemical-entity-scene-columns-tool-panel input"
    ).each($input => {
      cy.wrap($input).click();
    });

    // open filters tool panel and open all filters
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .eq(1)
      .click();
    cy.get(
      "#" + dataContainerId + " .biochemical-entity-scene-filter-container"
    ).each($filter => {
      cy.wrap($filter).click();
    });

    // open stats tool panels
    cy.get(
      "#" + dataContainerId + " .biochemical-entity-data-table-tool-panel"
    ).each($toolPanelButton => {
      cy.wrap($toolPanelButton).click();
    });
  });

  it("RNA scene with organism successfully loads", function() {
    const route = "protein";
    const entity = "K16370";
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;

    cy.visit(url);

    // data table
    const dataContainerId = "half-life";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Half-life (s-1)");

    // open columns tool panel and toggle all columns
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .first()
      .click();
    cy.get(
      "#" +
        dataContainerId +
        " .biochemical-entity-scene-columns-tool-panel input"
    ).each($input => {
      cy.wrap($input).click();
    });

    // open filters tool panel and open all filters
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .eq(1)
      .click();
    cy.get(
      "#" + dataContainerId + " .biochemical-entity-scene-filter-container"
    ).each($filter => {
      cy.wrap($filter).click();
    });

    // open stats tool panels
    cy.get(
      "#" + dataContainerId + " .biochemical-entity-data-table-tool-panel"
    ).each($toolPanelButton => {
      cy.wrap($toolPanelButton).click();
    });
  });
});
