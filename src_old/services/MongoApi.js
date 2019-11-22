import axios from 'axios';
// eslint-disable-next-line no-undef
//const rootSearchURL = process.env.REACT_APP_DATANATOR_REST_SERVER;
const rootSearchURL = "http://api.datanator.info/"
function getSearchData(urlParams) {
	console.log(rootSearchURL)
  let searchUrl = rootSearchURL + urlParams.join('/');
  console.log("here")
  console.log(searchUrl);
  console.log(axios.get(searchUrl))
  return axios.get(searchUrl);
}
export { getSearchData };
