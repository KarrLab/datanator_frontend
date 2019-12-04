import React from 'react';
import { render, } from '@testing-library/react';
import { Provider } from 'react-redux'
import {Route, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import GeneralPage from '~/scenes/Results/GeneralPage';
import { MemoryRouter } from "react-router-dom";
import createStore from '~/data/Store.js'

import {fireEvent, waitForElement } from '@testing-library/react'

jest.useFakeTimers();



let the_json = ""


const store = createStore

const renderComponent = (query, organism) =>
  render (
    <MemoryRouter initialEntries={['/general/?q=' + query + "&organism="+ organism]}>
      <Route path="/general/">
       <Provider store={store}>
        <GeneralPage />
        </Provider>
      </Route>
    </MemoryRouter>
  );


it('query general search', async () => {
  // Render new instance in every test to prevent leaking state
  let query = 'glucose'  
  let organism = 'homo sapiens'
  const { getByTestId, getByText, getAllByText, getByPlaceholderText  } =  renderComponent(query, organism)
  //let description = "Alpha-D-Glucose is a primary source of energy for living organisms."
  //await waitForElement(() => getByText(description, { exact: false }));
  await waitForElement(() => getByText('Glucose uptake protein', { exact: false }));

  //expect(getByText('Hydroxycinnamate 4-beta-glucosyltransferase', { exact: false })) //primary text for reaction
  //expect(getByText('UDPglucose + Cinnamic acid -> UDP + Cinnamoyl-beta-1-D-glucose', { exact: false })) //secondary text for reaction
  //let node = getByText('Hydroxycinnamate 4-beta-glucosyltransferase', { exact: false })
  //expect(document.querySelector("a").getAttribute("href")).toBe('/reaction/data/?substrates_inchi=Cinnamic%20acid,UDPglucose&products_inchi=Cinnamoyl-beta-1-D-glucose,UDP')

    //.to.equal('/reaction/data/?substrates_inchi=Cinnamic%20acid,UDPglucose&products_inchi=Cinnamoyl-beta-1-D-glucose,UDP') 

  expect(getByText('Glucose uptake protein', { exact: false }))
  expect(getByText('Kegg ID: K05340', { exact: false }))

});



//get back to this one! It should have more than one result for metabolite
it.skip('query general search', async () => {
  // Render new instance in every test to prevent leaking state
  let query = 'atp'  
  let organism = 'escherichia coli'
  const { getByTestId, getByText, getAllByText, getByPlaceholderText  } =  renderComponent(query, organism)
  let description = "Phosphoribosyl-ATP is involved in the histidine metabolism pathway and is a substrate for the phosphoribosyl pyrophosphate synthetase 1. [KEGG]"
  await waitForElement(() => getByText(description, { exact: false }));

  //expect(getByText('Diphosphomevalonate decarboxylase', { exact: false })) //primary text for reaction
  expect(getByText('ATP + Enzyme-Glutathionylspermidine complex -> Enzyme-ATP-Glutathionylspermidine complex', { exact: false })) //secondary text for reaction
  //let node = getByText('Hydroxycinnamate 4-beta-glucosyltransferase', { exact: false })
  //expect(document.querySelector("a").getAttribute("href")).toBe('/reaction/data/?substrates_inchi=Cinnamic%20acid,UDPglucose&products_inchi=Cinnamoyl-beta-1-D-glucose,UDP')

    //.to.equal('/reaction/data/?substrates_inchi=Cinnamic%20acid,UDPglucose&products_inchi=Cinnamoyl-beta-1-D-glucose,UDP') 


});

