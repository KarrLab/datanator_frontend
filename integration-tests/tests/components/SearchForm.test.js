/* global cy, describe, it */

describe("Works correctly", function() {
  it("Works correctly", function() {
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
    cy.route("/ftx/text_search/?index=taxon_tree*").as("getTaxa");

    cy.get(
      ".content-container-home-scene .search-form .search-form-el-organism input"
    ).type("coli");
    cy.get(".content-container-home-scene .search-form .search-submit").should(
      "have.class",
      "bp3-disabled"
    );

    cy.wait("@getTaxa");
    cy.get(".bp3-popover-content .bp3-menu .bp3-menu-item")
      .first()
      .click({ force: true });
    //cy.get(".content-container-home-scene .search-form .search-submit")
    //  .should('not.have.class', 'bp3-disabled');

    // submit search
    cy.get(".content-container-home-scene .search-form .search-submit").click();
    cy.url().should("include", "/search/glucose/");
    cy.url().should("not.eq", "/search/glucose/");
  });
});
