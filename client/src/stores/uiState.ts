import { observable, action, reaction, computed } from 'mobx';

export class UiState {
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

}

