import {logSearchTerms} from "../services/FlyNowServiceAPI";
import {searchFlightOffers, searchFlightOffersDummy} from "../services/AmadeusAPIService";
import {useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom';


export default function useSearchFlights() {

    const [noResults, setNoResults] = useState<boolean>(false);
    const [pendingFlightSearch, setPendingFlightSearch] = useState<boolean>(false);
    const [flightList, setFlightList] = useState<any[]>([]);
    const [dictionaries, setDictionaries] = useState<any>();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if(window.location.search){
            const origin = searchParams.get("origin");
            const dest = searchParams.get("dest");
            const departureDate = searchParams.get("depDate");
            const oneWay = searchParams.get("oneWay");
            const returnDate = searchParams.get("returnDate")
            const adults = searchParams.get("adults");
            const children = searchParams.get("children");
            const maxPrice = searchParams.get("maxPrice")
            if(origin && dest && departureDate)
            searchFlights(origin , dest, departureDate,
                oneWay ? Boolean(oneWay) : true,
                returnDate? returnDate : "",
                adults ? Number(adults) : 1,
                children ? Number(children) : undefined,
                maxPrice ? Number(maxPrice) : 1000)
        }
    }, [searchParams]);

    function searchFlights (originIATA:string, destinationIATA:string,
                            departureDate: string, oneWay?: boolean, returnDate?: string, adults?: number, children?:number, maxPrice?: number){
        setPendingFlightSearch(true);
        setFlightList([]);
        if (originIATA && destinationIATA && departureDate) {

            searchFlightOffers(
                {
                    originIATA: originIATA,
                    destinationIATA: destinationIATA,
                    departureDate: departureDate,
                    returnDate: returnDate,
                    adults: adults ? adults : 1,
                    children: children,
                    maxPrice: maxPrice ? maxPrice : 1000,
                    oneWay: oneWay ? oneWay : true
                })
                .then((response => {
                    setNoResults(true)
                    setTimeout(() => {
                        setNoResults(false);
                    }, 2000);
                    setFlightList(response.data.data);
                    setDictionaries(response.data.dictionaries);
                }))
                .catch((e) => {
                    console.error(e);
                    setFlightList([]);
                }).finally(() => {
                setPendingFlightSearch(false);
            });
        }
    }

    return {searchFlights,flightList, setFlightList, dictionaries, setDictionaries, pendingFlightSearch, noResults};
}