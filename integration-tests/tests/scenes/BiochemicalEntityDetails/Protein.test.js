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
      "Protein: Glucose-1-phosphate thymidylyltransferase in " + organism
    );

    // data table
    const dataContainerId = "abundance";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Abundance");
  });
});
