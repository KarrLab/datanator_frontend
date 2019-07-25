import {getSearchData} from "~/services/MongoApi";
import { returnStatement } from "@babel/types";
import axios from 'axios'
/* This dispatch requires the Promises middleware, imported in Store.js*/
function getData() {
    let urlParams= ["organisms"];
    const rootSearchURL="http://rest.datanator.info:5000";
    let searchUrl= rootSearchURL+"/results/" +urlParams.join("/");

    return( function (dispatch){
        dispatch({
            type:"FETCH_ORGANISMS",
            payload: axios.get(searchUrl)
        });
    });}
    
export{getData}; 
