/* global cy, describe, it, expect */

describe("Common components", function() {
  it("Metadata section mounts and unmounts", function() {
    const metabolite = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    cy.visit("/metabolite/" + metabolite);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite + "#description");
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite);
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });

  it("Displays REST API errors correctly", function() {
    const metabolite = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    cy.server();
    cy.route({
      method: "GET",
      url: "/metabolites/concentration/?metabolite=" + metabolite + "&*",
      status: 400,
      response: {
        status: 400,
        detail: "Invalid"
      }
    }).as("getData");

    cy.visit("/metabolite/" + metabolite);
    cy.wait("@getData");
    cy.get(".dialog-message-container span")
      .first()
      .should($el => {
        const text = $el.text();
        expect(
          text ===
            "We were unable to retrieve data about metabolite '" +
              metabolite +
              "'." ||
            text ===
              "Unable to retrieve concentration data about metabolite '" +
                metabolite +
                "'."
        ).to.be.true;
      });

    cy.get(".dialog-message-container")
      .parent()
      .parent()
      .parent()
      .find("button")
      .click();

    cy.get(".header-component .logo").click();
    cy.url().should("match", /:\/\/.*?\/$/);

    cy.visit("/metabolite/" + metabolite + "/" + organism);
    cy.wait("@getData");
    cy.get(".dialog-message-container span")
      .first()
      .should($el => {
        const text = $el.text();
        expect(
          text ===
            "We were unable to retrieve data about metabolite '" +
              metabolite +
              "'." ||
            text ===
              "Unable to retrieve concentration data about metabolite '" +
                metabolite +
                "'."
        ).to.be.true;
      });
  });
});
