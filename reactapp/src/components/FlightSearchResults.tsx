import SearchInfoHeader from "./SearchInfoHeader";
import FlightListFilters from "./FlightListFilters";
import { FlightList } from "./FlightList";
import React, { useEffect, useState } from "react";
import { FlightSearchData } from "./FlightSearch";
import { Flight } from "./FlightCard";
import { DictionariesContext } from "../context";
import { DestinationActivities } from "./search-suggestions/DestinationActivities";
import LoadingScreen from "./LoadingScreen";

interface FlightSearchResultProps {
    searchResults: FlightSearchData | undefined;
    className?: string;
}

export default function FlightSearchResults({ searchResults }: FlightSearchResultProps) {
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
                <>
                    {searchResults.flightList.length > 0 && (
                        <SearchInfoHeader {...searchResults?.searchInfo} children={0} />
                    )}
                    <div
                        id={"results"}
                        className={"flex w-full flex-col items-center justify-center gap-5 bg-black bg-opacity-90"}>
                        <DestinationActivities
                            className={
                                "flex w-full flex-col items-center justify-center bg-transparent bg-opacity-95 sm:w-5/6"
                            }
                            dest={searchResults.searchInfo.destination.iataCode}
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
                </>
            ) : (
                <></>
            )}
            {searchResults && (
                <LoadingScreen
                    show={!(flightList && flightList?.length > 0)}
                    className={
                        "absolute top-0 z-20 mt-0 flex hidden h-screen w-full animate-fadeIn flex-col items-center justify-center bg-flyNow-main"
                    }
                    id={"loadingScreen"}
                />
            )}
        </>
    );
}
