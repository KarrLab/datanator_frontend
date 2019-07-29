import { getSearchData } from '~/services/MongoApi';

/* This dispatch requires the Promises middleware, imported in Store.js*/
function getData() {
  let urlParams = ['organisms/list-all'];
  return function(dispatch) {
    dispatch({
      type: 'FETCH_ORGANISMS',
      payload: getSearchData(urlParams),
    });
  };
}

export { getData };
