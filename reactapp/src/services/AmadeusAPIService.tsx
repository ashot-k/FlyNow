import axios from "axios";
import {getAmadeusTokenFromStorage, saveAmadeusTokenToStorage, Token} from "../utils/Utils";

const max = 25;

const axiosAmadeus = axios.create({
    baseURL: "https://test.api.amadeus.com",
});

async function getToken() {
    try {
        const flynowBaseURL = "http://" + process.env.REACT_APP_FLY_NOW_INSTANCE_IP + ":" + process.env.REACT_APP_FLY_NOW_INSTANCE_PORT;
        const tokenURL = flynowBaseURL + "/amadeus/token";
        const r = await axiosAmadeus.get(tokenURL, {headers: {Authorization: ""}});
        const token: Token = r.data;
        return token;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

axiosAmadeus.interceptors.request.use(async function (config) {
    if (config.url === "http://3.74.56.55:8079/amadeus/token") {
        config.headers.Authorization = "";
        return config;
    } else {
        config.headers.Authorization = "Bearer " + getAmadeusTokenFromStorage()?.token;
        return config;
    }
}, function (error) {
    return Promise.reject(error);
});

axiosAmadeus.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401) {
        try {
            const response = await getToken();
            const {token, expiration, issued_at} = response;
            saveAmadeusTokenToStorage({token, expiration, issued_at});
            const originalRequest = error.config;
            return Promise.resolve(axiosAmadeus({...originalRequest}))
        } catch (e) {
            console.log(e);
        }
    }
    return Promise.reject(error.response);
});

interface FlightSearchInfo {
    departureDate: string;
    oneWay: boolean;
    returnDate: string;
    adults: number;
    children: number;
    originIATA: string;
    destinationIATA: string;
    maxPrice: number;
}

export const searchFlightOffers = ({
                                       originIATA,
                                       destinationIATA,
                                       departureDate,
                                       returnDate,
                                       adults,
                                       children,
                                       maxPrice, oneWay
                                   }: FlightSearchInfo) => {

    let returnDateChecked: undefined | string = returnDate;
    if (oneWay)
        returnDateChecked = undefined;
    return axiosAmadeus.get("/v2/shopping/flight-offers",
        {
            params: {
                originLocationCode: originIATA, destinationLocationCode: destinationIATA,
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

export const searchMostTraveledDestinations = (originIATA: string, period: string) => {
    return axiosAmadeus.get("/v1/travel/analytics/air-traffic/traveled", {
        params: {
            originCityCode: originIATA,
            period: period
        }
    })
}

export const searchAvailableDestinations = (originIATA: string) => {
    return axiosAmadeus.get("/v1/airport/direct-destinations", {
        params: {
            departureAirportCode: originIATA
        }
    });
}
