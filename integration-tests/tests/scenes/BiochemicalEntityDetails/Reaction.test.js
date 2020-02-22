/* global cy, describe, it */

describe("Reaction scene", function() {
  it("Reaction scene without organism successfully loads", function() {
    const route = "reaction";
    const substrates = "D-Glucose 1-phosphate";
    const products = "D-Glucose 6-phosphate";
    const entity = substrates + "-->" + products;
    const url = "/" + route + "/" + entity;

    cy.visit(url);

    // page title
    cy.get(".page-title").should("have.text", "Reaction: Phosphomannomutase");

    // data table
    const dataContainerId = "rate-constants";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "kcat (s-1)");
  });

  it("Reaction scene with organism successfully loads", function() {
    const route = "reaction";
    const substrates = "D-Glucose 1-phosphate";
    const products = "D-Glucose 6-phosphate";
    const entity = substrates + "-->" + products;
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;

    cy.visit(url);

    // page title
    cy.get(".page-title").should(
      "have.text",
      "Reaction: Phosphomannomutase in " + organism
    );

    // data table
    const dataContainerId = "rate-constants";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "kcat (s-1)");

    // open columns tool panel and toggle all columns
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .first()
      .click();
    cy.get(
      "#" +
        dataContainerId +
        " .biochemical-entity-scene-columns-tool-panel input"
    ).each($input => {
      cy.wrap($input).click();
    });

    // open filters tool panel and open all filters
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .eq(1)
      .click();
    cy.get(
      "#" + dataContainerId + " .biochemical-entity-scene-filter-container"
    ).each($filter => {
      cy.wrap($filter).click();
    });

    // open stats tool panels
    cy.get(
      "#" + dataContainerId + " .biochemical-entity-data-table-tool-panel"
    ).each($toolPanelButton => {
      cy.wrap($toolPanelButton).click();
    });
  });
});
