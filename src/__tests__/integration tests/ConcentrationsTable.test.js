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
import { fireEvent, waitForElement } from '@testing-library/react'


'use strict';
function timerGame(callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback && callback();
  }, 1000);
}

jest.useFakeTimers();

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
              growth_media: "blue media",
              taxonomic_proximity: 1,
              tanitomo_similarity: 0.9,
            });

store.dispatch(setTotalData(f_concentrations))

test('hello world', async () => {
  const { getByText, getByPlaceholderText, getByTestId, toHaveTextContent, container, getByLabelText, getAllByText, queryByText } = render(
  	<Provider store={store}>
    	<ConcentrationsTable
            json_data={this.state.orig_json}
            handleAbstract={this.getAbstractSearch}
          />
  </Provider>
  )
  
  //test on of the basic columns to see if its present




  //expect(getByText('escherichia')).toBeTruthy();
});