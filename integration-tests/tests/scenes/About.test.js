/* global cy, describe, it */

describe("About scene", function() {
  it("successfully loads", function() {
    cy.visit("/about");
    cy.get(".page-title").should("contain", "About");
  });
});
