import React from 'react';
import { render, } from '@testing-library/react';
import { Provider } from 'react-redux'
import {Route, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import ProteinPage from '~/scenes/Results/ProteinPage';
import { MemoryRouter } from "react-router-dom";
import { ResultsTable, getSelectedData } from '~/components/Results/ResultsTable.js';
import createStore from '~/data/Store.js'

import {fireEvent, waitForElement } from '@testing-library/react'

jest.useFakeTimers();



let the_json = ""


const store = createStore

const renderComponent = (searchType, molecule) =>
  render (
    <MemoryRouter initialEntries={['/protein/' + searchType + '/' + molecule ]}>
      <Route path="/protein/:searchType/:molecule">
       <Provider store={store}>
        <ProteinPage />
        </Provider>
      </Route>
    </MemoryRouter>
  );


it('render protein page', async () => {
  // Render new instance in every test to prevent leaking state
  const { getByTestId, getByText, getAllByText, getByPlaceholderText  } =  renderComponent('uniprot', 'P01112');

  await waitForElement(() => getByText('K02833', { exact: false }));
  //expect(getByTestId('test_table'))
  //expect(getAllByText('Escherichia coli K12 NCM3722', { exact: false }))
  //expect(getAllByText('Saccharomyces cerevisiae', { exact: false }))

});

