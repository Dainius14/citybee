import { observable, action, reaction, computed } from 'mobx';
import { CarTreeItem } from '../types';

export class UiState {
    @observable
    vehicleFilter = {
        cars: true,
        bicycles: false,
        scooters: false,
    }

    @observable
    map = {
        currentZoom: 0,
        latMin: 0,
        latMax: 0,
        lngMin: 0,
        lngMax: 0
    }

    @observable
    carFilter: Array<{ key: string, checked: boolean, service_ids: Set<number> }> = [];

    @observable
    carTree: CarTreeItem[] = [];

    @computed
    get checkedCars() {
        return this.carFilter.filter(x => x.checked).map(x => x.key);
    }

    @computed
    get checkedCarsServiceIds() {
        return this.carFilter.filter(x => x.checked).map(x => x.service_ids);
    }

    @action
    checkAllCars(): void {
        this.carFilter = this.carFilter.map(x => {
            return  {...x, checked: true};
        });
    }

    @action
    uncheckAllCars(): void {
        this.carFilter = this.carFilter.map(x => {
            return  {...x, checked: false};
        })
    }

    @action
    setCarFilter(uniqueVehicles: any) {
        const uniqueCars = uniqueVehicles
            .filter((vehicle: any) => vehicle.make.toLowerCase() !== 'scooter')
            .sort((a: any, b: any) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));

        const carFilter = uniqueCars.map((vehicle: any) => ({
                key: `${vehicle.make}.${vehicle.model}`,
                checked: true,
                service_ids: vehicle.service_ids
            }));
        this.carFilter = carFilter;
        console.log('Car filter', carFilter);

        const carTree = uniqueCars.reduce((acc: any[], car: any) => {
            const carMake = acc.find(x => x.key === car.make);
            if (carMake) {
                carMake.models.push({
                    key: `${car.make}.${car.model}`,
                    title: car.model
                });
            }
            else {
                acc.push({
                    key: car.make,
                    title: car.make,
                    models: [{
                        key: `${car.make}.${car.model}`,
                        title: car.model
                    }]
                });
            }
            return acc;
        }, []);
        this.carTree = carTree;
        console.log('Car tree', carTree);
    }

    @action
    updateCarFilter(keys: Array<string>) {
        this.carFilter.forEach(filterItem => filterItem.checked = !!keys.find(key => filterItem.key === key));
    }
}

