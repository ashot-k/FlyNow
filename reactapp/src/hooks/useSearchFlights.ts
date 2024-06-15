import {logSearchTerms} from "../services/FlyNowServiceAPI";
import {searchFlightOffers} from "../services/AmadeusAPIService";
import {useState} from "react";

export default function useSearchFlights() {

    const [noResults, setNoResults] = useState<boolean>(false);
    const [pendingFlightSearch, setPendingFlightSearch] = useState<boolean>(false);
    const [flightList, setFlightList] = useState<any[]>([]);
    const [dictionaries, setDictionaries] = useState<any>();

    function searchFlights (originIATA:string, destinationIATA:string,
                            departureDate: string, oneWay: boolean, returnDate: string, adults: number, children:number, maxPrice: number){
        setPendingFlightSearch(true);
        setFlightList([]);
        if (originIATA && destinationIATA && departureDate) {
            logSearchTerms(originIATA, destinationIATA);
            searchFlightOffers(
                {
                    originIATA: originIATA,
                    destinationIATA: destinationIATA,
                    departureDate, returnDate, adults, children, maxPrice, oneWay
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