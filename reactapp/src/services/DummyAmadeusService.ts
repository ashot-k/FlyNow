import axios from "axios";
import { wait } from "@testing-library/user-event/dist/utils";
import { DUMMY_URLS } from "../utils/Links";

const dummyAxiosAmadeus = axios.create();
const delay = 1000;

export function searchFlightOffersDummy(setting?: string) {
    if (setting === "AAR") {
        return wait(delay).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.FLIGHT_OFFERS_1));
    } else if (setting === "ACE") {
        return wait(delay).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.FLIGHT_OFFERS_2));
    } else {
        return wait(delay).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.FLIGHT_OFFERS_1));
    }
}

export function searchAirportDummy() {
    return wait(delay).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.LOCATIONS));
}
export function searchCheapestDatesRoundTrip() {
    return wait(delay).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.CHEAPEST_DATES_ROUNDTRIP));
}
export function searchCheapestDates() {
    return wait(delay).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.CHEAPEST_DATES));
}

export function activitiesInAreaDummy() {
    return wait(delay).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.ACTIVITIES));
}

export function searchAvailableDestinationsDummy() {
    return wait(delay).then(() => dummyAxiosAmadeus.get(DUMMY_URLS.DESTINATIONS));
}
