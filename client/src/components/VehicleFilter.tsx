import React from 'react';
import { Switch } from 'antd';
import { inject, observer } from 'mobx-react';
import { UiState } from '../stores/uiState';

interface IProps {
    uiState?: UiState
}

@inject('uiState')
@observer
export default class VehicleFilter extends React.Component<IProps> {
    render() {
        const uiState = this.props.uiState!;

        return (
            <div>
                <div>
                    Cars: <Switch checked={uiState.vehicleFilter.cars}
                                onChange={v => uiState.vehicleFilter.cars = v}></Switch>
                </div>
                <div>
                    Scooters: <Switch checked={uiState.vehicleFilter.scooters}
                                onChange={v => uiState.vehicleFilter.scooters = v}></Switch>
                </div>
                <div>
                    Bicycles: <Switch checked={uiState.vehicleFilter.bicycles} disabled
                                onChange={v => uiState.vehicleFilter.bicycles = v}></Switch>
                </div>
            </div>
        );
    }
}