import { observable, action, reaction, computed } from 'mobx';

import { Car, CarDetails, VehicleTree } from '../types';
import { getAvailableCars, getCarsDetails } from '../CityBeeAPI';
import { UiState } from './uiState';
import Item from 'antd/lib/list/Item';

// mobx.configure({ enforceActions: "observed" })

export class VehicleStore {
    private uiState: UiState;

    @observable
    vehicleDetails: Array<CarDetails> = [];

    @observable
    vehicleTree: VehicleTree = {};

    @observable
    prevAvailableVehicles: Array<Car> = [];

    @observable
    availableVehicles: Array<Car> = [];

    constructor(uiState: UiState) {
        this.uiState = uiState;
        (async () => {
            await this.setCarsDetails();
            await this.setAvailableCars();
        })();

        setInterval(async () => {
            await this.setAvailableCars();
        }, 5000)
    }

    @action
    async setCarsDetails(): Promise<void> {
        const vehicleDetails = await getCarsDetails();
        this.vehicleDetails = vehicleDetails;
        console.log('Vehicle details', vehicleDetails);

        // Create vehicle Tree
        const tree = vehicleDetails.reduce((tree: VehicleTree, car) => {
            if (!tree[car.make]) {
                tree[car.make] = {};
            }
            if (!tree[car.make][car.model]) {
                tree[car.make][car.model] = {
                    count: 1,
                    service_ids: new Set([car.service_id])
                };
            }
            else {
                const item = tree[car.make][car.model];
                item.count++;
                item.service_ids.add(car.service_id);
            }

            return tree;
        }, {});

        this.vehicleTree = tree;
        console.log('Vehicle tree', tree);

        
        this.uiState.setCarFilter(tree);
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
            if (this.uiState.vehicleFilter.cars && car.service_id !== 34) {
                showVehicle = !!this.uiState.checkedCars.find(x => x === `${car.details.make}.${car.details.model}`);
            }
            if (this.uiState.vehicleFilter.scooters && car.service_id === 34) {
                showVehicle = true;
            }
            return showVehicle;
        })
    }

    
    @computed get totalCarsCount() { return this.vehicleDetails.filter(vehicle => vehicle.service_id !== 34).length; }
    @computed get totalScootersCount() { return this.vehicleDetails.filter(vehicle => vehicle.service_id === 34).length; }

    @computed
    get availableCars() {
        return this.availableVehicles.filter(vehicle => vehicle.service_id !== 34);
    }
    @computed get availableCarsCount() { return this.availableCars.length; }

    @computed
    get filteredCars() {
        return this.availableCars.filter(car => !!this.uiState.checkedCars.find(x => x === `${car.details.make}.${car.details.model}`));
    }

    @computed
    get visibleCars() {
        return this.uiState.vehicleFilter.cars ? this.filteredCars.filter(this.isVehicleInVisibleArea) : [];
    }

    @computed get visibleCarsCount() { return this.visibleCars.length; }


    @computed
    get availableScooters() {
        return this.availableVehicles.filter(vehicle => vehicle.service_id === 34);
    }
    @computed get availableScootersCount() { return this.availableScooters.length; }

    @computed
    get visibleScooters() {
        return this.uiState.vehicleFilter.scooters ? this.availableScooters.filter(this.isVehicleInVisibleArea) : [];
    }

    @computed get visibleScootersCount() { return this.visibleScooters.length; }


    @computed
    get visibleVehicles() {
        return [ ...this.visibleCars, ...this.visibleScooters];
    }



    isVehicleInVisibleArea = (car: Car) => {
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

