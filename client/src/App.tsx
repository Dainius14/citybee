import React, { Component } from 'react';
import {Layout, Row, Typography} from 'antd';
import 'antd/dist/antd.css';

import CarMap from './components/CarMap';
import SideMenu from './components/SideMenu';
import VehicleFilter from './components/VehicleFilter';
import CarFilter from './components/CarFilter';
import './LoadingDots.css';

const { Content, Sider } = Layout;
const { Text } = Typography;


class App extends Component {
  render() {
    return (
      <Layout style={{ height: '100%' }}>
         <Sider width={300} style={{ background: 'white', padding: 16, boxShadow: '0px 0px 40px 0px rgba(0,0,0,0.3)', zIndex: 1}}>
             <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                 <SideMenu/>

                 <VehicleFilter/>

                 <CarFilter/>

                 <Row style={{ marginTop: 'auto', width: '100%', textAlign: 'center'}}>
                     <Text type="secondary" className="update-text">
                         <i>Data updates every 5 seconds</i>
                         <span className="dot">.</span>
                         <span className="dot">.</span>
                         <span className="dot">.</span>
                     </Text>
                 </Row>

             </div>
         </Sider>
         <Content>
            <CarMap/>
         </Content>
      </Layout>
    );
  }
}

export default App;
