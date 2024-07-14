import { searchAvailableDestinations } from "../services/AmadeusAPIService";
import { capitalize, devMode } from "../utils/Utils";
import { Route } from "../components/search/FlightSearch";
import { useState } from "react";
import { searchAvailableDestinationsDummy } from "../services/DummyAmadeusService";

export default function useSearchDestinationOptions() {
    const [pendingDestSearch, setPendingDestSearch] = useState<boolean>(false);
    const [destination, setDestination] = useState<Route>();
    const [destinationOptions, setDestinationOptions] = useState<Route[]>([]);

    async function searchDestinationOptions(originIATA: string): Promise<Route[]> {
        try {
            setPendingDestSearch(true);
            let response;
            if (devMode()) {
                response = await searchAvailableDestinationsDummy();
            } else {
                response = await searchAvailableDestinations(originIATA);
            }
            const destinations = response.data.data;
            return destinations.map((dest: any, index: number) => ({
                value: index,
                label: capitalize(dest.name) + " (" + dest.iataCode + "), " + capitalize(dest.address.countryName),
                cityName: dest.name,
                countryCode: dest.address.countryCode,
                iataCode: dest.iataCode,
                airport: dest.name,
            }));
        } catch (e) {
            console.log(e);
            return [];
        } finally {
            setPendingDestSearch(false);
        }
    }

    return {
        pendingDestSearch,
        destination,
        setDestination,
        destinationOptions,
        setDestinationOptions,
        searchDestinationOptions,
    };
}
