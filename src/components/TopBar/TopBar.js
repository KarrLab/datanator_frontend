import React from "react";
import logo from "~/logo.svg";
import {SideButton} from "~/components/SideButton/SideButton";
import "./TopBar.css";
import {Layout, Menu} from 'antd';
const {Header} = Layout;

function TopBar(props) {
    return (
        <Header className="header">
            <div className="logo"> <a href="/"> <img src={logo} className= "logo-image" alt="Datanator Logo"/> </a> </div>
            <div className="logo-menu-spacer"> </div>
            <Menu className="header-menu"
                theme="dark"
                mode="horizontal"
            
            >
                <Menu.Item key="1">Home</Menu.Item>
                <Menu.Item key="2">About</Menu.Item>
                <Menu.Item key="3">Search</Menu.Item>
            </Menu>
        </Header>
    );
}
export {TopBar}; 