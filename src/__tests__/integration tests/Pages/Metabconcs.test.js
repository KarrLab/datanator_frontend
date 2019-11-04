import React from 'react';
import { render, } from '@testing-library/react';
import { Provider } from 'react-redux'
import {Route, Switch } from 'react-router-dom'

import Metabconcs from '~/scenes/Results/Metabconcs';
import { MemoryRouter } from "react-router-dom";
import createStore from '~/data/Store.js'
import {fireEvent, waitForElement } from '@testing-library/react'

jest.useFakeTimers();



let the_json = ""

//jest.useFakeTimers();

const store = createStore

//jest.runAllTimers();

const renderComponent = (molecule, organism, abstract) =>
  render (
    <MemoryRouter initialEntries={['/metabconcs/' + molecule + '/' + organism + '/' + abstract]}>
      <Route path="/metabconcs/:molecule/:organism/:abstract?/">
       <Provider store={store}>
        <Metabconcs />
        </Provider>
      </Route>
    </MemoryRouter>
  );

describe('Page Rendering and Consensus', () => {

it('render metabconcs page', async () => {
  // Render new instance in every test to prevent leaking state
  const { getByTestId, getByText, getAllByText, getByPlaceholderText  } =  renderComponent('ATP', 'Bacillus subtilis', false);

  await waitForElement(() => getByText('9640', { exact: false }));
  expect(getByTestId('test_table'))
  expect(getAllByText('Escherichia coli K12 NCM3722', { exact: false }))
  expect(getAllByText('Saccharomyces cerevisiae', { exact: false }))

});


it('filter and update consensus', async () => {
  // Render new instance in every test to prevent leaking state
  const {getByText, getAllByText, getByPlaceholderText  } =  renderComponent('ATP', 'Bacillus subtilis', false);

  await waitForElement(() => getByText('9640', { exact: false }));

  //click on get consensus
  fireEvent.click(getByText('Get Consensus'))

  //make sure that the mean is present (mean should be 3,002.643)
  expect(getAllByText('3,002', { exact: false }))
  expect(getAllByText('.643', { exact: false }))

  let node = getByPlaceholderText('Enter Organism...')
  fireEvent.change(node, { target: { value: "escherichia" } })

  jest.runAllTimers();
  fireEvent.click(getByText('Update Consensus'))
  jest.runAllTimers()
  expect(getAllByText('4,755', { exact: false }))

});
});


describe('Taxon Filtering', () => {

it('test taxonomy filter', async () => {
  // Render new instance in every test to prevent leaking state
  const { container, getByText, getAllByText, queryAllByText, queryByText, findAllByText, findByText, getByPlaceholderText  } =  renderComponent( 'AMP', 'Saccharomyces cerevisiae', false);

  await waitForElement(() => getByText('101', { exact: false }));
  await waitForElement(() => queryAllByText('Escherichia', { exact: false }));
  await waitForElement(() => findAllByText('Escherichia', { exact: false }));

  expect(getAllByText('Escherichia', { exact: false }))
  expect(queryAllByText('Escherichia', { exact: false }).length).toBeGreaterThan(0)
  expect(queryAllByText('Saccharomyces', { exact: false }).length).toBeGreaterThan(0)
  //expect(queryByText('Escherichia', { exact: false })).toBeNull()
  //let taxon_slider = container.querySelectorAll(".taxon_slider_bar .ant-slider-handle")[0]
  let taxon_slider = container.querySelector(".taxon_slider .taxon_slider_bar .ant-slider-handle")
  //let taxon_slider = container.querySelectorAll(".taxon_slider_bar")[0]
  await fireEvent.mouseDown(taxon_slider)

  await jest.runAllTimers();
  expect(queryAllByText('Escherichia', { exact: false }).length).toEqual(0) // make sure e coli was filtered out
  expect(queryAllByText('Saccharomyces', { exact: false }).length).toBeGreaterThan(0) // make sure yeast is still in
  

  jest.runAllTimers();
  console.log("done")

});
})

describe('Tanitomo Filtering', () => {
it('test include similar compounds', async () => {
  // Render new instance in every test to prevent leaking state
  const { getByTestId, getByText, getAllByText, queryAllByText, queryByText, findAllByText, findByText, getByPlaceholderText  } =  renderComponent( 'ATP', 'Saccharomyces cerevisiae', true);

  //await waitForElement(() => getByTestId("tanitomo_button"));
  await waitForElement(() => getByText("Molecular Similarity"));
  //await fireEvent.click(getByTestId("tanitomo_button"))
  jest.runAllTimers();

  expect(getByText("Molecular Similarity"))

});


it('mocks window.location.reload', () => {
  const { location } = window;
  delete window.location;
  window.location = { reload: jest.fn() };

  expect(window.location.reload).not.toHaveBeenCalled();
  window.location.reload();
  expect(window.location.reload).toHaveBeenCalled();
  window.location = location;
});
})