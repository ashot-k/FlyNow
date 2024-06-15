import {searchAvailableDestinations} from "../services/AmadeusAPIService";
import {capitalize} from "../utils/Utils";
import {Route} from "../components/FlightSearch";
import {useEffect, useState} from "react";

export default function useSearchDestinationOptions(departureDate: string, originIATA: string | undefined) {

    const [pendingDestSearch, setPendingDestSearch] = useState<boolean>(false);
    const [destination, setDestination] = useState<Route>();
    const [destinationOptions, setDestinationOptions] = useState<Route[]>([]);

    const searchDestinationOptions = (originIATA: string) => {
        let options: Route[] = [];
        setPendingDestSearch(true)
        if (departureDate)
            searchAvailableDestinations(originIATA).then(availableDestinations => {
                availableDestinations.data.data.map((destination: any, index: number) => {
                    options.push({
                        value: index,
                        label: capitalize(destination.name) + " (" + destination.iataCode + "), " + capitalize(destination.address.countryName),
                        cityName: destination.name,
                        countryCode: destination.address.countryCode,
                        iataCode: destination.iataCode,
                        airport: destination.name
                    });
                });
                setDestinationOptions(options);
                setDestination(options[0])
            }).catch((e) => {
                console.log(e);
                setDestinationOptions([]);
                setDestination(undefined);
            }).finally(() => setPendingDestSearch(false))
    }
    const loadDestinationOption = (iata: string) => {
        for (const destinationOption of destinationOptions) {
            if (destinationOption.iataCode === iata) {
                setDestination(destinationOption);
                destinationOptions.splice(destinationOptions.indexOf(destinationOption), 1);
                destinationOptions.unshift(destinationOption)
                setDestinationOptions(destinationOptions);
                return;
            }
        }
    }

    return {pendingDestSearch, destination, setDestination, destinationOptions, setDestinationOptions, loadDestinationOption, searchDestinationOptions};
}