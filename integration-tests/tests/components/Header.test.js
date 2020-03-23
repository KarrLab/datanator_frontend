/* global cy, describe, it */

describe("Header loads and opens search form on search results page", function() {
  it("successfully loads", function() {
    cy.visit("/");

    // open search form
    cy.get(".header-component .search-container").should("have.class", "hide");
    cy.get(".header-component .page-links button")
      .first()
      .click();
    cy.get(".header-component .search-container").should(
      "not.have.class",
      "hide"
    );

    // advance to another scene
    cy.location("pathname").should("equal", "/");
    cy.get(".header-component .page-links button")
      .first()
      .next()
      .click();
    cy.location("pathname").should("not.equal", "/");
  });
});
