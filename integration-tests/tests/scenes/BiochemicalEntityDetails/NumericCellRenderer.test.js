/* global cy, describe, it */

describe("NumericCellRenderer", function() {
  it("Numeric cells render correctly", function() {
    const route = "metabolite";
    const entity = "YSYKRGRSMLTJNL-URARBOGNSA-L"; // TDP-Glucose
    const url = "/" + route + "/" + entity;
    const dataContainerId = "concentration";

    cy.server();
    cy.fixture("metabolite-concentrations-" + entity).then(json => {
      cy.route({
        method: "GET",
        url:
          "/metabolites/concentrations/similar_compounds/?inchikey=" +
          entity +
          "&*",
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
      .should("have.text", "2.6 × 10-6");
    getRows()
      .eq(1)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.text", "4.3 × 10-6");
    getRows()
      .eq(18)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.text", "0.0010");
    getRows()
      .eq(80)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.text", "9240.0");
  });
});
