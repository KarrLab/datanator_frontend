/* global cy, describe, it, expect, Cypress */

describe("Works correctly", function () {
  it("Works correctly", function () {
    cy.visit("/");
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "have.class",
      "bp3-disabled"
    );

    // enter entity
    cy.get(
      ".content-container-home-scene .search-form .search-form-el-entity input"
    ).type("glucose");
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "not.have.class",
      "bp3-disabled"
    );

    // clear entity
    cy.get(
      ".content-container-home-scene .search-form .search-form-el-entity input"
    ).clear();
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "have.class",
      "bp3-disabled"
    );

    // enter entity and organism
    cy.get(
      ".content-container-home-scene .search-form .search-form-el-entity input"
    ).type("glucose");
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "not.have.class",
      "bp3-disabled"
    );
    cy.get(
      ".content-container-home-scene .search-form .search-form-el-organism input"
    ).type("coli");
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "have.class",
      "bp3-disabled"
    );

    // clear organism
    cy.get(
      ".content-container-home-scene .search-form .search-form-el-organism input"
    ).clear();
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "not.have.class",
      "bp3-disabled"
    );

    // enter organism and select suggestion
    cy.server();
    cy.route(
      "/ftx/text_search/?index=taxon_tree&query_message=Escherichia coli&*"
    ).as("getTaxa");

    cy.get(
      ".content-container-home-scene .search-form .search-form-el-organism input"
    ).type("Escherichia coli");
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "have.class",
      "bp3-disabled"
    );

    cy.wait("@getTaxa");
    cy.get(".bp3-popover-content .bp3-menu li")
      .eq(1)
      .find(".bp3-menu-item")
      .should(($el) => {
        expect($el.text().startsWith("Escherichia coli ")).to.be.true;
      });
    cy.get(".bp3-popover-content .bp3-menu li")
      .first()
      .next()
      .find(".bp3-menu-item")
      .click();
    cy.get(
      ".content-container-home-scene .search-form .search-form-el-organism input"
    ).should(($el) => {
      expect($el.val().startsWith("Escherichia coli ")).to.be.true;
    });
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "not.have.class",
      "bp3-disabled"
    );

    // submit search
    cy.get(".content-container-home-scene .search-form .search-submit").click();
    cy.location("pathname").should("include", "/search/glucose/");
    cy.location("pathname").should("not.eq", "/search/glucose/");
    cy.location("pathname").should("include", encodeURI("/Escherichia coli "));
  });
});
