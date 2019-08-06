import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { inject, observer } from 'mobx-react';

import CarMapIcon from './CarMapIcon';
import { Car } from '../types';
import { VehicleStore } from '../stores/vehicleStore';
import { UiState } from '../stores/uiState';

interface IState {
}

interface IProps {
    vehicleStore?: VehicleStore,
    uiState?: UiState,
    center: {
        lat: number,
        lng: number
    },
    zoom: number
}

@inject('vehicleStore')
@inject('uiState')
@observer
export default class CarMap extends Component<IProps, IState> {
    static defaultProps = {
        center: {
            lat: 54.8985,
            lng: 23.9036
        },
        zoom: 14
    };




    handleOnChange = (e: any) => {
        const map = this.props.uiState!.map;
        map.currentZoom = e.zoom;
        map.latMin = e.bounds.sw.lat;
        map.latMax = e.bounds.nw.lat;
        map.lngMin = e.bounds.nw.lng;
        map.lngMax = e.bounds.se.lng;
    }

    /*
    handleOnChildClick = (key, childProps) => {
      let carState = this.state.carListStates[key];
      if (!carState)
        this.createCarListState(key);
  
      let carListStates = { ...this.state.carListStates };
      carListStates[key] = {
        isPopoverOpen: !carListStates[key].isPopoverOpen
      };
      this.setState({ carListStates: carListStates })
    }
    
    handleOnChildMouseEnter = (key, childProps) => {
    }
  
    handleOnChildMouseLeave = (key, childProps) => {
    }
  
    handleOnClick = (e) => {
    }*/



    render() {
        const vehicleStore = this.props.vehicleStore!;
        const uiState = this.props.uiState!;
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    onChange={this.handleOnChange}
                //onClick={this.handleOnClick}
                //onChildClick={this.handleOnChildClick}
                >

                    {vehicleStore.visibleVehicles.map((car: Car) => {
                        return (
                            <CarMapIcon key={car.id.toString()}
                                lat={car.lat} lng={car.long}
                                zoom={uiState.map.currentZoom}
                                car={car} />);
                        
                    })}
                </GoogleMapReact>

            </div>
        );


    }
}
