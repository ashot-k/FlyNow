import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import { userArea } from "../../utils/Utils";
import useSearchFlights from "../../hooks/useSearchFlights";
import FlightSearch, { RouteInfo, SearchParams } from "./FlightSearch";
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
    const [flightSearchParams, setFlightSearchParams] = useState<SearchParams | undefined>(undefined);
    const [searchResults, setSearchResults] = useState<SearchResults>();
    const [originSuggestion, setOriginSuggestion] = useState<string>(userArea);
    const [toggle, setToggle] = useState(true);
    const [transitioning, setTransitioning] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchFlights, error, pendingFlightSearch, flightList, dictionaries } = useSearchFlights();
    useEffect(() => {
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
        } else {
            setToggle(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (flightList && dictionaries && flightSearchParams && !pendingFlightSearch) {
            setTransitioning(true);
            console.log(flightSearchParams);
            setSearchResults({
                flightList: flightList,
                dictionaries: dictionaries,
                searchParams: flightSearchParams,
            });
        }
    }, [flightList, dictionaries]);

    useEffect(() => {
        if (flightSearchParams) {
            setToggle(false);
            setTransitioning(true);
        }
    }, [flightSearchParams]);

    useEffect(() => {
        if (transitioning) {
            const timer = setTimeout(() => {
                setToggle(!toggle);
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
                    (!toggle ? " hidden" : "")
                }>
                <FlightSearch
                    className={
                        "flex w-full animate-fadeIn flex-col items-center justify-center bg-flyNow-component p-5 text-lg font-normal shadow-sm shadow-black sm:mt-32 sm:w-11/12 sm:flex-grow-0 sm:gap-8 sm:rounded-xl sm:p-12 sm:pb-8 lg:w-5/6 xl:w-2/3"
                    }
                    onSearch={handleFlightSearch}
                    preloadedOriginIATA={originSuggestion}
                />
            </div>
            <div
                className={
                    "flex w-full flex-col items-center justify-start" +
                    (transitioning ? transitionClass : "") +
                    (toggle ? " hidden" : "")
                }>
                {!toggle && searchResults && !pendingFlightSearch && (
                    <FlightSearchResults
                        className={
                            "flex min-h-screen w-full animate-fadeIn flex-col items-center justify-center gap-5 bg-black bg-opacity-90"
                        }
                        searchResults={searchResults}
                    />
                )}
                {flightSearchParams && (
                    <button
                        onClick={handleClick}
                        className={
                            "fixed bottom-24 right-2 z-30 flex items-center gap-1.5 text-wrap rounded-3xl bg-flyNow-secondary bg-opacity-95 px-4 py-3.5 text-lg shadow-md shadow-black transition-colors duration-300 hover:bg-flyNow-light sm:right-1/4"
                        }>
                        <FontAwesomeIcon icon={faSearch} className={"size-5"} />
                        Search
                    </button>
                )}
            </div>
            {pendingFlightSearch !== undefined && (
                <LoadingScreen show={pendingFlightSearch} className={loadingScreenClass} />
            )}
        </div>
    );
}
