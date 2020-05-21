/* global cy, describe, it, expect */

describe("LinkCellRenderer", function() {
  it("Link cells function correctly", function() {
    const route = "metabolite";
    const entity = "RFSUNEUAIZKAJO-ARQDHWQXSA-N"; // D-Fructose
    const organism = "Escherichia coli";
    const dataContainerId = "concentration";
    let url;

    // without organism
    url = "/" + route + "/" + entity;
    cy.visit(url);
    cy.get("#" + dataContainerId + " .ag-root .ag-center-cols-clipper .ag-row")
      .find('.ag-cell-link:not([href~="' + url + '/"])')
      .first()
      .click();

    cy.location("pathname").should("not.equal", url);
    cy.location("pathname").should($val => {
      const val = decodeURI($val);
      expect(val.startsWith("/" + route + "/")).to.be.true;
      expect(val.endsWith("/" + organism + "/")).to.be.false;
    });

    // with organism
    url = "/" + route + "/" + entity + "/" + organism;
    cy.visit(url);
    cy.get("#" + dataContainerId + " .ag-root .ag-center-cols-clipper .ag-row")
      .find('.ag-cell-link:not([href~="' + url + '/"])')
      .first()
      .click();
    cy.location("pathname").should("not.equal", url);
    cy.location("pathname").should($val => {
      const val = decodeURI($val);
      expect(val.startsWith("/" + route + "/")).to.be.true;
      expect(val.endsWith("/" + organism + "/")).to.be.true;
    });
  });
});
