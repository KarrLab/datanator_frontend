import React, { Component } from "react";
//import styles from "./Home.scss";
import {H1, H2, H3, H4, H5, H6, OL, UL} from "@blueprintjs/core";
import {Default} from "~/Layouts/Default/Default";
import {SearchField} from "~/components/SearchField";
import { withRouter } from "react-router";

class Search extends Component {
    constructor(props) {
    
        super(props);

        this.state = {
        };
    } 
 
    render() {
        const content =  
        <div>
            <SearchField/>
        </div>
        ;

        return (
            <div className="main"> 
            <Default content ={content}/>
            </div>);
    }
      
}

export default withRouter(Search);