import { observable, action, reaction, computed } from 'mobx';
import { VehicleTree } from '../types';

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
    carFilter: Array<{ key: string, checked: boolean }> = [];

    @computed
    get checkedCars() {
        return this.carFilter.filter(x => x.checked).map(x => x.key);
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
    setCarFilter(tree: VehicleTree) {
        this.carFilter = Object.keys(tree).map(make => {
            const makeItem = tree[make];
            return Object.keys(makeItem).map(model => {
                const modelItem = makeItem[model];
                return {
                    key: `${make}.${model}`,
                    checked: true
                };
            });
        }).flat(1);
    }

    @action
    updateCarFilter(keys: Array<string>) {
        this.carFilter.forEach(filterItem => filterItem.checked = !!keys.find(key => filterItem.key === key));
    }
}

