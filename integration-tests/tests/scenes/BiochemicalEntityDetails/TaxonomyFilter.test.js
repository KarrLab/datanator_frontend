/* global cy, describe, it, expect */

describe("TaxonomyFilter", function() {
  it("Correctly filters rows", function() {
    const route = "metabolite";
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;
    const dataContainerId = "concentration";

    //use fixture with taxon_distance always = 1
    cy.server();
    cy.fixture("metabolite-concentrations-" + entity).then(json => {
      cy.route({
        method: "GET",
        url: "/metabolites/concentration/?metabolite=" + entity + "&*",
        status: 200,
        response: json
      });
    });

    cy.visit(url);

    // open all colums including the taxonomic distance column
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

    // open filters tool panel and open all filters, including the taxonomy distance filter
    cy.get("#" + dataContainerId + " .ag-side-button")
      .eq(1)
      .click();
    cy.get(
      "#" + dataContainerId + " .ag-filter-panel .ag-group-component"
    ).each($filter => {
      cy.wrap($filter).click();
    });

    // change the value of the filter to the maximum
    cy.get("#" + dataContainerId + " .taxonomy-tool-panel-slider input").should(
      "not.have.attr",
      "value",
      "0"
    );
    cy.get(
      "#" + dataContainerId + " .taxonomy-tool-panel-slider .MuiSlider-thumb"
    )
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: 0, clientY: 1e6 })
      .trigger("mouseup", { force: true });
    cy.get("#" + dataContainerId + " .taxonomy-tool-panel-slider input").should(
      "have.attr",
      "value",
      "0"
    );

    // check that rows were filtered
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("have.length", 0);
    cy.get("#" + dataContainerId + " .ag-root-wrapper").then($grid => {
      expect(
        $grid[0].__agComponent.gridApi.getFilterModel().taxonomicProximity
      ).to.equal(0);
    });

    // programmatically reset filter so all rows are displayed
    cy.get("#" + dataContainerId + " .ag-root-wrapper").then($grid => {
      $grid[0].__agComponent.gridApi.setFilterModel({
        taxonomicProximity: null
      });
    });
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("not.have.length", 0);

    // programmatically set filter so no rows are displayed
    cy.get("#" + dataContainerId + " .ag-root-wrapper").then($grid => {
      $grid[0].__agComponent.gridApi.setFilterModel({
        taxonomicProximity: 0
      });
    });
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("have.length", 0);
  });
});
