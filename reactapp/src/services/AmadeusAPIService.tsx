import axios from "axios";
import {addZero, getAirportByCityName, getUserLocation, Token} from "../utils/Utils";
import {SearchInfo} from "../components/FlightSearch";

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

export const searchFlightOffers = ({
                                       origin,
                                       destination,
                                       departureDate,
                                       returnDate,
                                       adults,
                                       children,
                                       maxPrice
                                   }: SearchInfo) => {

    let returnDateChecked: undefined | string = returnDate;
    if (returnDateChecked.length <= 0)
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