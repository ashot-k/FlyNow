import axios from "axios";
import { wait } from "@testing-library/user-event/dist/utils";
import { useEffect, useRef } from "react";
import { DUMMY_URLS } from "../utils/Links";
import { saveAmadeusTokenToStorage } from "../utils/Utils";

const dummyAxiosAmadeus = axios.create();
dummyAxiosAmadeus.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        return Promise.reject(error.response);
    },
);
export function searchFlightOffersDummy() {
    return wait(1000).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.FLIGHT_OFFERS));
}
export function searchAirportDummy() {
    return wait(500).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.LOCATIONS));
}
export function activitiesInAreaDummy() {
    return wait(750).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.ACTIVITIES));
}
export function searchAvailableDestinationsDummy() {
    return wait(250).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.DESTINATIONS));
}
