/* global cy, describe, it, expect */

describe("DataTable", function () {
  it("Data table displays, column toggle visibility, data downloads, and data tables mount and unmounts", function () {
    const route = "metabolite";
    const entity = "HXXFSFRBOHSIMQ-VFUOTHLCSA-N"; // Alpha-D-glucose 1-phosphate
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism + "/";

    cy.visit(url);
    cy.get(".page-title").should(($el) => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

    // scroll to concentration data
    cy.window()
      .its("cypressHistory")
      .invoke("push", url + "#concentration");
    cy.get("#concentration .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should(($el) => {
        expect($el.text().startsWith("Concentration")).to.be.true;
      });

    // toggle all columns
    cy.get("#concentration .biochemical-entity-data-table-tool-panel")
      .first()
      .click();
    cy.get(
      "#concentration .biochemical-entity-scene-columns-tool-panel input"
    ).each(($input) => {
      cy.wrap($input).click();
    });
    cy.get("#concentration .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .last()
      .find(".ag-header-cell-text")
      .should("have.text", "Media");

    // download as CSV, JSON
    cy.get(
      "#concentration .content-block-heading-container .content-block-heading-actions button"
    ); // .each(($button) => {
    // cy.wrap($button).click();
    // });

    // navigate to new page, back, to home, back
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "/" + "Esperiana esperi");
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "/" + organism);
    cy.window().its("cypressHistory").invoke("push", "/");
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "/" + organism);
    cy.get(".page-title").should(($el) => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });
});
