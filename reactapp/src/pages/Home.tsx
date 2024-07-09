import React, { useEffect, useState } from "react";
import FlightSearch, { FlightSearchData } from "../components/search/FlightSearch";
import { userArea } from "../utils/Utils";
import FlightSearchResults from "../components/search/FlightSearchResults";
import LoadingScreen from "../components/loader/LoadingScreen";
import { loadingScreenClass } from "../components/loader/LoadingScreenClass";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HomePageProps {
    className?: string;
}

export default function Home({ className }: HomePageProps) {
    const transitionsDuration = 500;
    const [searchResults, setSearchResults] = useState<FlightSearchData | undefined>(undefined);

    const [originSuggestion, setOriginSuggestion] = useState<string>(userArea);
    const [destinationSuggestion, setDestinationSuggestion] = useState<string>();
    const [toggle, setToggle] = useState(true);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        if (searchResults && !searchResults?.pending) {
            setTransitioning(true);
        }
    }, [searchResults]);
    useEffect(() => {
        if (transitioning)
            setTimeout(() => {
                setToggle(!toggle);
                setTransitioning(false);
            }, transitionsDuration);
    }, [transitioning]);

    const handleFlightSearch = (searchData: FlightSearchData) => {
        setSearchResults(searchData);
    };
    const handleClick = () => {
        setTransitioning(true);
    };
    return (
        <div className={className}>
            <div
                className={
                    "flex w-full flex-col items-center justify-start" +
                    (transitioning ? " opacity-0 transition-opacity duration-500" : "") +
                    (!toggle ? " hidden" : "")
                }>
                <FlightSearch
                    className={
                        "flex w-full animate-fadeIn flex-col items-center justify-center bg-flyNow-component p-5 text-lg font-normal shadow-sm shadow-black sm:mt-32 sm:w-11/12 sm:flex-grow-0 sm:gap-8 sm:rounded-xl sm:p-12 sm:pb-8 lg:w-5/6 xl:w-2/3"
                    }
                    onSearch={handleFlightSearch}
                    preloadedOriginIATA={originSuggestion}
                    preloadedDestinationIATA={destinationSuggestion ? destinationSuggestion : ""}
                />
            </div>
            <div
                className={
                    "flex w-full flex-col items-center justify-start" +
                    (transitioning ? " opacity-0 transition-opacity duration-500" : "") +
                    (toggle ? " hidden" : "")
                }>
                <FlightSearchResults
                    className={
                        "flex w-full animate-fadeIn flex-col items-center justify-center gap-5 bg-black bg-opacity-90"
                    }
                    searchResults={searchResults}
                />
                {searchResults && (
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
            <LoadingScreen show={searchResults?.pending} className={loadingScreenClass} />
        </div>
    );
}
