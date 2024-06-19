import SearchInfoHeader from "./SearchInfoHeader";
import FlightListFilters from "./FlightListFilters";
import {FlightList} from "./FlightList";
import LoadingAnimation from "../utils/LoadingAnimation";
import React, {useEffect, useState} from "react";
import {FlightSearchData} from "./FlightSearch";
import {Flight} from "./FlightCard";
import {DestinationActivities} from "./search-suggestions/DestinationActivities";


interface FlightSearchResultProps {
    searchResults: FlightSearchData | undefined;
    className?: string
}

export default function FlightSearchResults({searchResults}: FlightSearchResultProps) {
    const [filteredList, setFilteredList] = useState<Flight[]>();

    const setFilters = (filteredFlightList: Flight[]) => {
        setFilteredList(filteredFlightList);
    }
    useEffect(() => {
        setFilteredList(searchResults?.flightList);
    }, [searchResults]);

    return (
        <>
            {searchResults ? !searchResults.pending ? <>
            {searchResults.flightList.length > 0 && <SearchInfoHeader {...searchResults?.searchInfo} children={0}/>}
                <div className={"w-full flex flex-col justify-center items-center gap-4"}>
                    {/*<DestinationActivities dest={searchResults.searchInfo.destination.iataCode} className={"w-50"}/>*/}
                    <div className={"w-full sm:w-4/6 flex-col sm:flex-row flex justify-center items-center sm:items-start sm:justify-start"}>
                        {searchResults.flightList.length > 0 &&
                            <FlightListFilters className={"w-full p-4 sm:w-1/4 bg-flyNow-component shadow-lg shadow-black"}
                                               flightList={searchResults.flightList}
                                               dictionaries={searchResults.dictionaries}
                                               filter={setFilters}/>}
                        {(filteredList && filteredList.length > 0 &&
                            <FlightList className={"w-full  mt-8 sm:mt-0 sm:w-1/2 flex flex-col flex-wrap justify-center items-center sm:items-center gap-5"} flightList={filteredList} dictionaries={searchResults.dictionaries}/>
                        )}
                    </div>
                </div>
            </> : <LoadingAnimation width={"25%"} height={"25%"}/> : <></>}
        </>
    )
}