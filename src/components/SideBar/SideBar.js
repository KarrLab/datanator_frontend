import React from "react";
import{Layout, Menu} from "antd";
import {SideMenu} from "./SideMenu/SideMenu";
import "./SideBar.css";

const{Sider}= Layout;

const  SideBar = (props) => {
    return(
        <Sider className="sider"
            breakpoint="lg"
            collapsedWidth="0">
            <SideMenu/>
        </Sider>
    );
};
export {SideBar};
