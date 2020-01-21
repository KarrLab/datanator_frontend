import React from 'react';
import { render } from '@testing-library/react';
import { ReactReduxContext } from 'react-redux'
import { Provider } from 'react-redux'

import { ResultsTable, getSelectedData } from '~/components/Results/ResultsTable.js';
import createStore from '~/data/Store.js'
import {
  getTotalColumns,
  filterLaxon,
  setLineage,
  setTotalData,
} from '~/data/actions/resultsAction';

import axiosMock from 'axios'
import { fireEvent, waitForElement } from '@testing-library/react'

const store = createStore

let f_concentrations = []

store.dispatch(setLineage(["kingdom", "genus", "species"]))
