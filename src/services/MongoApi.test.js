import { getSearchData, getSearchObject } from '~/services/MongoApi';

test.skip('runs', () => {
  let result = getSearchData(['ATP', 'Escherichia coli']);
  console.log(result);
  return result.then(response => {
    expect(response.data).toBeTruthy;
    expect(response.status).toBe(200);
  });
});

test.skip('Fails on bad search', () => {
  return getSearchData(['ATPa', 'Escherichia coli']).then(response => {
    expect(response.data).toBeFalsey;
    expect(response.status).toBe(500);
  });
});

test.skip('Fails on missing page', () => {
  return getSearchData(['ATP']).then(response => {
    expect(response.data).toBeFalsey;
    expect(response.status).toBe(404);
  });
});

test.skip('fake test', () => {
  getSearchObject(['ATP', 'Escherichia coli']);
  expect(true).toBeTruthy;
});
