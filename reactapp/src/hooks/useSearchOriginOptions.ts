import {searchAirport} from "../services/AmadeusAPIService";
import {capitalize} from "../utils/Utils";
import {useEffect, useState} from "react";
import {Route} from "../components/FlightSearch";

export default function useSearchOriginOptions(originIATA?: string) {

    const [pendingOriginSearch, setPendingOriginSearch] = useState<boolean>(false);
    const [origin, setOrigin] = useState<Route>();
    const [originOptions, setOriginOptions] = useState<Route[]>([]);

    async function searchOriginOptions(inputValue: string):Promise<Route[]> {
        try {
            setPendingOriginSearch(true);
            const response = await searchAirport(inputValue);
            const airports = response.data.data;
            const options = airports.map((airportInfo: any, index: number) => ({
                value: index,
                label: capitalize(airportInfo.name) + " (" + airportInfo.iataCode + "), " + capitalize(airportInfo.address.countryName),
                cityName: airportInfo.address.cityName,
                countryCode: airportInfo.address.countryCode,
                iataCode: airportInfo.iataCode,
                airport: airportInfo.name
            }));
            setOriginOptions(options)
            if (options.length > 0)
                setOrigin(options[0])
            return options;
        } catch (error) {
            console.log(error);
            return [];
        } finally {
            setPendingOriginSearch(false);
        }
    };

    return {pendingOriginSearch, origin, setOrigin, originOptions, setOriginOptions, searchOriginOptions};
}