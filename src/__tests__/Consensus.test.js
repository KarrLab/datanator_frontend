import React from 'react';
import { render } from '@testing-library/react';
import { ReactReduxContext } from 'react-redux'
import { Provider } from 'react-redux'
import { Consensus } from '~/components/Results/Consensus.js';


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

f_concentrations.push({
              name: "ATP",
              concentration: "2",
              units: "mM",
            })

f_concentrations.push({
              name: "ATP",
              concentration: "4",
              units: "mM",

            });

f_concentrations.push({
              name: "ATP",
              concentration: "6",
              units: "mM",
            });

store.dispatch(setTotalData(f_concentrations))

test('hello world', async () => {
  const { getByText, getByPlaceholderText, getByTestId, toHaveTextContent, container, getByLabelText, getAllByText, queryByText } = render(
    <Provider store={store}>
      <Consensus relevantColumn={'concentration'} />
  </Provider>
  )
  
  //test on of the basic columns to see if its present
  
  expect(getAllByText('Mean', { exact: false })[0].textContent).toBe('4')

  //expect(getByText('escherichia')).toBeTruthy();
});