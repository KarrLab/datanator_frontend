/* global cy, describe, it */

describe("Statistics scene", function () {
  it("successfully loads", function () {
    cy.visit("/stats/");
    cy.get(".page-title").should("contain", "Statistics");
  });
});
