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
import { fireEvent } from '@testing-library/react'

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
  const { getByText, getByTestId, toHaveTextContent, container, getByLabelText, getAllByText, queryByText } = render(
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
  
  //test on of the basic columns to see if its present
  expect(getAllByText('escherichia', { exact: false })[0].textContent).toBe('escherichia coli')
  //ensure both rows show up
  expect(getAllByText('escherichia', { exact: false })[1].textContent).toBe('escherichia coli')

  //test the advance/basic button
  expect(getByText("Conc. (µM)"))
  expect(queryByText('Conditions')).toBeNull() // make sure the advance columns dont start out on the page

  //click on advanced columns button
  fireEvent.click(getByText('Advanced'))
  expect(queryByText('Conditions')).not.toBeNull()


  //expect(getByText('escherichia')).toBeTruthy();
});