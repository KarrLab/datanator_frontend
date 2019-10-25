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




let the_json = ""

//jest.useFakeTimers();

const store = createStore

//jest.runAllTimers();


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
  const { getByText, getAllByText } =  renderComponent({ userId: 'ATP' });

  await waitForElement(() => getByText('9640', { exact: false }));
  getAllByText('Escherichia coli K12 NCM3722', { exact: false })
  getAllByText('Saccharomyces cerevisiae', { exact: false })

  //click on get consensus
  fireEvent.click(getByText('Get Consensus'))

  //make sure that the mean is present (mean should be 3,002.643)
  expect(getAllByText('3,002', { exact: false }))
  expect(getAllByText('.643', { exact: false }))


});

