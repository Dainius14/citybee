import React from 'react';
import { observer, inject } from 'mobx-react';
import { Statistic, Row, Col } from 'antd';

import { VehicleStore } from '../stores/vehicleStore';
import { UiState } from '../stores/uiState';


interface IProps {
    vehicleStore?: VehicleStore,
    uiState?: UiState
}

@inject('vehicleStore')
@inject('uiState')
@observer
export default class SideMenu extends React.Component<IProps> {
    render() {
        const vehicleStore = this.props.vehicleStore!;
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <Statistic title="Available cars" value={vehicleStore.availableCarsCount} suffix={`/ ${vehicleStore.totalCarsCount}`}/>
                        <Statistic title="Available scooters" value={vehicleStore.availableScootersCount} suffix={`/ ${vehicleStore.totalScootersCount}`}/>
                    </Col>
                    <Col span={12}>
                        <Statistic title="Visible cars" value={vehicleStore.visibleCarsCount}/>
                        <Statistic title="Visible scooters" value={vehicleStore.visibleScootersCount}/>
                    </Col>
                </Row>

            </div>
        );
    }
}
