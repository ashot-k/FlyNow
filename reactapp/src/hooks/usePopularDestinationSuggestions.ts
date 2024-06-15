import {useContext, useEffect, useState} from "react";
import {searchMostTraveledDestinations} from "../services/AmadeusAPIService";
import {getAirportByIATA} from "../utils/Utils";
import {userArea} from "../context";

export default function usePopularDestinationSuggestions(period: string) {
    const userOriginIATA = useContext(userArea);
    const [pending, setPending] = useState(false);
    const [popularDestinations, setPopularDestinations] = useState<string[]>([])

    useEffect(() => {
        setPending(true);
        searchMostTraveledDestinations(userOriginIATA, period)
            .then((r) => {
                let destinations = [];
                let data = r.data.data
                for (let i = 0; i < data.length; i++) {
                    if (getAirportByIATA(data[i].destination)?.iata
                        && getAirportByIATA(data[i].destination)?.city
                        && getAirportByIATA(data[i].destination)?.name != "All Airports")
                        destinations.push(data[i].destination);
                }
                //destinations = destinations.slice(0, 3);
                setPopularDestinations(destinations);
            })
            .catch(e => console.log(e))
            .finally(() => setPending(false))
    }, []);
   /* const pending = false
    const popularDestinations = ["MAD", "BCN", "ATH", "KRW", "ABC", "BEG", "BLQ", "ASU", "MUC", "MEX"];*/
    return {popularDestinations, pending};
}