import axios from "axios";
import { wait } from "@testing-library/user-event/dist/utils";

const dummyAxiosAmadeus = axios.create();

export function searchFlightOffersDummy() {
    return wait(1000).then(() => dummyAxiosAmadeus.get("/mock_json/search_flight_offers_roundtrip.json"));
}
export function searchAirportDummy() {
    return wait(500).then(() => dummyAxiosAmadeus.get("/mock_json/airports.json"));
}

export function activitiesInAreaDummy() {
    return wait(1000).then(() => dummyAxiosAmadeus.get("/mock_json/destination_activities.json"));
}
export function searchAvailableDestinationsDummy() {
    return wait(500).then(() => dummyAxiosAmadeus.get("/mock_json/destinations.json"));
}
