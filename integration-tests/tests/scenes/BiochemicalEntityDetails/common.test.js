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

  it("Data table displays, toggles columns, downloads data, and mount and unmounts", function() {
    const metabolite = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    const url = "/metabolite/" + metabolite + "/" + organism;

    cy.visit(url);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

    // scroll to concentration data
    cy.window()
      .its("cypressHistory")
      .invoke("push", url + "#concentration");
    cy.get("#concentration .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should($el => {
        expect($el.text().startsWith("Concentration (")).to.be.true;
      });

    // display all columns
    cy.get("#concentration .ag-side-button")
      .first()
      .click();
    cy.get("#concentration .ag-column-select-checkbox").each($input => {
      cy.wrap($input).click();
    });
    cy.get("#concentration .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .last()
      .find(".ag-header-cell-text")
      .should("have.text", "Media");

    // download as CSV, JSON
    cy.get(
      "#concentration .content-block-heading-container .content-block-heading-actions button"
    ).each($button => {
      cy.wrap($button).click();
    });

    // navigate to new page, back, to home, back
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite + "/" + "Esperiana esperi");
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/metabolite/" + metabolite + "/" + organism);
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/");
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
      .should(
        "have.text",
        "Unable to retrieve concentration data about metabolite '" +
          metabolite +
          "'."
      );

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
      .should(
        "have.text",
        "Unable to retrieve concentration data about metabolite '" +
          metabolite +
          "'."
      );
  });
});
