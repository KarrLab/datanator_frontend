/* global cy, describe, it, expect, Cypress */

describe("NumericCellRenderer", function () {
  it("Numeric cells render correctly", function () {
    const route = "metabolite";
    const entity = "YSYKRGRSMLTJNL-URARBOGNSA-L"; // TDP-Glucose
    const url = "/" + route + "/" + entity + "/";
    const dataContainerId = "#concentration";

    cy.server();
    cy.fixture("metabolite-concentrations-" + entity).then((json) => {
      cy.route({
        method: "GET",
        url:
          "/metabolites/concentrations/similar_compounds/?inchikey=" +
          entity +
          "&*",
        status: 200,
        response: json,
      });
    });

    cy.visit(url);

    function getRows() {
      return cy.get(
        dataContainerId +
          " .ag-root .ag-center-cols-clipper .ag-row .ag-cell-value[aria-colindex='1'] .ag-numeric-cell"
      );
    }

    cy.get(
      dataContainerId + " .ag-root .ag-center-cols-clipper .ag-row"
    ).should("have.length", 92);

    getRows().should(($cells) => {
      const vals = $cells
        .map((i, cell) => {
          return Cypress.$(cell).text();
        })
        .toArray();
      expect(vals).to.include("2.6 × 10-6");
      expect(vals).to.include("4.3 × 10-6");
      expect(vals).to.include("0.0010");
      expect(vals).to.include("9240.0");
    });
  });
});
