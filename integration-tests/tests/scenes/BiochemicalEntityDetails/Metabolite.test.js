/* global cy, describe, it, expect */

describe("Metabolite scene", function() {
  it("Metabolite scence without organism successfully loads", function() {
    const metabolite = "dTDP-D-Glucose";
    cy.visit("/metabolite/" + metabolite);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });
  });

  it("Metabolite scence with organism successfully loads", function() {
    const metabolite = "dTDP-D-Glucose";
    const organism = "Escherichia coli"
    cy.visit("/metabolite/" + metabolite + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });
    cy.get(".page-title").should($el => {
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });
});
