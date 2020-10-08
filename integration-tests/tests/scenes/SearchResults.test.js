/* global cy, describe, it, expect */

describe("Search results scene with no entity nor organism", function () {
  it("successfully loads", function () {
    cy.visit("/search/");
    cy.get(".title").should("contain", "404");
    cy.get(".subtitle").should("contain", "Page not found");
  });
});

describe("Search results scene with entity", function () {
  it("successfully loads", function () {
    cy.visit("/search/glucose/");
    cy.get(".page-title").should("contain", "Search: glucose");

    // metabolites
    cy.get("#metabolites .search-results-list > li")
      .first()
      .find(".search-result-title")
      .should(($el) => {
        const text = $el.text();
        expect(text).to.match(/glucose/i);
      });
    cy.get("#metabolites .search-results-list > li")
      .first()
      .find(".search-result-title a")
      .should(($el) => {
        expect($el.attr("href")).to.match(/^\/metabolite\//i);
        expect($el.attr("href")).to.not.match(/\/Escherichia coli\/$/i);
      });
    cy.get("#metabolites .search-results-list > li")
      .first()
      .find(".search-result-description li")
      .first()
      .should(($el) => {
        const text = $el.text();
        expect(text).to.match(/^(InChI key: [A-Z-]+|ChEBI: \d+|KEGG: C\d+)$/);
      });

    // Genes
    cy.get("#genes .search-results-list > li")
      .first()
      .find(".search-result-title")
      .should(($el) => {
        const text = $el.text();
        expect(text).to.match(/glucose/i);
      });
    cy.get("#genes .search-results-list > li")
      .first()
      .find(".search-result-title a")
      .should(($el) => {
        expect($el.attr("href")).to.match(/^\/gene\//i);
        expect($el.attr("href")).to.not.match(/\/Escherichia coli\/$/i);
      });
    cy.get("#genes .search-results-list > li")
      .first()
      .find(".search-result-description")
      .should(($el) => {
        const text = $el.text();
        expect(text).to.match(/^OrthoDB: [0-9]+at[0-9]+$/);
      });

    // Reactions
    cy.get("#reactions .search-results-list > li")
      .first()
      .find(".search-result-title a")
      .should(($el) => {
        expect($el.attr("href")).to.match(/^\/reaction\//i);
        expect($el.attr("href")).to.not.match(/\/Escherichia coli\/$/i);
      });
    cy.get("#reactions .search-results-list > li")
      .first()
      .find(".search-result-description")
      .should(($el) => {
        const text = $el.text();
        expect(text).to.match(/^.+? → .+/);
      });
  });
});

describe("Search results scene with entity and organism", function () {
  it("successfully loads", function () {
    cy.visit("/search/glucose/Escherichia coli/");
    cy.get(".page-title").should(
      "contain",
      "Search: glucose in Escherichia coli"
    );

    // metabolites
    cy.get("#metabolites .search-results-list > li")
      .first()
      .find(".search-result-title")
      .should(($el) => {
        const text = $el.text();
        expect(text).to.match(/glucose/i);
      });
    cy.get("#metabolites .search-results-list > li")
      .first()
      .find(".search-result-title a")
      .should(($el) => {
        expect($el.attr("href")).to.match(/^\/metabolite\//i);
        expect($el.attr("href")).to.match(/\/Escherichia coli\/$/i);
      });

    // genes
    cy.get("#genes .search-results-list > li")
      .first()
      .find(".search-result-title")
      .should(($el) => {
        const text = $el.text();
        expect(text).to.match(/glucose/i);
      });
    cy.get("#genes .search-results-list > li")
      .first()
      .find(".search-result-title a")
      .should(($el) => {
        expect($el.attr("href")).to.match(/^\/gene\//i);
        expect($el.attr("href")).to.match(/\/Escherichia coli\/$/i);
      });

    // Reactions
    cy.get("#reactions .search-results-list > li")
      .first()
      .find(".search-result-title a")
      .should(($el) => {
        expect($el.attr("href")).to.match(/^\/reaction\//i);
        expect($el.attr("href")).to.match(/\/Escherichia coli\/$/i);
      });
  });
});

describe("Search results scene with more results", function () {
  it("successfully loads", function () {
    cy.visit("/search/glucose/");
    cy.get(".page-title").should("contain", "Search: glucose");

    // initial results
    cy.get("#metabolites .search-results-list > li").should("have.length", 10);
    cy.get("#reactions .search-results-list > li").should("have.length", 10);

    // request more metabolites
    cy.get("#metabolites .more-search-results-button").first().click();
    cy.get("#metabolites .search-results-list > li").should("have.length", 20);
    cy.get("#metabolites .more-search-results-button").first().click();
    cy.get("#metabolites .search-results-list > li").should("have.length", 30);

    // request more genes
    cy.get("#genes .more-search-results-button").first().click();
    cy.get("#genes .search-results-list > li").should("have.length", 20);
    cy.get("#genes .more-search-results-button").first().click();
    cy.get("#genes .search-results-list > li").should("have.length", 30);
    cy.get("#genes .more-search-results-button").first().click();
    cy.get("#genes .search-results-list > li").should("have.length", 40);
    cy.get("#genes .more-search-results-button").first().click();
    cy.get("#genes .search-results-list > li").should("have.length", 50);
    cy.get("#genes .more-search-results-button").first().click();
    cy.get("#genes .search-results-list > li").should("have.length", 60);
    cy.get("#genes .more-search-results-button").first().click();
    cy.get("#genes .search-results-list > li").should("have.length", 70);
  });
});

describe("Search results scene with no results", function () {
  it("successfully loads", function () {
    cy.visit("/search/__blank__/");

    // metabolites
    cy.get("#metabolites .no-search-results").should(($el) => {
      const text = $el.text();
      expect(text).to.equal("No results found.");
    });
  });
});

describe("Navigate to page and search again", function () {
  it("successfully loads", function () {
    cy.visit("/");

    // search for glucose
    cy.get(".header-component .page-links .bp3-icon-search").parent().click();
    cy.get(".header-component .search-form-el-entity input").type("glucose");
    cy.get(".header-component .search-submit").click();

    // test page has results for glucose
    cy.get(".page-title").should("contain", "Search: glucose");
    cy.get("#metabolites .search-results-list > li").should("have.length", 10);

    // search for fructose
    cy.get(".header-component .search-form-el-entity input").clear();
    cy.get(".header-component .search-form-el-entity input").type("fructose");
    cy.get(".header-component .search-submit").click();

    // test page has results for fructose
    cy.get(".page-title").should("contain", "Search: fructose");
    cy.get("#metabolites .search-results-list > li").should("have.length", 10);
  });
});

describe("Navigate away from page", function () {
  it("successfully loads", function () {
    cy.visit("/search/__blank__/");
    cy.get(".header-component .logo").click();
  });
});
