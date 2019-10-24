import React from 'react';
import { render } from '@testing-library/react';
import { ReactReduxContext } from 'react-redux'
import { Provider } from 'react-redux'
import { Consensus } from '~/components/Results/Consensus.js';
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

f_concentrations.push({
              name: "ATP",
              concentration:  parseFloat(2),
              units: "mM",
            })

f_concentrations.push({
              name: "ATP",
              concentration: parseFloat(4),
              units: "mM",

            });

f_concentrations.push({
              name: "ATP",
              concentration: parseFloat(8),
              units: "mM",
            });

store.dispatch(setTotalData(f_concentrations))



test('hello world', async () => {
  const { getByText, getByTitle, getByPlaceholderText, getByTestId, toHaveTextContent, container, getByLabelText, getAllByText, queryByText } = render(
    <Provider store={store}>
    <ResultsTable  
      basic_columns={[
                'concentration',
                'error',
              ]}
              advanced_columns={[]}
              potential_columns={{}}
      />
      <Consensus relevantColumn={'concentration'} />
  </Provider>
  )
  
  //test on of the basic columns to see if its present
  fireEvent.click(getByText('Get Consensus'))
  expect(getByText('.667'))

  //expect(getByText('escherichia')).toBeTruthy();
});