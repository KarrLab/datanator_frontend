/* global cy, describe, it */

describe("Help scene", function () {
  it("successfully loads", function () {
    cy.visit("/help/");
    cy.get(".page-title").should("contain", "Help");
  });
});
