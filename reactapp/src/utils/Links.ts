export const FLY_NOW_IP = process.env.REACT_APP_FLY_NOW_INSTANCE_IP;
export const FLY_NOW_PORT = process.env.REACT_APP_FLY_NOW_INSTANCE_PORT;
export const FLY_NOW_URL_BASE = "http://" + FLY_NOW_IP + ":" + FLY_NOW_PORT;

export const FLY_NOW_URLs = {
    TOKEN_ENDPOINT: "/amadeus/token",
    FLIGHT_OFFERS: "/amadeus/flight-offers",
    LOCATIONS: "/amadeus/locations",
    DESTINATIONS: "/amadeus/destinations",
    ACTIVITIES: "/amadeus/activities",
    MOST_TRAVELED: "/amadeus/most-traveled",

    SEARCH_ANALYTICS: "/analytics/search-analytics",
    BOOKING_ANALYTICS: "/analytics/booking-analytics",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    USER_INFO: "/users",
    NO_AUTH_ENDPOINTS: [{}],
};
const NO_AUTH_ENDPOINTS: string[] = [
    FLY_NOW_URLs.TOKEN_ENDPOINT,
    FLY_NOW_URLs.LOGIN,
    FLY_NOW_URLs.REGISTER,
    FLY_NOW_URLs.REFRESH,
];
FLY_NOW_URLs.NO_AUTH_ENDPOINTS = NO_AUTH_ENDPOINTS;

export const AMADEUS_URLs = {
    ACTIVITIES: "/v1/shopping/activities",
    MOST_TRAVELED: "/v1/travel/analytics/air-traffic/traveled",
    LOCATIONS: "/v1/reference-data/locations",
    DESTINATIONS: "/v1/airport/direct-destinations",
    FLIGHT_OFFERS: "/v2/shopping/flight-offers",
};
export const DUMMY_URLS = {
    ACTIVITIES: "/mock_json/destination_activities.json",
    //  MOST_TRAVELED: "/v1/travel/analytics/air-traffic/traveled",
    LOCATIONS: "/mock_json/origins.json",
    DESTINATIONS: "/mock_json/destinations.json",
    CHEAPEST_DATES: "/mock_json/cheapest_dates.json",
    CHEAPEST_DATES_ROUNDTRIP: "/mock_json/cheapest_dates_roundtrip.json",
    FLIGHT_OFFERS_1: "/mock_json/offers_roundtrip.json",
    FLIGHT_OFFERS_2: "/mock_json/offers_roundtrip_2.json",
};
