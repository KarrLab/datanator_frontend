/* global cy, describe, it */

describe("Gene scene", function () {
  it("Gene scene with organism successfully loads with protein abundances", function () {
    const route = "gene";
    const entity = "K00117";
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism + "/";

    cy.visit(url);

    // page title
    cy.get(".page-title").should(
      "have.text",
      "Gene: quinoprotein glucose dehydrogenase in " + organism
    );

    // data table
    const dataContainerId = "#protein-abundance";
    cy.get(dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Abundance");

    // open columns tool panel and toggle all columns
    cy.get(dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .first()
      .click();
    cy.get(
      dataContainerId + " .biochemical-entity-scene-columns-tool-panel input"
    ).each(($input) => {
      cy.wrap($input).click();
    });

    // open filters tool panel and open all filters
    cy.get(dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .eq(1)
      .click();
    cy.get(
      dataContainerId + " .biochemical-entity-scene-filter-container"
    ).each(($filter) => {
      cy.wrap($filter).click();
    });

    // open stats tool panels
    cy.get(dataContainerId + " .biochemical-entity-data-table-tool-panel").each(
      ($toolPanelButton) => {
        cy.wrap($toolPanelButton).click();
      }
    );
  });

  it("Gene scene with organism successfully loads with RNA half-lives", function () {
    const route = "gene";
    const entity = "K16370";
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism + "/";

    cy.visit(url);

    // data table
    const dataContainerId = "#rna-half-life";
    cy.get(dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Half-life");

    // open columns tool panel and toggle all columns
    cy.get(dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .first()
      .click();
    cy.get(
      dataContainerId + " .biochemical-entity-scene-columns-tool-panel input"
    ).each(($input) => {
      cy.wrap($input).click();
    });

    // open filters tool panel and open all filters
    cy.get(dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .eq(1)
      .click();
    cy.get(
      dataContainerId + " .biochemical-entity-scene-filter-container"
    ).each(($filter) => {
      cy.wrap($filter).click();
    });

    // open stats tool panels
    cy.get(dataContainerId + " .biochemical-entity-data-table-tool-panel").each(
      ($toolPanelButton) => {
        cy.wrap($toolPanelButton).click();
      }
    );
  });
});
