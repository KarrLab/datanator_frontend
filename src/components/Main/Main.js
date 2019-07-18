import React from "react";
import {Layout } from "antd";
const {Content} = Layout;
function Main(props){
    return(        
        <Content className="content">
            <h1> This is a sample Heading</h1>
            <p> This is a sample paragraph</p>
        </Content>
    );
}
export{Main};