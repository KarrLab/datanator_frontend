/* global cy, describe, it, expect */

describe("Feedback form loads correctly", function() {
  it("successfully loads", function() {
    cy.visit("/");

    // form is initially closed
    cy.get("bruit-core").should($el => {
      const [dom] = $el.get();
      expect(
        dom.shadowRoot
          .querySelector("#bruit-io-wrapper")
          .classList.contains("bruit-close")
      ).to.be.true;
      expect(
        dom.shadowRoot
          .querySelector("#bruit-io-wrapper")
          .classList.contains("bruit-open")
      ).to.be.false;
    });

    // clicking opens form
    cy.get(".feedback-form-component").click();
    cy.get("bruit-core").should($el => {
      const [dom] = $el.get();
      expect(
        dom.shadowRoot
          .querySelector("#bruit-io-wrapper")
          .classList.contains("bruit-close")
      ).to.be.false;
      expect(
        dom.shadowRoot
          .querySelector("#bruit-io-wrapper")
          .classList.contains("bruit-open")
      ).to.be.true;
    });

    // form has the expected title
    const title = "Send us feedback";
    cy.get("bruit-core").should($el => {
      const [dom] = $el.get();
      expect(dom.shadowRoot.querySelector(".bruit-title").innerHTML).to.equal(
        title
      );
    });
  });
});
