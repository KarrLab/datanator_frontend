import React from 'react';
import { render } from '@testing-library/react';
import { ReactReduxContext } from 'react-redux'
import { Provider } from 'react-redux'

import { ResultsTable, getSelectedData } from '~/components/Results/ResultsTable.js';
import createStore from '~/data/Store.js'
import {
  getTotalColumns,
  filter_taxon,
  set_lineage,
  setTotalData,
} from '~/data/actions/resultsAction';

import axiosMock from 'axios'

const store = createStore

let f_concentrations = []

f_concentrations.push({
              name: "ATP",
              concentration: "2",
              units: "mM",
              error: 3,
              growth_phase: "Log Phase",
              organism: "escherichia coli",
              growth_media: "gutnick",
              taxonomic_proximity: 3,
              tanitomo_similarity: 0.7,
            })

f_concentrations.push({
              name: "ATP",
              concentration: "4",
              units: "mM",
              error: 1,
              growth_phase: "Log Phase",
              organism: "escherichia coli",
              growth_media: "gutnick",
              taxonomic_proximity: 1,
              tanitomo_similarity: 0.9,
            });

store.dispatch(setTotalData(f_concentrations))

test('hello world', () => {
  const { getByText, getByTestId, container, toHaveTextContent, getByLabelText, getAllByText } = render(
  	<Provider store={store}>
    	<ResultsTable  
    	basic_columns={[
                'concentration',
                'error',
                'molecule',
                'organism',
                'taxonomic_proximity',
              ]}
              advanced_columns={[
                'growth_phase',
                'growth_conditions',
                'growth_media',
              ]}
              potential_columns={{'tanitomo':true}}
    	/>
  </Provider>
  )
  //expect(getByText(/escherichia/i)).toBeTruthy();
  //console.log(getAllByText("escherichia")[0].textContent)
  expect(getAllByText('escherichia', { exact: false })[0].textContent).toBe('escherichia coli')

  //expect(getByText('escherichia')).toBeTruthy();
});