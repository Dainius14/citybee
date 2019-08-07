import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';

import CarMap from './components/CarMap';
import SideMenu from './components/SideMenu';
import VehicleFilter from './components/VehicleFilter';
import CarFilter from './components/CarFilter';

const { Content, Sider } = Layout;


class App extends Component {
  render() {
    return (
      <Layout style={{ height: '100%' }}>
         <Sider width={300} style={{ background: 'white', padding: 16, boxShadow: '0px 0px 40px 0px rgba(0,0,0,0.3)', zIndex: 1}}>
           <SideMenu></SideMenu>
           <br/>
           <VehicleFilter></VehicleFilter>
           <br/>
           <CarFilter></CarFilter>
         </Sider>
         <Content>
            <CarMap/>
         </Content>
      </Layout>
    );
  }
}

export default App;
