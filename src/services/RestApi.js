import axios from "axios";

const rootURL = process.env.REACT_APP_REST_SERVER;

function getDataFromApi(params, options = {}) {
  let url = rootURL + params.join("/");
  //console.log(url)
  return axios.get(url, options);
}

export { getDataFromApi };
