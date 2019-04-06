import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import CarMapIcon from './CarMapIcon';
import { Car, CarDetails } from '../types';
import { getAvailableCars, getCarsDetails } from '../CityBeeAPI';

interface State {
  carsDetails: Array<CarDetails>;
  prevAvailableCars: Array<Car>;
  availableCars: Array<Car>;
  map: {
    currentZoom: number;
    latMin: number;
    latMax: number;
    lngMin: number;
    lngMax: number;
  };
}

export default class CarMap extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      carsDetails: [],
      prevAvailableCars: [],
      availableCars: [],
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


  async setCarsDetails(): Promise<void> {
    const carsDetails = await getCarsDetails();
    this.setState({ carsDetails: carsDetails });
    console.log('Cars details', carsDetails);
  }

  async setAvailableCars(): Promise<void> {
    const availableCars = await getAvailableCars();
    // Not using map(), because need to break out of the loop
    const availableCardWDetails: Array<Car> = [];
    for (let i in availableCars) {
      const car = availableCars[i];
      const carDetails = this.state.carsDetails.find(x => x.id == car.id);
      // If no car details available, it means there's a new car released,
      // but the details for it have not yet been downloaded
      if (!carDetails) {
        console.log(`Car ${car.id} has no details. Getting new cars details...`);
        await this.setCarsDetails();
        return this.setAvailableCars();
      }
      availableCardWDetails.push({ ...car, details: carDetails });
    }
    this.setState({ prevAvailableCars: this.state.availableCars, availableCars: availableCardWDetails });
    console.log('Available cars', availableCardWDetails);
  }

  startResfreshingCars(): void {
    
    setInterval(async () => {
      await this.setAvailableCars();
      
      const newAvailableCars = this.state.availableCars.filter((x: Car) => !this.state.prevAvailableCars.some((y: Car) => y.id == x.id));
      const takenCars = this.state.prevAvailableCars.filter((x: Car) => !this.state.availableCars.some((y: Car) => y.id == x.id));
      
      console.log('New available cars', newAvailableCars);
      console.log('Taken cars', takenCars);
    }, 5000);
  }

  async componentDidMount() {
    await this.setCarsDetails();
    await this.setAvailableCars();
    this.startResfreshingCars();
  }

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
      
            {this.state.availableCars.map((car: Car) => {
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
