import axios from "axios";

//const rootSearchURL = process.env.REACT_APP_DATANATOR_REST_SERVER;
const rootSearchURL = "https://api.datanator.info/";

function getSearchData(urlParams) {
  let searchUrl = rootSearchURL + urlParams.join("/");
  return axios.get(searchUrl);
}

export { getSearchData };
