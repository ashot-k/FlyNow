import axios from "axios";
import {
    addZero,
    checkIfExpired,
    getAirportByCityName,
    getAmadeusTokenFromStorage,
    getUserLocation, saveAmadeusTokenToStorage,
    Token
} from "../utils/Utils";
import {Route, SearchInfo} from "../components/FlightSearch";

const max = 25;

export const axiosAmadeus = axios.create({
    baseURL: "https://test.api.amadeus.com",
});

export async function getToken() {
    try {
        const r = await axiosAmadeus.get("http://192.168.1.64:8079/amadeus/token", {headers:{Authorization: ""}});
        const token: Token = r.data;
        return token;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

axiosAmadeus.interceptors.request.use(async function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

axiosAmadeus.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401) {
        console.log(error)
        console.log("refreshing")
        originalRequest._retry = true;
        const tokenObject = await getToken();
        console.log(tokenObject)
        saveAmadeusTokenToStorage(tokenObject);
        axiosAmadeus.defaults.headers.common['Authorization'] = 'Bearer ' + tokenObject.token;
        return axiosAmadeus(originalRequest);
    }
    return Promise.reject(error);
});

export const searchFlightOffers = ({
                                       origin,
                                       destination,
                                       departureDate,
                                       returnDate,
                                       adults,
                                       children,
                                       maxPrice, oneWay
                                   }: SearchInfo) => {

    let returnDateChecked: undefined | string = returnDate;
    if (oneWay)
        returnDateChecked = undefined;
    return axiosAmadeus.get("/v2/shopping/flight-offers",
        {
            params: {
                originLocationCode: origin.iataCode, destinationLocationCode: destination.iataCode,
                departureDate: departureDate, returnDate: returnDateChecked,
                adults: adults, children: children,
                maxPrice: maxPrice,
                max: max
            }
        });
}

export const searchAirport = (keyword: string) => {
    return axiosAmadeus.get("/v1/reference-data/locations", {
        params: {
            subType: "AIRPORT",
            keyword: keyword
        }
    });
}

export const activitiesInArea = (latitude: any, longitude: any) => {
    return axiosAmadeus.get("/v1/shopping/activities", {
        params: {
            latitude: latitude,
            longitude: longitude,
            radius: 10
        }
    });
}

export const activitiesInAreaBySquare = (latitude: any, longitude: any) => {
    return axiosAmadeus.get("/v1/shopping/activities/by-square", {
        params: {
            //   north: (latitude + 0.001), west: (longitude + 0.001), south: (latitude - 0.001), east: (longitude - 0.001)
            north: latitude, west: longitude, south: latitude - 0.05, east: longitude - 0.05
        }
    });
}

export const searchMostTraveledDestinations = (origin: { iataCode: string; }, period: string) => {
    return axiosAmadeus.get("/v1/travel/analytics/air-traffic/traveled", {
        params: {
            originCityCode: origin.iataCode,
            period: period
            // date.getFullYear() + "-" + date.getMonth()
        }
    })
}

export const recoMostTraveledFromUserLocation = async () => {
    let airport: any;
    await getUserLocation().then(r => {
        airport = getAirportByCityName(r.data.city);
    })
    const date = new Date();
    if (airport && airport.iata)
        return searchMostTraveledDestinations({iataCode: airport.iata}, date.getFullYear() + "-" + addZero(date.getMonth()));
}

export const recoMostTraveled = (iata: string, date: string) => {
    return searchMostTraveledDestinations({iataCode: iata}, date);
}

export const searchAvailableDestinations = (origin: Route) => {
    return axiosAmadeus.get("/v1/airport/direct-destinations", {
        params: {
            departureAirportCode: origin.iataCode
        }
    });
}