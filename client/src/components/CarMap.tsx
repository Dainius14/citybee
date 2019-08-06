import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { inject, observer } from 'mobx-react';

import CarMapIcon from './CarMapIcon';
import { Car } from '../types';
import { VehicleStore } from '../stores/vehicleStore';

interface IState {
  map: {
    currentZoom: number;
    latMin: number;
    latMax: number;
    lngMin: number;
    lngMax: number;
  };
}

interface IProps {
  vehicleStore?: VehicleStore,
  center: {
    lat: number,
    lng: number
  },
  zoom: number
}

@inject('vehicleStore')
@observer
export default class CarMap extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      map: {
        currentZoom: 0,
        latMin: 0,
        latMax: 0,
        lngMin: 0,
        lngMax: 0
      }
    };

    Notification.requestPermission().then(result => {
      console.log('Notification permission', result);
    });
  }

  static defaultProps = {
    center: {
      lat: 54.8985,
      lng: 23.9036
    },
    zoom: 14
  };




  handleOnChange = (e: any) => {
    this.setState({
      map: {
        currentZoom: e.zoom,
        latMin: e.bounds.sw.lat,
        latMax: e.bounds.nw.lat,
        lngMin: e.bounds.nw.lng,
        lngMax: e.bounds.se.lng
      }
    });
    //this.updateSidebarData();
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

  isCarInVisibleArea = (car: Car) => {
    const map = this.state.map;
    return car.lat >= map.latMin && car.lat <= map.latMax
      && car.long >= map.lngMin && car.long <= map.lngMax;
  }


  render() {
    const store = this.props.vehicleStore!;
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
      
            {store.availableVehicles.map((car: Car) => {
              if (this.isCarInVisibleArea(car)) {
                return (
                  <CarMapIcon key={car.id.toString()}
                    lat={car.lat} lng={car.long}
                    zoom={this.state.map.currentZoom}
                    car={car} />);
              }
              else 
                return null;
            })}
        </GoogleMapReact>

      </div>
    );


  }
}
