/* global cy, describe, it */

describe("Loads and opens search form on search results page", function() {
  it("successfully loads", function() {
    cy.visit("/");
    cy.get(".header-component .page-links button")
      .first()
      .click();
    cy.visit("/search/glucose");
  });
});
