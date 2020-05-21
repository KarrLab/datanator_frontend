/* global cy, describe, it, expect */

describe("TaxonomyFilter", function() {
  it("Correctly filters rows", function() {
    const route = "metabolite";
    const entity = "YSYKRGRSMLTJNL-URARBOGNSA-L"; // TDP-Glucose
    const organism = "Escherichia coli";
    const url = "/" + route + "/" + entity + "/" + organism;
    const dataContainerId = "concentration";

    //use fixture
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

    // open all colums including the taxonomic distance column
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
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
    cy.get("#" + dataContainerId + " .biochemical-entity-data-table-tool-panel")
      .eq(1)
      .click();
    cy.get(
      "#" + dataContainerId + " .biochemical-entity-scene-filter-container"
    ).each($filter => {
      cy.wrap($filter).click();
    });

    // change the value of the filter to the maximum
    cy.get(
      "#" +
        dataContainerId +
        " .biochemical-entity-scene-taxonomy-slider-filter input"
    ).should("not.have.attr", "value", "0");
    cy.get(
      "#" +
        dataContainerId +
        " .biochemical-entity-scene-taxonomy-slider-filter .MuiSlider-thumb"
    )
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: 0, clientY: 1e6 })
      .trigger("mouseup", { force: true });
    cy.get(
      "#" +
        dataContainerId +
        " .biochemical-entity-scene-taxonomy-slider-filter input"
    ).should("have.attr", "value", "0");

    // check that rows were filtered
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("have.length.lessThan", 11);
    cy.get("#" + dataContainerId + " .ag-root-wrapper").then($grid => {
      expect(
        $grid[0].__agComponent.gridApi.getFilterModel().taxonomicProximity
          .selectedMarkValue
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
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("have.length", 11);

    // programmatically set filter so no rows are displayed
    cy.get("#" + dataContainerId + " .ag-root-wrapper").then($grid => {
      $grid[0].__agComponent.gridApi.setFilterModel({
        taxonomicProximity: {
          selectedMarkValue: 0,
          markValueToDistance: Array(7)
            .fill()
            .map((x, i) => i),
          rankNameToDistance: {
            species: 0,
            genus: 1,
            family: 2,
            order: 3,
            class: 4,
            phylum: 5,
            superkingdom: 6,
            "cellular life": 7
          }
        }
      });
    });
    cy.get("#" + dataContainerId + " .ag-center-cols-container")
      .children()
      .should("have.length.lessThan", 11);
  });
});
