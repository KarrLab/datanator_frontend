// Thrid Party Libraries
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
//import { BrowserHistory} from "~/../node_modules/react-router-dom/lib/BrowserHistory";

//Styles for @Blueprint JS
import "./index.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/@blueprintjs/select/lib/css/blueprint-select.css";
import "../node_modules/@blueprintjs/table/lib/css/table.css";
import "../node_modules/@blueprintjs/core/lib/scss/variables.scss";

//Website pages (scenes) 
import {Home} from "~/scenes/Home/Home";
import HomeOld from "~/scenes/Home/HomeOld";
import Search from "~/scenes/Search/Search";
import Metabconcs from "~/scenes/Results/Metabconcs";



function SiteRouter(){
    return(
        <Router> 
            <Route path="/" exact component={Home}/>
            <Route path="/search/"component={Search}/>
            <Route path="/old" component={HomeOld}/>
            <Route path="/metabconcs/:molecule/:organism/:abstract?/"component={Metabconcs}/>
        </Router>
    );
}

ReactDOM.render(<SiteRouter/>,document.getElementById("root"));    