import React from 'react';
import { render, } from '@testing-library/react';
import { Provider } from 'react-redux'
import {Route, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import ProteinPage from '~/scenes/Results/ProteinPage';
import { MemoryRouter } from "react-router-dom";
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

});


it('filter and update consensus', async () => {
  // Render new instance in every test to prevent leaking state
  const {getByText, getAllByText, getByPlaceholderText  } =  renderComponent('uniprot', 'P01112', false);

  await waitForElement(() => getByText('K02833', { exact: false }));

  //click on get consensus
  fireEvent.click(getByText('Get Consensus'))

  //make sure that the mean is present (mean should be 3,002.643)
  expect(getAllByText('.419', { exact: false }))

  let node = getByPlaceholderText('Enter Organ...')
  fireEvent.change(node, { target: { value: "liver" } })

  jest.runAllTimers();
  fireEvent.click(getByText('Update Consensus'))
  jest.runAllTimers()
  expect(getAllByText('.745', { exact: false }))

});



it('render protein name search', async () => {
  // Render new instance in every test to prevent leaking state
  const {getByText, getAllByText, getByPlaceholderText  } =  renderComponent('name', 'phosphofructokinase', false);
  jest.runAllTimers();

  await waitForElement(() => getByText('F4JGR5 (A.thaliana)', { exact: false }));
  await waitForElement(() => getByText('6-phosphofructo-2-kinase', { exact: false }));
  await waitForElement(() => getByText("P0AEW9 (E.coli)", { exact: false }));
  expect(getByText("6-phosphofructo-2-kinase", { exact: false }))
  expect(getByText("1-phosphofructokinase", { exact: false }))
  expect(getByText("P0AEW9 (E.coli)", { exact: false }))

"6-phosphofructo-2-kinase"
"1-phosphofructokinase"
"P0AEW9 (E.coli) ,"
});



it('test no results found', async () => {
  window.alert = jest.fn();
  const {getByText} =  renderComponent('uniprot', 'fake_id_for_the_win', false);
  await waitForElement(() => getByText('Please try', { exact: false }))
  expect(window.alert).toHaveBeenCalled()

})

it('test alert where results found', async () => {
  //const { location } = window;
  
  //const { location } = window;
  window.alert = jest.fn();
  const {getByText} =  renderComponent('uniprot', 'P01112', false);
  await waitForElement(() => getByText('K02833', { exact: false }))
  //jest.runAllTimers();
  expect(window.alert).not.toHaveBeenCalled()

})