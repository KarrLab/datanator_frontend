import React, { Component } from "react";
import styles from "./Home.css";
import {H1, H2, H3, H4, H5, H6, OL, UL} from "@blueprintjs/core"
import {Default} from "~/Layouts/Default/Default"
class Home extends Component {
    constructor(props) {
    
        super(props);

        this.state = {
        };
    } 
 
    render() {
        const content =  
        <div>
            <H1> Welcome to Datanator </H1>
            <p>Datanator is a tool for discovering the data needed to build, calibrate, and validate biological models. Datanator is composed of an integrated database of experimental data for whole-cell modeling and tools for identifying relevant data for modeling a specific organism and environmental condition. Datanator has a web-based graphical interface, a REST API, a Python API, and a command line interface.</p>
            
            <H2> Usage</H2>
            <p> Datanator can be used to gather biological data from a wide range of databases</p>
            <H2> About</H2>
            <p> Datanator was created by the Karr Lab</p>
            <H2> Whole Cell Modeling</H2>
            <p> Datantor was built for the particular usecase of Whole Cell Modeling. To learn more visit the <a href="https://www.wholecell.org"> Whole Cell Website </a></p>
        </div>
        ;

        return (
            <div className="main"> 
            <Default content ={content}/>
            </div>);
    }
      
}

export {Home};