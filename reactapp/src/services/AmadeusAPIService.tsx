import axios from "axios";
import {getAirportByCityName, getUserLocation} from "../utils/Utils";

const baseURL = '';
const max = 25;

export const getToken = () => {
    return axios.get("http://192.168.1.64:8079/amadeus/token");
}

export const searchFlightOffers = (origin: { iataCode: string; }, destination: {
    iataCode: string;
}, departureDate: any, returnDate: any, adults: number, children: number, maxPrice: number) => {
    if (!(returnDate.length > 0))
        returnDate = null;
    return axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers",
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

export const airportSearch = (keyword: string) => {
    return axios.get("https://test.api.amadeus.com/v1/reference-data/locations", {
        params: {
            subType: "AIRPORT",
            keyword: keyword
        }
    });
}
export const activitiesInArea = (latitude: any, longitude: any) => {
    return axios.get("https://test.api.amadeus.com/v1/shopping/activities", {
        params: {
            latitude: latitude,
            longitude: longitude
        }
    });
}
export const activitiesInAreaBySquare = (latitude: any, longitude: any) => {
    return axios.get("https://test.api.amadeus.com/v1/shopping/activities/by-square", {
        params: {
            //   north: (latitude + 0.001), west: (longitude + 0.001), south: (latitude - 0.001), east: (longitude - 0.001)
            north: latitude, west: longitude, south: latitude - 0.05, east: longitude - 0.05
        }
    });
}

export const activitiesAroundArea = (north: any, west: any, south: any, east: any) => {
    return axios.get("https://test.api.amadeus.com/v1/shopping/activities/by-square", {
        params: {
            north: north, west: west, south: south, east: east
        }
    });
}

export const locationScores = () => {
    return axios.get("https://test.api.amadeus.com/v1/location/analytics/category-rated-areas?latitude=41.397158&longitude=2.160873")
}

export const inspirationSearch = (origin: { iataCode: string; }, oneWay: boolean) => {
    return axios.get("https://test.api.amadeus.com/v1/shopping/flight-destinations?viewBy=COUNTRY", {
        params: {
            origin: origin.iataCode, oneWay: oneWay,
        }
    });
}
export const searchMostTraveledDestinations = (origin: {iataCode: string;}, period: string) =>{

    return axios.get("https://test.api.amadeus.com/v1/travel/analytics/air-traffic/traveled",{
        params:{
            originCityCode: origin.iataCode,
            period: period
            // date.getFullYear() + "-" + date.getMonth()
        }
    })
}
export const recoMostTraveledFromUserLocation = () =>{
    getUserLocation().then(r => {
        let airport = getAirportByCityName(r.data.city);
        const date = new Date();
        return searchMostTraveledDestinations({ iataCode:  airport.iata },  date.getFullYear() + "-" + date.getMonth())
    })
}
export const searchAvailableDestinations = (origin: {
    iataCode: string
}, oneWay: boolean, nonStop: boolean, departureDate: string) => {
    return axios.get("https://test.api.amadeus.com/v1/shopping/flight-destinations", {
        params: {
            origin: origin.iataCode,
            oneWay: oneWay,
            nonStop: nonStop,
            departureDate: departureDate
        }
    });
}