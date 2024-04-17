import axios from "axios";




export const getToken = () => {
    return axios.get("http://192.168.1.64:8080/amadeus/token");
}


export const searchFlightOffers = (origin: { iataCode: string; }, destination: {
    iataCode: string;
}, departureDate: any, returnDate: any, adults: number, children: number) => {
    return axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers",
        {
            params: {
                originLocationCode: origin.iataCode,
                destinationLocationCode: destination.iataCode,
                departureDate: departureDate,
                returnDate: returnDate,
                adults: adults,
                children: children
            }
        });
}


export const citySearch = (keyword: string) => {
    return axios.get("https://test.api.amadeus.com/v1/reference-data/locations", {
        params: {
            subType: "AIRPORT",
            keyword: keyword
        }
    });
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