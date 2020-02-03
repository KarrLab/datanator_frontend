import React from 'react';
import { render, } from '@testing-library/react';
import { Provider } from 'react-redux'
import {Route, Switch } from 'react-router-dom'

import Metabolite from '~/scenes/BiochemicalEntityDetails/Metabolite/Metabolite';
import { MemoryRouter } from "react-router-dom";
import createStore from '~/data/Store.js'
import {fireEvent, waitForElement } from '@testing-library/react'

jest.useFakeTimers();



let the_json = ""

//jest.useFakeTimers();

const store = createStore

//jest.runAllTimers();

const renderComponent = (metabolite, organism, abstract) =>
  render (
    <MemoryRouter initialEntries={['/metabolite/' + metabolite + '/' + organism ]}>
      <Route path="/metabolite/:metabolite/:organism?/">
       <Provider store={store}>
        <Metabolite />
        </Provider>
      </Route>
    </MemoryRouter>
  );

describe('Page Rendering and Consensus', () => {

it('render metabolite page', async () => {
  // Render new instance in every test to prevent leaking state
  const { getByTestId, getByText, getAllByText, getByPlaceholderText  } =  renderComponent('ATP', 'Bacillus subtilis');

  await waitForElement(() => getByTestId('description'));
  expect(getByTestId('description'))
  expect(getAllByText('Escherichia coli K12 NCM3722', { exact: false }))
  expect(getAllByText('Saccharomyces cerevisiae', { exact: false }))

});




it.skip('filter and update consensus', async () => {
  // Render new instance in every test to prevent leaking state
  const {getByTestId, getAllByText, getByPlaceholderText  } =  renderComponent('ATP', 'escherichia coli', false);

  await waitForElement(() => getByTestId('description'));

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

it.skip('test taxonomy filter', async () => {
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

describe('Tanimoto Filtering', () => {
it.skip('test include similar compounds', async () => {
  // Render new instance in every test to prevent leaking state
  jest.runAllTimers();

  const { getByTestId, getByText, getAllByText, queryAllByText, queryByText, findAllByText, findByText, getByPlaceholderText  } =  renderComponent( 'ATP', 'Saccharomyces cerevisiae', true);

  //await waitForElement(() => getByTestId("tanimoto_button"));
  await waitForElement(() => getByText("Molecular Similarity"));
  //await fireEvent.click(getByTestId("tanimoto_button"))
  jest.runAllTimers();

  expect(getByText("Molecular Similarity"))

});


it.skip('mocks window.location.reload', () => {
  const { location } = window;
  delete window.location;
  window.location = { reload: jest.fn() };

  expect(window.location.reload).not.toHaveBeenCalled();
  window.location.reload();
  expect(window.location.reload).toHaveBeenCalled();
  window.location = location;
});
})
