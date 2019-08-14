import { observable, action, reaction, computed } from 'mobx';

import { Car, CarDetails } from '../types';
import { getAvailableCars, getCarsDetails } from '../CityBeeAPI';
import { UiState } from './uiState';
import Item from 'antd/lib/list/Item';

// mobx.configure({ enforceActions: "observed" })

export class VehicleStore {
    private uiState: UiState;

    @observable
    vehicleDetails: Array<CarDetails> = [];

    @observable
    vehiclesById: { [id: string]: CarDetails } = {};

    @observable
    vehiclesByServiceId: any = {};

    @observable
    uniqueVehicles: any = {};

    @observable
    availableVehicles: Array<Car> = [];

    @observable
    prevAvailableVehicles: Array<Car> = [];


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

        const uniqueVehicles = vehicleDetails.reduce((acc: Array<any>, vehicle) => {
            const foundIndex = acc.findIndex(x => x.make === vehicle.make && x.model === vehicle.model);
            if (foundIndex !== -1) {
                const existingVehicle = acc[foundIndex];
                existingVehicle.service_ids.add(vehicle.service_id)
                existingVehicle.ids.push(vehicle.id);
            }
            else {
                acc.push({
                    make: vehicle.make,
                    model: vehicle.model,
                    service_ids: new Set([vehicle.service_id]),
                    ids: [vehicle.id]
                })
            }
            return acc;
        }, []);
        this.uniqueVehicles = uniqueVehicles;

        const vehiclesByServiceId = uniqueVehicles.reduce((acc: any, vehicle) => {
            const serviceIds: Array<number> = Array.from(vehicle.service_ids);
            serviceIds.forEach(id => {
                acc[id.toString()] = {
                    make: vehicle.make,
                    model: vehicle.model,
                    ids: vehicle.ids
                }
            });
            return acc;
        }, {});
        this.vehiclesByServiceId = vehiclesByServiceId;

        const vehiclesById = vehicleDetails.reduce((acc: any, vehicle) => {
            acc[vehicle.id] = {...vehicle};
            return acc;
        }, {});
        this.vehiclesById = vehiclesById;

        console.log('Unique vehicles', uniqueVehicles)
        console.log('Vehicles by service_id', vehiclesByServiceId);
        console.log('Vehicles by id', vehiclesById)
        
        this.uiState.setCarFilter(uniqueVehicles);
    }

    @action
    async setAvailableCars(): Promise<void> {
        const availableCars = await getAvailableCars();
        this.prevAvailableVehicles = this.availableVehicles;
        this.availableVehicles = availableCars;
        console.log('Available cars', availableCars);
    }

    @computed
    get filteredVehicles() {
        return this.availableVehicles
            .filter(vehicle => {
                let showVehicle = false;
                if (this.uiState.vehicleFilter.cars && vehicle.service_id !== 34) {
                    showVehicle = !!this.uiState.checkedCarsServiceIds.find(x => x.has(vehicle.service_id));
                }
                if (this.uiState.vehicleFilter.scooters && vehicle.service_id === 34) {
                    showVehicle = true;
                }
                return showVehicle;
            });
    }

    @computed
    get visibleVehicles() {
        return this.filteredVehicles
            .filter(this.isVehicleInVisibleArea)
            .map(vehicle => ({
                ...vehicle,
                details: this.vehiclesById[vehicle.id]
            }));
    }


    @computed
    get totalCarsCount() {
        return this.vehicleDetails.filter(this.isCar).length;
    }

    @computed
    get totalScootersCount() {
        return this.vehicleDetails.filter(this.isScooter).length;
    }


    @computed
    get availableCarsCount() {
        return this.availableVehicles.filter(this.isCar).length;
    }

    @computed
    get visibleCarsCount() {
        return this.visibleVehicles.filter(this.isCar).length;
    }


    @computed
    get availableScootersCount() {
        return this.availableVehicles.filter(this.isScooter).length;
    }

    @computed
    get visibleScootersCount() {
        return this.visibleVehicles.filter(this.isScooter).length;
    }




    isVehicleInVisibleArea = (car: Car) => {
        const map = this.uiState!.map;
        return car.lat >= map.latMin && car.lat <= map.latMax
            && car.long >= map.lngMin && car.long <= map.lngMax;
    }

    isCar = (vehicle: Car | CarDetails) => {
        return vehicle.service_id !== 34;
    }
    isScooter = (vehicle: Car | CarDetails) => {
        return !this.isCar(vehicle);
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

