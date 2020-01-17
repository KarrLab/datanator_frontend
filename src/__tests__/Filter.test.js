import React from 'react';
import { render } from '@testing-library/react';
import { ReactReduxContext } from 'react-redux'
import { Provider } from 'react-redux'
import { TaxonFilter } from '~/components/Results/Filters/TaxonFilter';

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



const store = createStore

let f_concentrations = []

store.dispatch(set_lineage(["kingdom", "genus", "species"]))


test.skip('hello world', async () => {
  const { getByText, getByPlaceholderText, getByTestId, toHaveTextContent, container, getByLabelText, getAllByText, queryByText } = render(
  	<Provider store={store}>
    	<TaxonFilter />
  </Provider>
  )
  
  //test on of the basic columns to see if its present
  const button = getByText("0")
  fireEvent.mouseOver(button)
  expect(button).toHaveTextContent("kingdom");
  expect(getAllByText('escherichia', { exact: false })[0].textContent).toBe('escherichia coli')



  //expect(getByText('escherichia')).toBeTruthy();
});