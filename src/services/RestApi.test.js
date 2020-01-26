import { getDataFromApi, getSearchObject } from '~/services/RestApi';

test.skip('runs', () => {
  let result = getDataFromApi(['ATP', 'Escherichia coli']);
  console.log(result);
  return result.then(response => {
    expect(response.data).toBeTruthy;
    expect(response.status).toBe(200);
  });
});

test.skip('Fails on bad search', () => {
  return getDataFromApi(['ATPa', 'Escherichia coli']).then(response => {
    expect(response.data).toBeFalsey;
    expect(response.status).toBe(500);
  });
});

test.skip('Fails on missing page', () => {
  return getDataFromApi(['ATP']).then(response => {
    expect(response.data).toBeFalsey;
    expect(response.status).toBe(404);
  });
});

test.skip('fake test', () => {
  getSearchObject(['ATP', 'Escherichia coli']);
  expect(true).toBeTruthy;
});
