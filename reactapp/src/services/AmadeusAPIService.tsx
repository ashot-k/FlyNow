import axios from "axios";
import {getAirportByCityName, getUserLocation} from "../utils/Utils";

const max = 25;
const axiosAmadeus = axios.create({
    baseURL: "https://test.api.amadeus.com",
});

export const getToken = () => {
    return axiosAmadeus.get("http://192.168.1.64:8079/amadeus/token");
}

getToken().then(r => axiosAmadeus.defaults.headers.common['Authorization'] = "Bearer " + r.data.token);

export const searchFlightOffers = (origin: { iataCode: string; }, destination: {
    iataCode: string;
}, departureDate: any, returnDate: any, adults: number, children: number, maxPrice: number) => {
    if (!(returnDate.length > 0))
        returnDate = null;
    return axiosAmadeus.get("/v2/shopping/flight-offers",
        {
            params: {
                originLocationCode: origin.iataCode, destinationLocationCode: destination.iataCode,
                departureDate: departureDate, returnDate: returnDate,
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
            longitude: longitude
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

export const activitiesAroundArea = (north: any, west: any, south: any, east: any) => {
    return axiosAmadeus.get("/v1/shopping/activities/by-square", {
        params: {
            north: north, west: west, south: south, east: east
        }
    });
}

export const inspirationSearch = (origin: { iataCode: string; }, oneWay: boolean) => {
    return axiosAmadeus.get("/v1/shopping/flight-destinations?viewBy=COUNTRY", {
        params: {
            origin: origin.iataCode, oneWay: oneWay,
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

export const recoMostTraveledFromUserLocation = () => {
    getUserLocation().then(r => {
        let airport = getAirportByCityName(r.data.city);
        const date = new Date();
        return searchMostTraveledDestinations({iataCode: airport.iata}, date.getFullYear() + "-" + date.getMonth())
    })
}

export const searchAvailableDestinations = (origin: { iataCode: string },
                                            oneWay: boolean, nonStop: boolean, departureDate: string) => {
    return axiosAmadeus.get("/v1/shopping/flight-destinations", {
        params: {
            origin: origin.iataCode,
            oneWay: oneWay,
            nonStop: nonStop,
            departureDate: departureDate
        }
    });
}