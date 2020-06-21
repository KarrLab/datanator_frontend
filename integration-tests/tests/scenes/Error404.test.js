/* global cy, describe, it */

describe("Error 404 scene", function () {
  it("successfully loads", function () {
    cy.visit("/not-existent-route/");
    cy.get(".title").should("contain", "404");
    cy.get(".subtitle").should("contain", "Page not found");
  });
});
