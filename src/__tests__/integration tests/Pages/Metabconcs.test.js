import React from 'react';
import { render, } from '@testing-library/react';
import { Provider } from 'react-redux'
import {Route, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import Metabconcs from '~/scenes/Results/Metabconcs';
import { MemoryRouter } from "react-router-dom";
import { ResultsTable, getSelectedData } from '~/components/Results/ResultsTable.js';
import createStore from '~/data/Store.js'

import {fireEvent, waitForElement } from '@testing-library/react'

jest.useFakeTimers();



let the_json = ""

//jest.useFakeTimers();

const store = createStore

//jest.runAllTimers();

const renderComponent = (molecule, organism) =>
  render (
    <MemoryRouter initialEntries={['/metabconcs/' + molecule + '/' + organism]}>
      <Route path="/metabconcs/:molecule/:organism/:abstract?/">
       <Provider store={store}>
        <Metabconcs />
        </Provider>
      </Route>
    </MemoryRouter>
  );


it('render metabconcs page', async () => {
  // Render new instance in every test to prevent leaking state
  const { getByTestId, getByText, getAllByText, getByPlaceholderText  } =  renderComponent('ATP', 'escherichia coli');

  await waitForElement(() => getByText('9640', { exact: false }));
  expect(getByTestId('test_table'))
  expect(getAllByText('Escherichia coli K12 NCM3722', { exact: false }))
  expect(getAllByText('Saccharomyces cerevisiae', { exact: false }))

});


it('filter and update consensus', async () => {
  // Render new instance in every test to prevent leaking state
  const {getByText, getAllByText, getByPlaceholderText  } =  renderComponent('ATP', 'escherichia coli');

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


it('test taxonomy filter', async () => {
  // Render new instance in every test to prevent leaking state
  const { container, getByText, getAllByText, queryAllByText, queryByText, findAllByText, findByText, getByPlaceholderText  } =  renderComponent( 'ATP', 'Homo sapiens');

  await waitForElement(() => getByText('9640', { exact: false }));
  await waitForElement(() => queryAllByText('Escherichia', { exact: false }));
  await waitForElement(() => findAllByText('Escherichia', { exact: false }));

  expect(getAllByText('Escherichia', { exact: false }))
  expect(queryAllByText('Escherichia', { exact: false }).length).toBeGreaterThan(0)
  expect(queryAllByText('Saccharomyces', { exact: false }).length).toBeGreaterThan(0)
  //expect(queryByText('Escherichia', { exact: false })).toBeNull()
  //let taxon_slider = container.querySelectorAll(".taxon_slider_bar .ant-slider-handle")[0]
  let taxon_slider = container.querySelector(".taxon_slider_bar .ant-slider-handle")
  //let taxon_slider = container.querySelectorAll(".taxon_slider_bar")[0]
  await fireEvent.mouseDown(taxon_slider)
  //await fireEvent.mouseDown(taxon_slider)
  //await fireEvent.mouseDown(taxon_slider)
  //await fireEvent.mouseDown(taxon_slider)
  //fireEvent.keyDown(taxon_slider, { key: 'ArrowDown', code: 40 })
  //fireEvent.keyDown(taxon_slider, { key: 'ArrowDown', code: 40 })


  //click on get consensus
  //fireEvent.change(taxon_slider, {target: {"aria-valuenow":"28"}})
  //fireEvent.click(taxon_slider)
  await jest.runAllTimers();
  expect(queryAllByText('Escherichia', { exact: false }).length).toEqual(0)
  expect(queryAllByText('Saccharomyces', { exact: false }).length).toEqual(0)
  
  //expect(queryByText('Escherichia', { exact: false })).toBeNull()
  //expect(queryByText('Saccharomyces', { exact: false })).toBeNull()
  //expect(findByText('Saccharomyces', { exact: false })).toBeNull()
  //fireEvent.change(taxon_slider, {target: {"aria-valuenow":"10"}})
  jest.runAllTimers();
  console.log("done")

  //expect(queryAllByText('Saccharomyces')).toBeNull()


});

