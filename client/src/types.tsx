export interface Car {
    address: string;
    fuel_level: number;
    id: number;
    is_cargo: boolean;
    is_electric: boolean;
    lat: number;
    long: number;
    price: number;
    service_id: number;
    details: CarDetails;
}

export interface CarDetails {
    avg_fuel_consumption: number;
    features: {
        air_conditioning: boolean;
        bluetooth: boolean;
        child_seat: boolean;
        navigation: boolean;
        usb: boolean;
    };
    fuel_capacity: number;
    id: number;
    image_2d_uri: string;
    image_uri: string;
    is_automatic: boolean;
    license_plate: string;
    make: string;
    model: string;
    service_id: number;
}

export interface VehicleTree {
    [_: string]: {
        [_: string]: {
            count: number,
            service_ids: Array<number>,
            visible: boolean
        }
    }
}