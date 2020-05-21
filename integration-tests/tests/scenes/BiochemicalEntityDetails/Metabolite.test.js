/* global cy, describe, it, expect */

describe("Metabolite scene", function() {
  it("Metabolite scene without organism successfully loads", function() {
    const route = "metabolite";
    const entity = "YSYKRGRSMLTJNL-URARBOGNSA-L"; // TDP-Glucose
    const url = "/" + route + "/" + entity;

    cy.visit(url);

    // page title
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
    });

    // data table
    const dataContainerId = "concentration";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Concentration");
  });

  it("Metabolite scene with organism successfully loads", function() {
    const route = "metabolite";
    const entity = "YSYKRGRSMLTJNL-URARBOGNSA-L"; // TDP-Glucose
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;

    cy.server();
    cy.fixture("metabolite-concentrations-" + entity + "-" + organism).then(
      json => {
        cy.route({
          method: "GET",
          url:
            "/metabolites/concentrations/similar_compounds/?inchikey=" +
            entity +
            "&*",
          status: 200,
          response: json
        });
      }
    );

    cy.visit(url);

    // page title
    cy.get(".page-title").should($el => {
      expect($el.text().startsWith("Metabolite: ")).to.be.true;
      expect($el.text().endsWith(" in " + organism)).to.be.true;
    });

    // data table
    const dataContainerId = "concentration";
    cy.get("#" + dataContainerId + " .ag-root .ag-header-row")
      .find(".ag-header-cell")
      .first()
      .find(".ag-header-cell-text")
      .should("have.text", "Concentration");

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

    // open stats tool panel
    cy.get(
      "#" + dataContainerId + " .biochemical-entity-data-table-tool-panel"
    ).each($toolPanelButton => {
      cy.wrap($toolPanelButton).click();
    });
  });
});
