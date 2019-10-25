import React from 'react';
import { render } from '@testing-library/react';
import { ReactReduxContext } from 'react-redux'
import { Provider } from 'react-redux'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

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
function timerGame(callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback && callback();
  }, 1000);
}

let the_json = ""

jest.useFakeTimers();

const store = createStore
let orig_json = null

jest.runAllTimers();


  



test('hello world', async () => {

  await getSearchData([
  'metabolites/concentration/?abstract=' + false + '&species='
  + 'escherichia coli' + '&metabolite=' + 'ATP'
]).then(response => { orig_json = response.data }).then(orig_json => {console.log(orig_json)});

  const history = createMemoryHistory()
  const { getByText, getByPlaceholderText, getByTestId, toHaveTextContent, container, getByLabelText, getAllByText, queryByText } = render(
  	<Router history={history}>
    <Provider store={store}>
    
    	<ConcentrationsTable
            json_data={orig_json}
          />
  </Provider>
  </Router>
  )
  
  //test on of the basic columns to see if its present
  expect(getAllByText('Escherichia coli K-12', { exact: false })[0].textContent).toBe('Escherichia coli K-12')
  expect(getAllByText('Saccharomyces cerevisiae', { exact: false })[0].textContent)
  



  //expect(getByText('escherichia')).toBeTruthy();
});