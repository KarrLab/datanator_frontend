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

'use strict';
function timerGame(callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback && callback();
  }, 1000);
}

const renderComponent = ({ userId }) =>
  render (
    <MemoryRouter initialEntries={['/metabconcs/ATP/escherichia coli']}>
      <Route path="/metabconcs/:molecule/:organism/:abstract?/">
       <Provider store={store}>
        <Metabconcs />
        </Provider>
      </Route>
    </MemoryRouter>
  );


it('render metabconcs page', async () => {
  // Render new instance in every test to prevent leaking state
  const { getByTestId, getByText, getAllByText, getByPlaceholderText  } =  renderComponent({ userId: 'ATP' });

  await waitForElement(() => getByText('9640', { exact: false }));
  getAllByText('Escherichia coli K12 NCM3722', { exact: false })
  getAllByText('Saccharomyces cerevisiae', { exact: false })

  //click on get consensus
  fireEvent.click(getByText('Get Consensus'))

  //make sure that the mean is present (mean should be 3,002.643)
  expect(getAllByText('3,002', { exact: false }))
  expect(getAllByText('.643', { exact: false }))
  //getAllByLabelText("input")
  console.log(getByTestId('test_table'))

  let node = getByPlaceholderText('Enter Organism...')
  fireEvent.change(node, { target: { value: "escherichia" } })
  await timerGame()
  //fireEvent.keyPress(node, { key: 'Enter', code: 13 })
  jest.runAllTimers();
  fireEvent.click(getByText('Update Consensus'))
  await timerGame()
  jest.runAllTimers()
  expect(getAllByText('4,755', { exact: false }))

  ///fireEvent.click(findAllByRole("checkbox")[1])
  //fireEvent.click(getByText('Update Consensus'))
  //expect(getAllByText('2,914', { exact: false }))
  //expect(getAllByText('.385', { exact: false }))

  //make sure we can un-select an entry, and then update the consensus


});



