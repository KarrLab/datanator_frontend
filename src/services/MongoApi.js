import axios from 'axios';
const rootSearchURL = process.env.REACT_APP_DATANATOR_REST_SERVER;

function getSearchData(urlParams) {
  let searchUrl = rootSearchURL + '/results/' + urlParams.join('/');
  return axios.get(searchUrl);
}
export { getSearchData };
