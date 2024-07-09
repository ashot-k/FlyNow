export const FLY_NOW_IP = process.env.REACT_APP_FLY_NOW_INSTANCE_IP;
export const FLY_NOW_PORT = process.env.REACT_APP_FLY_NOW_INSTANCE_PORT;
export const FLY_NOW_URL_BASE = "http://" + FLY_NOW_IP + ":" + FLY_NOW_PORT;

export const FLY_NOW_URLs = {
    TOKEN_ENDPOINT: "/amadeus/token",
};

export const AMADEUS_URLs = {
    ACTIVITIES: "/v1/shopping/activities",
    MOST_TRAVELED: "/v1/travel/analytics/air-traffic/traveled",
    LOCATIONS: "/v1/reference-data/locations",
    DESTINATIONS: "/v1/airport/direct-destinations",
    FLIGHT_OFFERS: "/v2/shopping/flight-offers",
};
