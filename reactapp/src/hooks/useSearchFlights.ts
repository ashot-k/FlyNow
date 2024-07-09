import { searchFlightOffers } from "../services/AmadeusAPIService";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { logSearchTerms } from "../services/FlyNowServiceAPI";
import { searchFlightOffersDummy } from "../services/DummyAmadeusService";

export default function useSearchFlights() {
    const [noResults, setNoResults] = useState<boolean>(false);
    const [pendingFlightSearch, setPendingFlightSearch] = useState<boolean>(false);
    const [flightList, setFlightList] = useState<any[]>([]);
    const [dictionaries, setDictionaries] = useState<any>();
    const [searchParams, setSearchParams] = useSearchParams();

    function searchFlights(
        originIATA: string,
        destinationIATA: string,
        departureDate: string,
        returnDate?: string,
        adults?: number,
        children?: number,
        maxPrice?: number,
    ) {
        searchParams.set("origin", originIATA);
        searchParams.set("dest", destinationIATA);
        searchParams.set("depDate", departureDate);
        searchParams.set("returnDate", returnDate ? returnDate : "");
        searchParams.set("adults", String(adults));
        searchParams.set("children", String(children));
        searchParams.set("max_price", String(maxPrice));
        setSearchParams(searchParams);
        setPendingFlightSearch(true);
        setFlightList([]);
        if (originIATA && destinationIATA && departureDate) {
            logSearchTerms(originIATA, destinationIATA);
            if (process.env.REACT_APP_DEV_MODE === "true") {
                searchFlightOffersDummy()
                    .then((response) => {
                        setNoResults(true);
                        setFlightList(response.data.data);
                        setDictionaries(response.data.dictionaries);
                    })
                    .catch((e) => {
                        console.error(e);
                        setFlightList([]);
                    })
                    .finally(() => {
                        setPendingFlightSearch(false);
                    });
            } else {
                searchFlightOffers({
                    originIATA: originIATA,
                    destinationIATA: destinationIATA,
                    departureDate: departureDate,
                    returnDate: returnDate,
                    adults: adults ? adults : 1,
                    children: children,
                    maxPrice: maxPrice ? maxPrice : 1000,
                })
                    .then((response) => {
                        setNoResults(true);
                        setFlightList(response.data.data);
                        setDictionaries(response.data.dictionaries);
                    })
                    .catch((e) => {
                        console.error(e);
                        setFlightList([]);
                    })
                    .finally(() => {
                        setPendingFlightSearch(false);
                    });
            }
        }
    }

    return {
        searchFlights,
        flightList,
        setFlightList,
        dictionaries,
        setDictionaries,
        pendingFlightSearch,
        noResults,
    };
}
