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
    const organism = "Escherichia coli";
    cy.visit("/metabolite/" + metabolite + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });
});

describe("Common components", function() {
  it("Metadata section mounts and unmounts", function() {
    const metabolite = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    cy.visit("/metabolite/" + metabolite);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    cy.visit("/metabolite/" + metabolite + "#description");
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    cy.visit("/metabolite/" + metabolite + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

    cy.visit("/metabolite/" + metabolite);
    cy.visit("/metabolite/" + metabolite + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });
});
