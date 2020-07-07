/* global cy, describe, it, expect */

describe("MetadataSection", function () {
  it("Metadata section mounts and unmounts", function () {
    const route = "metabolite";
    const entity = "YSYKRGRSMLTJNL-KFQCIAAJSA-N"; // DTDP-D-Glucose
    const organism = "Escherichia coli";

    cy.visit("/" + route + "/" + entity + "/");
    cy.get(".page-title").should(($el) => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    cy.visit("/" + route + "/" + entity + "#description");
    cy.get(".page-title").should(($el) => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    cy.visit("/" + route + "/" + entity + "/" + organism);
    cy.get(".page-title").should(($el) => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

    cy.visit("/" + route + "/" + entity);
    cy.visit("/" + route + "/" + entity + "/" + organism);
    cy.get(".page-title").should(($el) => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });
});
