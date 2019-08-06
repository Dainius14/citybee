import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';

import CarMap from './components/CarMap';
import SideMenu from './components/SideMenu';

const { Content, Sider } = Layout;


class App extends Component {
  render() {
    return (
      <Layout style={{ height: '100%' }}>
         <Sider width={300} style={{ background: 'white' }}>
           <SideMenu></SideMenu>
         </Sider>
         <Content>
           
            <CarMap/>
         </Content>
      </Layout>
    );
  }
}

export default App;
