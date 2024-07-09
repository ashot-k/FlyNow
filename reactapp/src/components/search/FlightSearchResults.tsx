import SearchInfoHeader from "./SearchInfoHeader";
import FlightListFilters from "../flight/FlightListFilters";
import { FlightList } from "../flight/FlightList";
import React, { useEffect, useRef, useState } from "react";
import { FlightSearchData } from "./FlightSearch";
import { Flight } from "../flight/FlightCard";
import { DictionariesContext } from "../../context";
import { DestinationActivities } from "../search-suggestions/DestinationActivities";

interface FlightSearchResultProps {
    searchResults: FlightSearchData | undefined;
    className?: string;
}

export default function FlightSearchResults({ searchResults, className }: FlightSearchResultProps) {
    const [flightList, setFlightList] = useState<Flight[]>();
    const setFilters = (filteredFlightList: Flight[]) => {
        setFlightList(filteredFlightList);
    };

    useEffect(() => {
        setFlightList(searchResults?.flightList);
    }, [searchResults]);

    return (
        <>
            {searchResults && !searchResults.pending ? (
                <div className={className}>
                    {searchResults.flightList.length > 0 && <SearchInfoHeader searchInfo={searchResults?.searchInfo} />}
                    <DestinationActivities
                        className={
                            "flex w-full animate-fadeIn flex-col items-center justify-center bg-transparent bg-opacity-95 sm:w-5/6"
                        }
                        destinationIATA={searchResults.searchInfo.destination.iataCode}
                    />
                    <div
                        className={
                            "flex w-full flex-col items-center justify-center sm:w-5/6 sm:flex-row sm:items-start sm:justify-start"
                        }>
                        {searchResults.flightList.length > 0 && (
                            <FlightListFilters
                                className={"hidden w-full flex-col gap-5 sm:flex sm:w-1/4"}
                                flightList={searchResults.flightList}
                                dictionaries={searchResults.dictionaries}
                                filter={setFilters}
                            />
                        )}
                        {flightList && flightList.length > 0 && (
                            <>
                                <DictionariesContext.Provider value={searchResults.dictionaries}>
                                    <FlightList
                                        className={
                                            "mt-8 flex w-full flex-col flex-wrap items-center justify-center gap-5 sm:mt-0 sm:w-1/2 sm:items-center"
                                        }
                                        flightList={flightList}
                                    />
                                </DictionariesContext.Provider>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
