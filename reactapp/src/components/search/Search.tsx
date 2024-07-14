import FlightSearch, { FlightSearchOptions } from "./FlightSearch";
import FlightSearchResults from "./FlightSearchResults";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { userArea } from "../../utils/Utils";

interface SearchProps {
    className?: string;
}

export default function Search({ className }: SearchProps) {
    const transitionsDuration = 200;
    const transitionClass = " " + "transition-opacity opacity-0  duration-" + transitionsDuration;
    const [searchOptions, setSearchOptions] = useState<FlightSearchOptions | undefined>(undefined);
    const [originSuggestion, setOriginSuggestion] = useState<string>(userArea);
    const [toggle, setToggle] = useState(true);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        if (searchOptions) {
            setTransitioning(true);
        }
    }, [searchOptions]);

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

    const handleFlightSearch = (searchData: FlightSearchOptions) => {
        setSearchOptions(searchData);
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
                {!toggle && (
                    <FlightSearchResults
                        className={
                            "flex min-h-screen w-full animate-fadeIn flex-col items-center justify-center gap-5 bg-black bg-opacity-90"
                        }
                        searchOptions={searchOptions}
                    />
                )}
                {searchOptions && (
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
        </div>
    );
}
