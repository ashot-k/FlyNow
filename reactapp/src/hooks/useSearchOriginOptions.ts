import { searchAirport } from "../services/AmadeusAPIService";
import { capitalize } from "../utils/Utils";
import { useState } from "react";
import { Route } from "../components/search/FlightSearch";
import { searchAirportDummy } from "../services/DummyAmadeusService";

export default function useSearchOriginOptions() {
    const [pendingOriginSearch, setPendingOriginSearch] = useState<boolean>(false);
    const [origin, setOrigin] = useState<Route>();
    const [originOptions, setOriginOptions] = useState<Route[]>([]);

    async function searchOriginOptions(inputValue: string): Promise<Route[]> {
        try {
            setPendingOriginSearch(true);
            let response;
            if (process.env.REACT_APP_DEV_MODE === "true") {
                response = await searchAirportDummy();
            } else {
                response = await searchAirport(inputValue);
            }
            const airports = response.data.data;
            return airports.map((airport: any, index: number) => ({
                value: index,
                label:
                    capitalize(airport.name) +
                    " (" +
                    airport.iataCode +
                    "), " +
                    capitalize(airport.address.countryName),
                cityName: airport.address.cityName,
                countryCode: airport.address.countryCode,
                iataCode: airport.iataCode,
                airport: airport.name,
            }));
        } catch (error) {
            console.log(error);
            return [];
        } finally {
            setPendingOriginSearch(false);
        }
    }

    return {
        pendingOriginSearch,
        origin,
        setOrigin,
        originOptions,
        setOriginOptions,
        searchOriginOptions,
    };
}
