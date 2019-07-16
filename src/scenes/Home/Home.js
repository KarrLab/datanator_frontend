import React, { Component } from 'react'
import './Home.css';
import {Logo} from '~/components/Logo/Logo'
import {Layout} from 'antd';
//import 'antd/dist/antd.css'


class Home extends Component {
  constructor(props) {
    
      super(props)

      this.state = {
      }
  }
 
  render() {
    const { Header, Footer, Sider, Content } = Layout;

    return (
    <div>
    <Layout className="Page">
        <Header className="Header">
          {<Logo/>}
        </Header>
      <Layout>
      <Sider className="Sider">
        Side 
      </Sider>
        <Content className="Content">
        <h1>Content</h1>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        </Content>
      </Layout>
        
        <Footer className="Footer">
          Footer
          </Footer>
    </Layout>             
    </div>
          )
      }
      
  }

export {Home}