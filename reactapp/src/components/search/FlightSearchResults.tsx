import SearchInfoHeader from "./SearchInfoHeader";
import FlightListFilters from "../flight/FlightListFilters";
import { FlightList } from "../flight/FlightList";
import React, { useEffect, useRef, useState } from "react";
import { FlightSearchOptions } from "./FlightSearch";
import { Flight } from "../flight/FlightCard";
import { DictionariesContext } from "../../context";
import { DestinationActivities } from "../search-suggestions/DestinationActivities";
import LoadingScreen from "../loader/LoadingScreen";
import { loadingScreenClass } from "../loader/LoadingScreenClass";
import useSearchFlights from "../../hooks/useSearchFlights";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

interface FlightSearchResultProps {
    searchOptions: FlightSearchOptions | undefined;
    className?: string;
}

export default function FlightSearchResults({ searchOptions, className }: FlightSearchResultProps) {
    const { searchFlights, error, pendingFlightSearch, flightList, dictionaries } = useSearchFlights();
    const [displayedFlights, setDisplayedFlights] = useState(flightList);
    useEffect(() => {
        const options = searchOptions?.searchOptions;
        if (options) {
            searchFlights(
                options.origin.iataCode,
                options.destination.iataCode,
                options.departureDate,
                options.returnDate,
                options.adults,
                options.children,
                options.maxPrice,
            );
        }
        return () => {};
    }, []);

    useEffect(() => {
        if (flightList) {
            setDisplayedFlights(flightList);
        }
    }, [flightList]);
    const setFilters = (filteredFlightList: Flight[]) => {
        setDisplayedFlights(filteredFlightList);
    };

    return (
        <>
            {searchOptions && !pendingFlightSearch ? (
                <div className={className}>
                    {/* <SearchInfoHeader searchInfo={searchOptions?.searchOptions} />*/}
                    <DestinationActivities
                        className={
                            "flex w-full animate-fadeIn flex-col items-center justify-center bg-transparent bg-opacity-95 sm:w-5/6"
                        }
                        destinationIATA={searchOptions.searchOptions.destination.iataCode}
                    />
                    <div
                        className={
                            "flex w-full flex-col items-center justify-center sm:w-5/6 sm:flex-row sm:items-start sm:justify-start"
                        }>
                        <FlightListFilters
                            className={"hidden w-full flex-col gap-5 sm:flex sm:w-1/4"}
                            flightList={flightList}
                            dictionaries={dictionaries}
                            filter={setFilters}
                        />
                        {flightList && flightList.length > 0 ? (
                            <>
                                <DictionariesContext.Provider value={dictionaries}>
                                    <FlightList
                                        className={
                                            "mt-8 flex w-full flex-col flex-wrap items-center justify-center gap-5 sm:mt-0 sm:w-1/2 sm:items-center"
                                        }
                                        flightList={displayedFlights}
                                    />
                                </DictionariesContext.Provider>
                            </>
                        ) : (
                            error && (
                                <div
                                    className={
                                        "mt-8 flex w-full flex-col flex-wrap items-center justify-center gap-5 text-4xl sm:mt-0 sm:w-1/2 sm:items-center"
                                    }>
                                    {error}
                                </div>
                            )
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
            {pendingFlightSearch !== undefined && (
                <LoadingScreen show={pendingFlightSearch} className={loadingScreenClass} />
            )}
        </>
    );
}
