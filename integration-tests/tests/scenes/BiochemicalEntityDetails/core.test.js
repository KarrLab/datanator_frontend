/* global cy, describe, it */

describe("Common components", function() {
  it("Table of contents links scroll to elements", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const url = "/" + route + "/" + entity;
    const dataContainerId = "concentration";

    cy.visit(url);
    cy.get(".table-of-contents ul")
      .first()
      .find("li")
      .last()
      .find("a")
      .click();
    cy.location("hash").should("equal", "#" + dataContainerId);
  });

  it("REST API errors are correctly displayed", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    cy.server();
    cy.route({
      method: "GET",
      url: "/metabolites/concentration/?metabolite=" + entity + "&*",
      status: 400,
      response: {
        status: 400,
        detail: "Invalid"
      }
    }).as("getData");

    cy.visit("/" + route + "/" + entity);
    cy.wait("@getData");
    cy.get(".dialog-message-container span")
      .first()
      .should(
        "have.text",
        "Unable to retrieve concentration data about metabolite '" +
          entity +
          "'."
      );

    cy.get(".dialog-message-container")
      .parent()
      .parent()
      .parent()
      .find("button")
      .click();

    cy.get(".header-component .logo").click();
    cy.location("pathname").should("equal", "/");

    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "/" + organism);
    cy.wait("@getData");
    cy.get(".dialog-message-container span")
      .first()
      .should(
        "have.text",
        "Unable to retrieve concentration data about metabolite '" +
          entity +
          "'."
      );
  });
});
