import { Car, CarDetails } from "./types";

const cityBeeOrigin = 'https://citybee-webapp-production-lt.azurewebsites.net';

// Mostly not needed apart from app version, but I'm a nice person
const defaultHeaders = {
    'Accept-Language': 'en-US',
    'App-Version': '4.10.2',
    'Accept': 'application/json'
};

/**
 * Returns all available cars.
 */
export async function getAvailableCars(): Promise<Car[]> {
    const response = await betterFetch(`${cityBeeOrigin}/api/CarsLive/GetAvailableCars`, {
        method: 'GET',
        headers: defaultHeaders
    });
    return response ? response : [];
}

/**
 * Returns all car details.
 */
export async function getCarsDetails(): Promise<CarDetails[]> {
    const response = await betterFetch(`${cityBeeOrigin}/api/CarsLive/GetCarsDetails`, {
        method: 'GET',
        headers: defaultHeaders
    });
    return response ? response : [];
}


async function betterFetch(url: RequestInfo, options: RequestInit): Promise<any> {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw response;
        }
        return await response.json();
    } catch (error) {
        console.error(`${options.method} ${url}`, error, options);
        return null;
    }
}
