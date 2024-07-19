import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { userArea } from "../../utils/Utils";
import useSearchFlights from "../../hooks/useSearchFlights";
import FlightSearch, { SearchParams } from "./FlightSearch";
import FlightSearchResults, { SearchResults } from "./FlightSearchResults";
import { useSearchParams } from "react-router-dom";
import { loadingScreenClass } from "../loader/LoadingScreenClass";
import LoadingScreen from "../loader/LoadingScreen";

interface SearchProps {
    className?: string;
}

export default function Search({ className }: SearchProps) {
    const transitionsDuration = 200;
    const transitionClass = " " + "transition-opacity opacity-0  duration-" + transitionsDuration;
    const [transitioning, setTransitioning] = useState(false);
    const toggle = useRef<boolean>(true);
    const loading = useRef(false);

    const [flightSearchParams, setFlightSearchParams] = useState<SearchParams | undefined>(undefined);
    const [searchResults, setSearchResults] = useState<SearchResults>();
    const [originSuggestion, setOriginSuggestion] = useState<string>(userArea);

    const [searchParams, setSearchParams] = useSearchParams();
    const { searchFlights, error, pendingFlightSearch, flightList, dictionaries } = useSearchFlights();

    useEffect(() => {
        function search() {
            const params = flightSearchParams;
            if (params) {
                searchFlights(
                    params.origin,
                    params.destination,
                    params.departureDate,
                    params.returnDate,
                    params.adults,
                    params.children,
                    params.maxPrice,
                );
            }
        }
        if (flightSearchParams) {
            loading.current = true;
            search();
            if (toggle.current) {
                setTransitioning(true);
            }
        }
    }, [flightSearchParams]);

    useEffect(() => {
        const originParam = searchParams.get("origin");
        const destParam = searchParams.get("dest");
        const departureDateParam = searchParams.get("depDate");
        const returnDate = searchParams.get("returnDate");
        const adults = searchParams.get("adults");
        const children = searchParams.get("children");
        const maxPrice = searchParams.get("maxPrice");
        if (originParam && destParam && departureDateParam) {
            setFlightSearchParams({
                origin: originParam,
                destination: destParam,
                adults: adults ? parseInt(adults) : 1,
                children: children ? parseInt(children) : 0,
                departureDate: departureDateParam,
                returnDate: returnDate ? returnDate : "",
                maxPrice: maxPrice ? parseInt(maxPrice) : 1000,
            });
        }
    }, [searchParams]);

    useEffect(() => {
        if (flightList && dictionaries && flightSearchParams && !pendingFlightSearch) {
            setSearchResults({
                flightList: flightList,
                dictionaries: dictionaries,
                searchParams: flightSearchParams,
            });
        }
    }, [flightList, dictionaries]);

    useEffect(() => {
        if (!pendingFlightSearch && !transitioning) {
            loading.current = false;
        }
    }, [searchResults, pendingFlightSearch, transitioning]);

    useEffect(() => {
        if (transitioning) {
            const timer = setTimeout(() => {
                toggle.current = !toggle.current;
                setTransitioning(false);
            }, transitionsDuration);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [transitioning]);

    const handleFlightSearch = (params: SearchParams) => {
        setFlightSearchParams(params);
    };
    const handleClick = () => {
        setTransitioning(true);
    };

    return (
        <div className={className}>
            <div
                className={
                    "flex w-full flex-col items-center justify-start" +
                    (transitioning ? transitionClass : "") +
                    (toggle.current ? "" : " hidden")
                }>
                <FlightSearch
                    className={
                        "flex w-full animate-fadeIn flex-col items-center justify-center bg-flyNow-component p-5 text-lg font-normal shadow-sm shadow-black sm:w-full sm:flex-grow-0 sm:gap-8 sm:px-5 sm:py-12 sm:pb-8 lg:mt-32 lg:w-11/12 lg:rounded-xl lg:p-16 lg:pb-8 xl:w-2/3"
                    }
                    onSearch={handleFlightSearch}
                    preloadedOriginIATA={originSuggestion}
                />
            </div>
            <div
                className={
                    "flex w-full flex-col items-center justify-start" +
                    (transitioning ? transitionClass : "") +
                    (toggle.current ? " hidden" : "")
                }>
                {searchResults && !pendingFlightSearch && (
                    <FlightSearchResults
                        className={
                            "flex min-h-screen w-full animate-fadeIn flex-col items-center justify-center gap-5 bg-black bg-opacity-90"
                        }
                        searchResults={searchResults}
                    />
                )}
                <button
                    onClick={handleClick}
                    className={
                        "fixed bottom-20 right-2 z-30 hidden items-center gap-1.5 rounded-3xl bg-flyNow-secondary bg-opacity-95 px-4 py-3.5 text-lg shadow-md shadow-black transition-colors duration-300 hover:bg-flyNow-light sm:bottom-24 sm:right-1/4 sm:flex sm:px-6 sm:py-2"
                    }>
                    <FontAwesomeIcon icon={"search"} className={"size-5"} />
                    Search
                </button>
                <button
                    onClick={handleClick}
                    className={
                        "fixed bottom-20 right-3 z-30 flex items-center rounded-full bg-flyNow-secondary bg-opacity-95 p-6 text-lg shadow-md shadow-black transition-colors duration-300 hover:bg-flyNow-light sm:hidden"
                    }>
                    <FontAwesomeIcon icon={"search"} className={"size-7"} />
                </button>
            </div>

            {<LoadingScreen show={loading.current} className={loadingScreenClass} />}
        </div>
    );
}
