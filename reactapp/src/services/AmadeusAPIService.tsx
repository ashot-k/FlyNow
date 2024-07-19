import axios from "axios";
import { FLY_NOW_URL_BASE, FLY_NOW_URLs } from "../utils/Links";

const max = 25;

const axiosAmadeus = axios.create({
    baseURL: FLY_NOW_URL_BASE,
});

interface FlightSearchInfo {
    departureDate: string;
    returnDate?: string;
    adults: number;
    children?: number;
    originIATA: string;
    destinationIATA: string;
    maxPrice: number;
    currencyCode?: string;
}

export const searchFlightOffers = ({
    originIATA,
    destinationIATA,
    departureDate,
    returnDate,
    adults,
    children,
    maxPrice,
    currencyCode,
}: FlightSearchInfo) => {
    let returnDateChecked: undefined | string = returnDate;
    if (!returnDateChecked) returnDateChecked = undefined;
    return axiosAmadeus.get(FLY_NOW_URLs.FLIGHT_OFFERS, {
        params: {
            originLocationCode: originIATA,
            destinationLocationCode: destinationIATA,
            departureDate: departureDate,
            returnDate: returnDateChecked,
            adults: adults,
            children: children,
            maxPrice: maxPrice,
            max: max,
            currencyCode: currencyCode,
        },
    });
};

export function searchAirport(keyword: string) {
    return axiosAmadeus.get(FLY_NOW_URLs.LOCATIONS, {
        params: {
            subType: "AIRPORT",
            keyword: keyword,
        },
    });
}

export function activitiesInArea(latitude: any, longitude: any) {
    return axiosAmadeus.get(FLY_NOW_URLs.ACTIVITIES, {
        params: {
            latitude: latitude,
            longitude: longitude,
            radius: 10,
        },
    });
}

export function searchMostTraveledDestinations(originIATA: string, period: string) {
    return axiosAmadeus.get(FLY_NOW_URLs.MOST_TRAVELED, {
        params: {
            originCityCode: originIATA,
            period: period,
        },
    });
}

export function searchAvailableDestinations(originIATA: string) {
    return axiosAmadeus.get(FLY_NOW_URLs.DESTINATIONS, {
        params: {
            departureAirportCode: originIATA,
        },
    });
}
