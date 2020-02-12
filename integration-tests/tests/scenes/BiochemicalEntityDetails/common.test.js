/* global cy, describe, it, expect */

describe("Common components", function() {
  it("Table of contents links scrolls to elements", function() {
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

  it("Metadata section mounts and unmounts", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    cy.visit("/" + route + "/" + entity);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "#description");
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity);
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });

  it("Data table displays, toggles columns, downloads data, and mount and unmounts", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;

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
      .invoke("push", "/" + route + "/" + entity + "/" + "Esperiana esperi");
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "/" + organism);
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/");
    cy.window()
      .its("cypressHistory")
      .invoke("push", "/" + route + "/" + entity + "/" + organism);
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });
  });

  it("Displays HTML column headings correctly", function() {
    const route = "rna";
    const entity = "Dolichol-P-glucose synthetase";
    const url = "/" + route + "/" + entity;
    const dataContainerId = "half-life";

    cy.visit(url);
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .find("span")
      .should("have.html", "Half-life (s<sup>-1</sup>)");
  });

  it("Displays REST API errors correctly", function() {
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
