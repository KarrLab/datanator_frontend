/* global cy, describe, it, expect */

describe("RNA scene", function() {
  it("RNA scene without organism successfully loads", function() {
    const route = "rna";
    const entity = "Dolichol-P-glucose synthetase";
    const url = "/" + route + "/" + entity;

    cy.visit(url);

    // page title
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("RNA: ")).to.be.true;
    });

    // data table
    const dataContainerId = "half-life";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Half-life (s-1)");
  });

  it("RNA scene with organism successfully loads", function() {
    const route = "rna";
    const entity = "Dolichol-P-glucose synthetase";
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;

    cy.visit(url);

    // page title
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("RNA: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

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
