import React from "react";
import { render } from "@testing-library/react";
import { Route, Switch } from "react-router-dom";

import Metabolite from "~/scenes/BiochemicalEntityDetails/Metabolite/Metabolite";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "core-js/stable";
import "regenerator-runtime/runtime";
jest.useFakeTimers();

let the_json = "";

//jest.useFakeTimers();

//jest.runAllTimers();

const renderComponent = (metabolite, organism, abstract) =>
  render(
    <MemoryRouter
      initialEntries={["/metabolite/" + metabolite + "/" + organism]}
    >
      <Route path="/metabolite/:metabolite/:organism?/">
        <Metabolite />
      </Route>
    </MemoryRouter>
  );

describe("Page Rendering and Consensus", () => {

  const {
      getByTestId,
      getByText,
      getAllByText,
      getByPlaceholderText
    } = renderComponent("ATP", "Bacillus subtilis");

  it("test metabolite metadata", async () => {
    await waitForElement(() => getByTestId("description"))
    expect(getByTestId("description")).toHaveTextContent("is a multifunctional nucleotide");
    expect(getByTestId("synonyms")).toHaveTextContent("Glucobasin");
    expect(getByTestId("links")).toHaveTextContent("BioCyC: ATP");
    expect(getByTestId("physics")).toHaveTextContent("SMILES: NC1=NC=NC2=C1N=CN2[C@@H]1O[C@H](COP(O)(=O)OP(O)(=O)OP(O)(O)=O)[C@@H](O)[C@H]1O");
    expect(getByTestId("localizations")).toHaveTextContent("Cytosol");
    expect(getByTestId("biology")).toHaveTextContent("2-O-α-mannosyl-D-glycerate degradation");


  });

  it.skip("filter and update consensus", async () => {
    // Render new instance in every test to prevent leaking state

    await waitForElement(() => getByTestId("description"));

    //click on get consensus
    expect(getByTestId("description")).toHaveTextContent("is a multifunctional nucleotide");
    fireEvent.click(getByText("Stats"));
    jest.runAllTimers();
    expect(getByTestId("summary")).toHaveTextContent("8.9");
    /*

    //make sure that the mean is present (mean should be 3,002.643)
    expect(getAllByText("3,002", { exact: false }));
    expect(getAllByText(".643", { exact: false }));

    let node = getByPlaceholderText("Enter Organism...");
    fireEvent.change(node, { target: { value: "escherichia" } });

    jest.runAllTimers();
    fireEvent.click(getByText("Update Consensus"));
    jest.runAllTimers();
    expect(getAllByText("4,755", { exact: false }));
    */
  });
});

describe("Taxon Filtering", () => {
  it.skip("test taxonomy filter", async () => {
    // Render new instance in every test to prevent leaking state
    const {
      container,
      getByText,
      getAllByText,
      queryAllByText,
      queryByText,
      findAllByText,
      findByText,
      getByPlaceholderText
    } = renderComponent("AMP", "Saccharomyces cerevisiae", false);

    await waitForElement(() => getByText("101", { exact: false }));
    await waitForElement(() => queryAllByText("Escherichia", { exact: false }));
    await waitForElement(() => findAllByText("Escherichia", { exact: false }));

    expect(getAllByText("Escherichia", { exact: false }));
    expect(
      queryAllByText("Escherichia", { exact: false }).length
    ).toBeGreaterThan(0);
    expect(
      queryAllByText("Saccharomyces", { exact: false }).length
    ).toBeGreaterThan(0);
    //expect(queryByText('Escherichia', { exact: false })).toBeNull()
    //let taxon_slider = container.querySelectorAll(".taxon_slider_bar .ant-slider-handle")[0]
    let taxon_slider = container.querySelector(
      ".taxon_slider .taxon_slider_bar .ant-slider-handle"
    );
    //let taxon_slider = container.querySelectorAll(".taxon_slider_bar")[0]
    await fireEvent.mouseDown(taxon_slider);

    await jest.runAllTimers();
    expect(queryAllByText("Escherichia", { exact: false }).length).toEqual(0); // make sure e coli was filtered out
    expect(
      queryAllByText("Saccharomyces", { exact: false }).length
    ).toBeGreaterThan(0); // make sure yeast is still in

    jest.runAllTimers();
    console.log("done");
  });
});

describe("Tanimoto Filtering", () => {
  it.skip("test include similar compounds", async () => {
    // Render new instance in every test to prevent leaking state
    jest.runAllTimers();

    const {
      getByTestId,
      getByText,
      getAllByText,
      queryAllByText,
      queryByText,
      findAllByText,
      findByText,
      getByPlaceholderText
    } = renderComponent("ATP", "Saccharomyces cerevisiae", true);

    //await waitForElement(() => getByTestId("tanimoto_button"));
    await waitForElement(() => getByText("Molecular Similarity"));
    //await fireEvent.click(getByTestId("tanimoto_button"))
    jest.runAllTimers();

    expect(getByText("Molecular Similarity"));
  });

  it.skip("mocks window.location.reload", () => {
    const { location } = window;
    delete window.location;
    window.location = { reload: jest.fn() };

    expect(window.location.reload).not.toHaveBeenCalled();
    window.location.reload();
    expect(window.location.reload).toHaveBeenCalled();
    window.location = location;
  });
});
