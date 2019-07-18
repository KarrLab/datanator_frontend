import React, { Component } from "react";
import "./Home.css";
import {Layout} from "antd";
import {TopBar} from "~/components/TopBar/TopBar";
import {BottomBar} from "~/components/BottomBar/BottomBar";
import {SideBar} from "~/components/SideBar/SideBar";
import {Main} from "~/components/Main/Main";

class Home extends Component {
    constructor(props) {
    
        super(props);

        this.state = {
        };
    }
 
    render() {

        return (
            <Layout className="page">
                <TopBar className="header"/> 
                <Layout>
                    <SideBar className="sider"/>
                    <Layout className="main">
                        <Main className="content"/>
                    </Layout>
                </Layout>
                <BottomBar className="footer"/>
            </Layout>
        
          
        );
    }
      
}

export {Home};