/* global cy, describe, it, expect */

describe("TanimotoFilter", function() {
  it("Correctly filters rows", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const url = "/" + route + "/" + entity;
    const dataContainerId = "concentration";

    //use fixture with tanimoto_similarity always < 1
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

    // open all colums including the chemical similarity column
    cy.get("#" + dataContainerId + " .ag-side-button")
      .eq(0)
      .click();
    cy.get(
      "#" +
        dataContainerId +
        " .biochemical-entity-scene-columns-tool-panel input"
    ).each($input => {
      cy.wrap($input).check({ force: true });
    });

    // open filters tool panel and open all filters, including the Tanimoto filter
    cy.get("#" + dataContainerId + " .ag-side-button")
      .eq(1)
      .click();
    cy.get(
      "#" + dataContainerId + " .ag-filter-panel .ag-group-component"
    ).each($filter => {
      cy.wrap($filter).click();
    });

    // change the value of the filter to the maximum
    cy.get(
      "#" + dataContainerId + " .tanimoto-tool-panel-slider .MuiSlider-thumb"
    )
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: 1e4, clientY: 0 })
      .trigger("mouseup", { force: true });
    cy.get("#" + dataContainerId + " .tanimoto-tool-panel-slider input").should(
      "have.attr",
      "value",
      "1"
    );

    // check that rows were filtered
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("have.length", 0);
    cy.get("#" + dataContainerId + " .ag-root-wrapper").then($grid => {
      expect(
        $grid[0].__agComponent.gridApi.getFilterModel().tanimotoSimilarity
      ).to.equal(1);
    });

    // programmatically reset filter so all rows are displayed
    cy.get("#" + dataContainerId + " .ag-root-wrapper").then($grid => {
      $grid[0].__agComponent.gridApi.setFilterModel({
        tanimotoSimilarity: null
      });
    });
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("not.have.length", 0);

    // programmatically set filter so no rows are displayed
    cy.get("#" + dataContainerId + " .ag-root-wrapper").then($grid => {
      $grid[0].__agComponent.gridApi.setFilterModel({
        tanimotoSimilarity: 1
      });
    });
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("have.length", 0);
  });
});
