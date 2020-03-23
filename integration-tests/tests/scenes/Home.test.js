/* global cy, describe, it */

describe("Home scene", function() {
  it("successfully loads", function() {
    cy.visit("/");
    cy.get(".logo-title h1").should("contain", "Datanator");
  });
});
