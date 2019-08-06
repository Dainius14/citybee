import React from 'react';
import { observer, inject } from 'mobx-react';
import { VehicleStore } from '../stores/vehicleStore';

interface IProps {
    vehicleStore?: VehicleStore
}

@inject('vehicleStore')
@observer
export default class SideMenu extends React.Component<IProps> {
    render() {
        const vehicleStore = this.props.vehicleStore!;
        return (
            <>
                car count: {vehicleStore.vehicleDetails.length}
            </>
        );
    }
}