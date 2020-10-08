/* global cy, describe, it */

describe("Footer loads correctly", function () {
  it("successfully loads", function () {
    cy.visit("/");

    // check content
    cy.get(".footer-component .footer-item")
      .first()
      .next()
      .find("a")
      .should("have.text", "Karr Lab");

    // visit a link
    cy.location("pathname").should("equal", "/");
    cy.get(".footer-component .footer-item")
      .first()
      .next()
      .next()
      .find("a")
      .click();
    cy.location("pathname").should("not.equal", "/");
  });
});
