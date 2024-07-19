import SearchInfoHeader from "./SearchInfoHeader";
import FlightListFilters from "../flight/FlightListFilters";
import React, { useEffect, useState } from "react";
import { SearchParams } from "./FlightSearch";
import { Flight } from "../flight/FlightCard";
import { DictionariesContext } from "../../context";
import { DestinationActivities } from "../search-suggestions/DestinationActivities";
import { FlightList } from "../flight/FlightList";

export interface SearchResults {
    flightList: any;
    dictionaries: any;
    searchParams: SearchParams;
}

interface FlightSearchResultProps {
    searchResults: SearchResults | undefined;
    className?: string;
}

export default function FlightSearchResults({ searchResults, className }: FlightSearchResultProps) {
    const [flightList, setFlightList] = useState(searchResults?.flightList);
    const [displayedFlights, setDisplayedFlights] = useState(searchResults?.flightList);
    const error = "error";
    useEffect(() => {
        setFlightList(searchResults?.flightList);
    }, [searchResults]);

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
            {searchResults ? (
                <div className={className}>
                    <DictionariesContext.Provider value={searchResults.dictionaries}>
                        <SearchInfoHeader searchInfo={searchResults.searchParams} />
                    </DictionariesContext.Provider>
                    <DestinationActivities
                        className={
                            "flex w-full animate-fadeIn flex-col items-center justify-center bg-transparent bg-opacity-95 sm:w-5/6"
                        }
                        destinationIATA={searchResults.searchParams.destination}
                    />
                    <div
                        className={
                            "flex w-full flex-col items-center justify-center sm:w-5/6 sm:flex-row sm:items-start sm:justify-start"
                        }>
                        <FlightListFilters
                            className={"hidden w-full flex-col gap-5 sm:flex sm:w-1/4"}
                            flightList={flightList}
                            dictionaries={searchResults.dictionaries}
                            filter={setFilters}
                        />
                        {flightList && flightList.length > 0 ? (
                            <>
                                <DictionariesContext.Provider value={searchResults.dictionaries}>
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
        </>
    );
}
