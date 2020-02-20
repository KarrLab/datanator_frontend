/* global cy, describe, it, expect */

describe("Metabolite scene", function() {
  it("Metabolite scene without organism successfully loads", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const url = "/" + route + "/" + entity;

    cy.visit(url);

    // page title
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    // data table
    const dataContainerId = "concentration";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Concentration (µM)");
  });

  it("Metabolite scene with organism successfully loads", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;

    cy.visit(url);

    // page title
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

    // data table
    const dataContainerId = "concentration";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Concentration (µM)");

    // open columns tool panel and toggle all columns
    cy.get("#" + dataContainerId + " .ag-side-button")
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
    cy.get("#" + dataContainerId + " .ag-side-button")
      .eq(1)
      .click();
    cy.get(
      "#" + dataContainerId + " .ag-filter-panel .ag-group-component"
    ).each($filter => {
      cy.wrap($filter).click();
    });

    // open stats tool panels
    cy.get("#" + dataContainerId + " .ag-side-button").each(
      $toolPanelButton => {
        cy.wrap($toolPanelButton).click();
      }
    );
  });
});
