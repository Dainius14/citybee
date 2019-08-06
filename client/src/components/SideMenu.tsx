import React from 'react';
import { observer, inject } from 'mobx-react';
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
        const uiState = this.props.uiState!;
        return (
            <div>
                <div>vehicle count: {vehicleStore.vehicleDetails.length}</div>
                <div>available vehicles: {vehicleStore.availableVehicles.length}</div>
                <div>visible vehicles: {vehicleStore.visibleVehicles.length}</div>
                <div>lat: {uiState.map.latMin} ~ {uiState.map.latMax}</div>
                <div>long: {uiState.map.lngMin} ~ {uiState.map.lngMax}</div>
            </div>
        );
    }
}
