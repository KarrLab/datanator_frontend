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

    // toggle all columns
    cy.get("#" + dataContainerId + " .ag-side-button")
      .first()
      .click();
    cy.get("#" + dataContainerId + " .ag-column-select-checkbox").each(
      $input => {
        cy.wrap($input).click();
      }
    );
  });
});
