/* global cy, describe, it, expect */

describe("Metabolite scene", function() {
  it("Metabolite scence without organism successfully loads", function() {
    const metabolite = "dTDP-D-Glucose";
    const url = "/metabolite/" + metabolite;

    cy.visit(url);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    // scroll to concentration data
    cy.window()
      .its("cypressHistory")
      .invoke("push", url + "#concentration");
    cy.get("#concentration .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should($el => {
        expect($el.text().startsWith("Concentration (")).to.be.true;
      });
  });

  it("Metabolite scence with organism successfully loads", function() {
    const metabolite = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    const url = "/metabolite/" + metabolite + "/" + organism;

    cy.visit(url);
    cy.get(".page-title").should($el => {
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
      .should($el => {
        expect($el.text().startsWith("Concentration (")).to.be.true;
      });

    // display all columns
    cy.get("#concentration .ag-side-button")
      .first()
      .click();
    cy.get("#concentration .ag-column-select-checkbox").each($input => {
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
    ).each($button => {
      cy.wrap($button).click();
    });

    // navigate to new page, back, to home, back
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite + "/" + "Esperiana esperi");
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite + "/" + organism);
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/");
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });
});
