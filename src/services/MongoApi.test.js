import { getSearchData, getSearchObject } from '~/services/MongoApi';
test('runs', () => {
  let result = getSearchData(['ATP', 'Escherichia coli']);
  console.log(result);
  return result.then(response => {
    expect(response.data).toBeTruthy;
    expect(response.status).toBe(200);
  });
});

test('Fails on bad search', () => {
  return getSearchData(['ATPa', 'Escherichia coli']).then(response => {
    expect(response.data).toBeFalsey;
    expect(response.status).toBe(500);
  });
});

test('Fails on missing page', () => {
  return getSearchData(['ATP']).then(response => {
    expect(response.data).toBeFalsey;
    expect(response.status).toBe(404);
  });
});
test('fake test', () => {
  getSearchObject(['ATP', 'Escherichia coli']);
  expect(true).toBeTruthy;
});
