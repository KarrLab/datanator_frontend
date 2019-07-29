import axios from 'axios';
// eslint-disable-next-line no-undef
const rootSearchURL = process.env.REACT_APP_DATANATOR_REST_SERVER;

function getSearchData(urlParams) {
  let searchUrl = rootSearchURL + urlParams.join('/');
  console.log(searchUrl);
  return axios.get(searchUrl);
}
export { getSearchData };
