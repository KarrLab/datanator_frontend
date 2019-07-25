import axios from 'axios';
const rootSearchURL = 'http://rest.datanator.info:5000';

function getSearchObject(urlParams) {
  const searchResult = getSearchData(urlParams);
  console.log(searchResult.status);
}

async function getSearchData(urlParams) {
  let searchUrl = rootSearchURL + '/results/' + urlParams.join('/');
  return await axios
    .get(searchUrl)
    .then(response => {
      let searchResult = {
        data: '',
        status: '',
      };
      searchResult.data = response.data;
      searchResult.status = response.status;
      return searchResult;
    })
    .catch(error => {
      let searchResult = {
        data: '',
        status: '',
      };
      searchResult.data = null;
      searchResult.status = error.response.status;
      return searchResult;
    });
}
export { getSearchData, getSearchObject };
