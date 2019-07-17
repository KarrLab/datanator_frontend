import React, { Component } from "react";
import "./Home.scss";
import {Layout} from "antd";
import {TopBar} from "~/components/TopBar/TopBar";
import {BottomBar} from "~/components/BottomBar/BottomBar";
import {SideBar} from "~/components/SideBar/SideBar";
import {Main} from "~/components/Main/Main";
import {Header} from "~/components/Layout/Header/Header";

class Home extends Component {
    constructor(props) {
    
        super(props);

        this.state = {
        };
    }
 
    render() {

        return (
            <div>
                <Header className="header" />
                <body className="main">
                <p>This is a test paragraph1 </p>
                <p>This is a test paragraph11 </p>
                <p>This is a test paragraph1111 </p>
                <p>This is a test paragraph11111 </p>
                <p>This is a test paragraph111111 </p>
                <p>This is a test paragraph1111111 </p>
                <p>This is a test paragraph11111111 </p>
                </body>
            </div>
        );
    }
      
}

export {Home};