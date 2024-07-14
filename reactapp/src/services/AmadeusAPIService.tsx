import axios from "axios";
import { getAmadeusTokenFromStorage, saveAmadeusTokenToStorage, Token } from "../utils/Utils";
import { axiosFlyNow } from "./FlyNowServiceAPI";
import { AMADEUS_URLs, FLY_NOW_URLs } from "../utils/Links";
const max = 25;

const axiosAmadeus = axios.create({
    baseURL: "https://test.api.amadeus.com",
});

async function getToken(): Promise<Token> {
    try {
        const r = await axiosFlyNow.get(FLY_NOW_URLs.TOKEN_ENDPOINT);
        return r.data;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

axiosAmadeus.interceptors.request.use(
    async function (config) {
        if (config.url === FLY_NOW_URLs.TOKEN_ENDPOINT) {
            config.headers.Authorization = "";
            return config;
        } else {
            config.headers.Authorization = "Bearer " + getAmadeusTokenFromStorage()?.token;
            return config;
        }
    },
    function (error) {
        return Promise.reject(error);
    },
);

axiosAmadeus.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401) {
            try {
                const response = await getToken();
                const { token, expiration, issued_at } = response;
                saveAmadeusTokenToStorage({ token, expiration, issued_at });
                const originalRequest = error.config;
                return Promise.resolve(axiosAmadeus({ ...originalRequest }));
            } catch (e) {
                console.log(e);
            }
        }
        return Promise.reject(error.response);
    },
);

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
    return axiosAmadeus.get(AMADEUS_URLs.FLIGHT_OFFERS, {
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
    return axiosAmadeus.get(AMADEUS_URLs.LOCATIONS, {
        params: {
            subType: "AIRPORT",
            keyword: keyword,
        },
    });
}

export function activitiesInArea(latitude: any, longitude: any) {
    return axiosAmadeus.get(AMADEUS_URLs.ACTIVITIES, {
        params: {
            latitude: latitude,
            longitude: longitude,
            radius: 10,
        },
    });
}

export function searchMostTraveledDestinations(originIATA: string, period: string) {
    return axiosAmadeus.get(AMADEUS_URLs.MOST_TRAVELED, {
        params: {
            originCityCode: originIATA,
            period: period,
        },
    });
}

export function searchAvailableDestinations(originIATA: string) {
    return axiosAmadeus.get(AMADEUS_URLs.DESTINATIONS, {
        params: {
            departureAirportCode: originIATA,
        },
    });
}
