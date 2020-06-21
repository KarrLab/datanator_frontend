/* global cy, describe, it, expect */

describe("Open and close", function () {
  it("successfully loads", function () {
    cy.server();
    cy.route({
      method: "GET",
      url: "/ftx/**",
      status: 400,
      response: {
        status: 400,
        detail: "Missing parameters",
      },
    }).as("getResults");

    cy.visit("/search/ABC-XYZ/");
    cy.wait("@getResults");
    cy.get(".dialog-message-container span")
      .first()
      .should(($el) => {
        const text = $el.text();
        expect(text).to.equal(
          "We were unable to conduct your search for 'ABC-XYZ'."
        );
      });

    cy.get(".dialog-message-container")
      .parent()
      .parent()
      .parent()
      .find("button")
      .click();

    cy.get("body > .MuiDialog-root").should("not.exist");
  });
});
