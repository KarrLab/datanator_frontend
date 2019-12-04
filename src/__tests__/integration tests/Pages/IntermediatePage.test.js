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
  let description = "Alpha-D-Glucose is a primary source of energy for living organisms."
  await waitForElement(() => getByText(description, { exact: false }));
  await waitForElement(() => getByText('Hydroxycinnamate 4-beta-glucosyltransferase', { exact: false }));

  expect(getByText('Hydroxycinnamate 4-beta-glucosyltransferase', { exact: false })) //primary text for reaction
  expect(getByText('UDPglucose + Cinnamic acid -> UDP + Cinnamoyl-beta-1-D-glucose', { exact: false })) //secondary text for reaction
  //let node = getByText('Hydroxycinnamate 4-beta-glucosyltransferase', { exact: false })
  //expect(document.querySelector("a").getAttribute("href")).toBe('/reaction/data/?substrates_inchi=Cinnamic%20acid,UDPglucose&products_inchi=Cinnamoyl-beta-1-D-glucose,UDP')

    //.to.equal('/reaction/data/?substrates_inchi=Cinnamic%20acid,UDPglucose&products_inchi=Cinnamoyl-beta-1-D-glucose,UDP') 

  expect(getByText('Glucose uptake protein', { exact: false }))
  expect(getByText('Kegg ID: K05340', { exact: false }))

  expect(getByText('Glucose uptake protein', { exact: false }))
  expect(getByText('Kegg ID: K05340', { exact: false }))

});



//get back to this one! It should have more than one result for metabolite
it('query general search', async () => {
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


/*
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
*/