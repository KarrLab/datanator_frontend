import React from 'react';
import { render, cleanup, } from '@testing-library/react';
import { ReactReduxContext } from 'react-redux'
import { Provider } from 'react-redux'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import {BrowserRouter, Redirect } from 'react-router-dom'
import Metabconcs from '~/scenes/Results/Metabconcs';
import { MemoryRouter } from "react-router-dom";
import { ResultsTable, getSelectedData } from '~/components/Results/ResultsTable.js';
import createStore from '~/data/Store.js'
import {
  getTotalColumns,
  filter_taxon,
  set_lineage,
  setTotalData,
} from '~/data/actions/resultsAction';

import axiosMock from 'axios'
import { fireEvent, waitForElement } from '@testing-library/react'
import { getSearchData } from '~/services/MongoApi';
import ConcentrationsTable from '~/components/Results/ConcentrationsTable.js';


'use strict';


let the_json = ""

jest.useFakeTimers();

const store = createStore

jest.runAllTimers();

const history = createMemoryHistory()




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


it('renders initial user id', async () => {
  // Render new instance in every test to prevent leaking state
  const { getByText } =  renderComponent({ userId: 'ATP' });

  await waitForElement(() => getByText('9640', { exact: false }));
});

/*
test('landing on a bad page',  () => {
  const route = '/metabconcs/atp/Escherichia coli/'
  const match = { params: { molecule: 'ATP', organism: 'escherichia coli' } }
  const { getByTestId } = renderWithRouter(<Metabconcs match = {match}/>, { route })
  expect(getByTestId('location-display').textContent).toBe(route)
})
*/
/*
test('hello world', async () => {
  const redirectUrl = '/metabconcs/atp/Escherichia coli/'
  const match = { params: { molecule: 'ATP', organism: 'escherichia coli' } }
  const { getByText, getByPlaceholderText, getByTestId, toHaveTextContent, 
    container, getByLabelText, getAllByText, queryByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/metabconcs/atp/Escherichia coli/']}>
      <c match={match}/>
    </MemoryRouter>,
    root
  </Provider>
  )
  
  //test on of the basic columns to see if its present
  expect(getAllByText('Escherichia coli K-12', { exact: false })[0].textContent).toBe('Escherichia coli K-12')
  expect(getAllByText('Saccharomyces cerevisiae', { exact: false })[0].textContent)



  //expect(getByText('escherichia')).toBeTruthy();
});
*/