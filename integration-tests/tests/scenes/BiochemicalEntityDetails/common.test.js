/* global cy, describe, it, expect */

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

  it("Data table displays, column toggle visibility, data downloads, and data tables mount and unmounts", function() {
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

    // toggle all columns
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

  it("HTML column headings display and sort correctly", function() {
    const route = "rna";
    const entity = "Dolichol-P-glucose synthetase";
    const url = "/" + route + "/" + entity;
    const dataContainerId = "half-life";

    cy.visit(url);

    // check text rendered correctly
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .find("span")
      .should("have.html", "Half-life (s<sup>-1</sup>)");

    // check sorts
    function getHeaderCellLabelContainer() {
      return cy
        .get("#" + dataContainerId + " .ag-root .ag-header-row")
        .find(".ag-header-cell")
        .first()
        .find(".ag-cell-label-container");
    }

    function getHeaderCellLabel() {
      return cy
        .get("#" + dataContainerId + " .ag-root .ag-header-row")
        .find(".ag-header-cell")
        .first()
        .find(".ag-cell-label-container")
        .find(".ag-header-cell-label");
    }

    function getAscIcon() {
      return cy
        .get("#" + dataContainerId + " .ag-root .ag-header-row")
        .find(".ag-header-cell")
        .first()
        .find(".ag-cell-label-container")
        .find(".ag-sort-ascending-icon");
    }

    function getDescIcon() {
      return cy
        .get("#" + dataContainerId + " .ag-root .ag-header-row")
        .find(".ag-header-cell")
        .first()
        .find(".ag-cell-label-container")
        .find(".ag-sort-descending-icon");
    }

    getHeaderCellLabelContainer().should(
      "have.class",
      "ag-header-cell-sorted-none"
    );
    getAscIcon().should("have.class", "ag-hidden");
    getDescIcon().should("have.class", "ag-hidden");

    getHeaderCellLabel().click();
    getHeaderCellLabelContainer().should(
      "have.class",
      "ag-header-cell-sorted-asc"
    );
    getAscIcon().should("not.have.class", "ag-hidden");
    getDescIcon().should("have.class", "ag-hidden");

    getHeaderCellLabel().click();
    getHeaderCellLabelContainer().should(
      "have.class",
      "ag-header-cell-sorted-desc"
    );
    getAscIcon().should("have.class", "ag-hidden");
    getDescIcon().should("not.have.class", "ag-hidden");

    getHeaderCellLabel().click();
    getHeaderCellLabelContainer().should(
      "have.class",
      "ag-header-cell-sorted-none"
    );
    getAscIcon().should("have.class", "ag-hidden");
    getDescIcon().should("have.class", "ag-hidden");
  });

  it("Link cells function correctly", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    const dataContainerId = "concentration";
    let url;

    // without organism
    url = "/" + route + "/" + entity;
    cy.visit(url);
    cy.get("#" + dataContainerId + " .ag-root .ag-center-cols-clipper .ag-row")
      .first()
      .find('.ag-cell-link:not([href~="' + url + '/"])')
      .first()
      .click();

    cy.location("pathname").should("not.equal", url);
    cy.location("pathname").should($val => {
      const val = decodeURI($val);
      expect(val.startsWith("/" + route + "/")).to.be.true;
      expect(val.endsWith("/" + organism + "/")).to.be.false;
    });

    // with organism
    url = "/" + route + "/" + entity + "/" + organism;
    cy.visit(url);
    cy.get("#" + dataContainerId + " .ag-root .ag-center-cols-clipper .ag-row")
      .first()
      .find('.ag-cell-link:not([href~="' + url + '/"])')
      .first()
      .click();
    cy.location("pathname").should("not.equal", url);
    cy.location("pathname").should($val => {
      const val = decodeURI($val);
      expect(val.startsWith("/" + route + "/")).to.be.true;
      expect(val.endsWith("/" + organism + "/")).to.be.true;
    });
  });

  it("Numeric cells render correctly", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const url = "/" + route + "/" + entity;
    const dataContainerId = "concentration";

    cy.server();
    cy.fixture("metabolite-concentrations-" + entity).then(json => {
      cy.route({
        method: "GET",
        url:
          "/metabolites/concentration/?metabolite=" + entity + "&abstract=true",
        status: 200,
        response: json
      });
    });

    cy.visit(url);

    function getRows() {
      return cy.get(
        "#" + dataContainerId + " .ag-root .ag-center-cols-clipper .ag-row"
      );
    }

    getRows()
      .eq(0)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.html", "1790.0");
    getRows()
      .eq(1)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.html", "1790.1");
    getRows()
      .eq(2)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.html", "1790.0");
    getRows()
      .eq(3)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.text", "1.8 × 104");
    getRows()
      .eq(4)
      .find('.ag-cell-value[aria-colindex="1"] .ag-numeric-cell')
      .should("have.text", "1.8 × 10-4");
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
