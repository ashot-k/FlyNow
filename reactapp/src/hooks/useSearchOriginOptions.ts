import { searchAirport } from "../services/AmadeusAPIService";
import { capitalize, devMode } from "../utils/Utils";
import { useState } from "react";
import { RouteInfo } from "../components/search/FlightSearch";
import { searchAirportDummy } from "../services/DummyAmadeusService";

export default function useSearchOriginOptions() {
    const [pendingOriginSearch, setPendingOriginSearch] = useState<boolean>(false);
    const [origin, setOrigin] = useState<RouteInfo>();
    const [originOptions, setOriginOptions] = useState<RouteInfo[]>([]);

    async function searchOriginOptions(inputValue: string): Promise<RouteInfo[]> {
        try {
            setPendingOriginSearch(true);
            let response;
            if (devMode()) {
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
