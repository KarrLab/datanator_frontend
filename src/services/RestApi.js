import axios from "axios";

const rootSearchURL = process.env.REACT_APP_REST_SERVER;

function getDataFromApi(urlParams, options = {}) {
  let searchUrl = rootSearchURL + urlParams.join("/");
  return axios.get(searchUrl, options);
}

export { getDataFromApi };
