/* global cy, describe, it */

describe("HtmlColumnHeader", function () {
  it("HTML column headings display and sort correctly", function () {
    const route = "reaction";
    const entity =
      "YSYKRGRSMLTJNL-KFQCIAAJSA-N-->PSXWNITXWWECNY-UCBTUHGZSA-N,XLYOFNOQVPJJNP-UHFFFAOYSA-N"; // DTDP-glucose 4,6-dehydratase
    const url = "/" + route + "/" + entity + "/";
    const dataContainerId = "#rate-constants";

    cy.visit(url);

    // check text rendered correctly
    cy.get(dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .find("span")
      .should("have.html", "k<sub>cat</sub> value");

    // check sorts
    function getHeaderCellLabelContainer() {
      return cy
        .get(dataContainerId + " .ag-root .ag-header-row")
        .find(".ag-header-cell")
        .first()
        .find(".ag-cell-label-container");
    }

    function getHeaderCellLabel() {
      return cy
        .get(dataContainerId + " .ag-root .ag-header-row")
        .find(".ag-header-cell")
        .first()
        .find(".ag-cell-label-container")
        .find(".ag-header-cell-label");
    }

    function getAscIcon() {
      return cy
        .get(dataContainerId + " .ag-root .ag-header-row")
        .find(".ag-header-cell")
        .first()
        .find(".ag-cell-label-container")
        .find(".ag-sort-ascending-icon");
    }

    function getDescIcon() {
      return cy
        .get(dataContainerId + " .ag-root .ag-header-row")
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
});
