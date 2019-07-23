import {GetSearchData} from "~/services/MongoApi";
import { returnStatement } from "@babel/types";

/* This dispatch requires the Promises middleware, imported in Store.js*/
function getData() {
    return( (dispatch)=>{
        dispatch({
            type:"FETCH_ORGANISMS",
            payload:{GetSearchData(urlParams=["/organisms"])}})
        });
    };
    
export{getData}
