/* global cy, describe, it, expect */

describe("Open and close", function() {
  it("successfully loads", function() {
    cy.server();
    cy.route({
      method: "GET",
      url: "/ftx/text_search/num_of_index/*",
      status: 400,
      response: {
        status: 400,
        detail: "Missing parameters"
      }
    }).as("getResults");
    cy.visit("/search/glucose");
    cy.wait("@getResults");
    cy.get(".dialog-message-container span")
      .first()
      .should($el => {
        const text = $el.text();
        expect(text).to.equal(
          "We were unable to conduct your search for 'glucose'."
        );
      });

    cy.get(".dialog-message-container")
      .parent()
      .parent()
      .parent()
      .find("button")
      .click();
  });
});
