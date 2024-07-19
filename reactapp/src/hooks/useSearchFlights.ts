import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchFlightOffers } from "../services/AmadeusAPIService";
import { searchFlightOffersDummy } from "../services/DummyAmadeusService";
import { devMode } from "../utils/Utils";

export default function useSearchFlights() {
    const [pendingFlightSearch, setPendingFlightSearch] = useState<boolean>(false);
    const [flightList, setFlightList] = useState<any[]>();
    const [dictionaries, setDictionaries] = useState<any>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState<string>();

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
        searchParams.set("maxPrice", String(maxPrice));
        const currency = localStorage.getItem("currency")?.split("/")[1];
        setSearchParams(searchParams);
        setPendingFlightSearch(true);
        setFlightList([]);
        if (originIATA && destinationIATA && departureDate) {
            //logSearchTerms(originIATA, destinationIATA);
            if (devMode()) {
                searchFlightOffersDummy(destinationIATA)
                    .then((response) => {
                        setFlightList(response.data.data);
                        setDictionaries(response.data.dictionaries);
                    })
                    .catch((e: Error) => {
                        setError(e.message);
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
                    currencyCode: currency ? currency : "",
                })
                    .then((response) => {
                        setFlightList(response.data.data);
                        setDictionaries(response.data.dictionaries);
                    })
                    .catch((e) => {
                        console.error(e);
                    })
                    .finally(() => {
                        setPendingFlightSearch(false);
                    });
            }
        }
    }

    return {
        searchFlights,
        error,
        flightList,
        setFlightList,
        dictionaries,
        setDictionaries,
        pendingFlightSearch,
    };
}
