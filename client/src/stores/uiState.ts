import { observable, action, reaction, computed } from 'mobx';

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
    carFilter: {
        [_: number]: boolean
    } = {}
}

