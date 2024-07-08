import axios from "axios";
import { getAmadeusTokenFromStorage, saveAmadeusTokenToStorage, Token } from "../utils/Utils";
import { wait } from "@testing-library/user-event/dist/utils";
import { axiosFlyNow } from "./FlyNowServiceAPI";

const max = 25;

const axiosAmadeus = axios.create({
  baseURL: "https://test.api.amadeus.com",
});
const dummyAxiosAmadeus = axios.create();

async function getToken() {
  try {
    const flynowBaseURL = "http://" + process.env.REACT_APP_FLY_NOW_INSTANCE_IP + ":" + process.env.REACT_APP_FLY_NOW_INSTANCE_PORT;
    const tokenURL = flynowBaseURL + "/amadeus/token";
    const r = await axiosFlyNow.get(tokenURL);
    const token: Token = r.data;
    return token;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

axiosAmadeus.interceptors.request.use(
  async function (config) {
    if (config.url === "http://" + process.env.REACT_APP_FLY_NOW_INSTANCE_IP + ":8079/amadeus/token") {
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
}

export function searchFlightOffersDummy(...any: any) {
  return wait(1250).then(() => dummyAxiosAmadeus.get("/mock_json/search_flight_offers_roundtrip.json"));
}

export const searchFlightOffers = ({ originIATA, destinationIATA, departureDate, returnDate, adults, children, maxPrice }: FlightSearchInfo) => {
  let returnDateChecked: undefined | string = returnDate;
  if (!returnDateChecked) returnDateChecked = undefined;
  return axiosAmadeus.get("/v2/shopping/flight-offers", {
    params: {
      originLocationCode: originIATA,
      destinationLocationCode: destinationIATA,
      departureDate: departureDate,
      returnDate: returnDateChecked,
      adults: adults,
      children: children,
      maxPrice: maxPrice,
      max: max,
    },
  });
};

export function searchAirportDummy(keyword: string) {
  return wait(500).then(() => dummyAxiosAmadeus.get("/mock_json/airports.json"));
}

export function searchAirport(keyword: string) {
  return axiosAmadeus.get("/v1/reference-data/locations", {
    params: {
      subType: "AIRPORT",
      keyword: keyword,
    },
  });
}

export function activitiesInArea(latitude: any, longitude: any) {
  return axiosAmadeus.get("/v1/shopping/activities", {
    params: {
      latitude: latitude,
      longitude: longitude,
      radius: 10,
    },
  });
}

export function activitiesInAreaDummy(latitude: any, longitude: any) {
  return wait(500).then(() => dummyAxiosAmadeus.get("/mock_json/destination_activities.json"));
}

export function searchMostTraveledDestinations(originIATA: string, period: string) {
  return axiosAmadeus.get("/v1/travel/analytics/air-traffic/traveled", {
    params: {
      originCityCode: originIATA,
      period: period,
    },
  });
}

export function searchAvailableDestinationsDummy(originIATA: string) {
  return wait(500).then(() => dummyAxiosAmadeus.get("/mock_json/destinations.json"));
}

export function searchAvailableDestinations(originIATA: string) {
  return axiosAmadeus.get("/v1/airport/direct-destinations", {
    params: {
      departureAirportCode: originIATA,
    },
  });
}
