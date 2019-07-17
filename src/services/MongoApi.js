import axios from "axios";
const rootSearchURL="http://rest.datanator.info:5000";

function getSearchData(urlParams){
    let searchResults;
    let searchUrl= rootSearchURL+"/results/" +urlParams.join("/");
    axios.get(searchUrl)
        .then((response) => {
            searchResults=response.data;})
        .catch((error) => {
            searchResults=null
            console.error("Error code:" + error.response.status);
        })
        .finally (() => {
            return searchResults;
        });

}
export {getSearchData};
