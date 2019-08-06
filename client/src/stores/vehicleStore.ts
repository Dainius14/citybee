import { observable, action, reaction, computed } from 'mobx';

import { Car, CarDetails } from '../types';
import { getAvailableCars, getCarsDetails } from '../CityBeeAPI';
import { UiState } from './uiState';

// mobx.configure({ enforceActions: "observed" })

export class VehicleStore {
    private uiState: UiState;

    @observable
    vehicleDetails: Array<CarDetails> = [];

    @observable
    prevAvailableVehicles: Array<Car> = [];

    @observable
    availableVehicles: Array<Car> = [];


    @observable
    vehicleFilter: {
      cars: boolean,
      bicycles: boolean,
      scooters: boolean,
    } = {
        cars: true,
        bicycles: true,
        scooters: true,
    }

    constructor(uiState: UiState) {
        this.uiState = uiState;
        (async () => {
            await this.setCarsDetails();
            await this.setAvailableCars();
        })();
        
    }

    @action
    async setCarsDetails(): Promise<void> {
      const carsDetails = await getCarsDetails();
      this.vehicleDetails = carsDetails;
      console.log('Vehicle details', carsDetails);
    }
  
    @action
    async setAvailableCars(): Promise<void> {
      const availableCars = await getAvailableCars();
      // Not using map(), because need to break out of the loop
      const availableCardWDetails: Array<Car> = [];
      for (let i in availableCars) {
        const car = availableCars[i];
        const carDetails = this.vehicleDetails.find(x => x.id === car.id);
        // If no car details available, it means there's a new car released,
        // but the details for it have not yet been downloaded
        if (!carDetails) {
          console.log(`Car ${car.id} has no details. Getting new cars details...`);
          await this.setCarsDetails();
          return this.setAvailableCars();
        }
        availableCardWDetails.push({ ...car, details: carDetails });
      }
      this.prevAvailableVehicles = this.availableVehicles;
      this.availableVehicles = availableCardWDetails;
      console.log('Available cars', availableCardWDetails);
    }

    @computed
    get filteredVehicles() {
        return this.availableVehicles.filter(car => {
            let showVehicle = false;
            if (this.uiState.vehicleFilter.cars) {
                showVehicle = showVehicle || car.service_id !== 34;
            }
            if (this.uiState.vehicleFilter.scooters) {
                showVehicle = showVehicle || car.service_id === 34;
            }
            return showVehicle;
        })
    }

    @computed
    get visibleVehicles() {
        return this.filteredVehicles.filter(this.isCarInVisibleArea);
    }

    
    isCarInVisibleArea = (car: Car) => {
        const map = this.uiState!.map;
        return car.lat >= map.latMin && car.lat <= map.latMax
            && car.long >= map.lngMin && car.long <= map.lngMax;
    }

//   startResfreshingCars(): void {
    
//     setInterval(async () => {
//       await this.setAvailableCars();
      
//       const newAvailableCars = this.state.availableVehicles.filter((x: Car) => !this.state.prevAvailableVehicles.some((y: Car) => y.id == x.id));
//       const takenCars = this.state.prevAvailableVehicles.filter((x: Car) => !this.state.availableVehicles.some((y: Car) => y.id == x.id));
      
//       console.log('New available cars', newAvailableCars);
//       console.log('Taken cars', takenCars);
//     }, 5000);
//   }
}

