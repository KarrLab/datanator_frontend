/* global cy, describe, it */

describe("NumericCellRenderer", function() {
  it("Numeric cells render correctly", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const url = "/" + route + "/" + entity;
    const dataContainerId = "concentration";

    cy.server();
    cy.fixture("metabolite-concentrations-" + entity).then(json => {
      cy.route({
        method: "GET",
        url:
          "/metabolites/concentration/?metabolite=" + entity + "&abstract=true",
        status: 200,
        response: json
      });
    });

    cy.visit(url);

    function getRows() {
      return cy.get(
        "#" + dataContainerId + " .ag-root .ag-center-cols-clipper .ag-row"
      );
    }

    getRows()
      .eq(0)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.html", "1790.0");
    getRows()
      .eq(1)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.html", "1790.1");
    getRows()
      .eq(2)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.html", "1790.0");
    getRows()
      .eq(3)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.text", "1.8 × 104");
    getRows()
      .eq(4)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.text", "1.8 × 10-4");
  });
});
