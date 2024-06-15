import React, {useState} from "react";
import FlightSearch, {FlightSearchData} from "../components/FlightSearch";
import SearchInfoHeader from "../components/SearchInfoHeader";
import {FlightList} from "../components/FlightList";
import FlightListFilters from "../components/FlightListFilters";
import {Flight} from "../components/FlightCard";
import {userArea} from "../utils/Utils";
import SearchSuggestions, {SearchSuggestion} from "../components/search-suggestions/SearchSuggestions";
import LoadingAnimation from "../utils/LoadingAnimation";

function Home() {
    const [searchResults, setSearchResults] = useState<FlightSearchData>();
    //hardcoded userArea due to AmadeusAPI test version limitations
    const [originSuggestion, setOriginSuggestion] = useState<string>(userArea);
    const [destinationSuggestion, setDestinationSuggestion] = useState<string>();
    const [flightList, setFlightList] = useState<Flight[]>();
    const [filteredList, setFilteredList] = useState<Flight[]>()

    const handleFlightSearch = (searchData: FlightSearchData) => {
        setSearchResults(searchData);
        setFlightList(searchData.flightList);
        setFilteredList(searchData.flightList);
    }
    const handleSelectedSuggestion = (suggestion: SearchSuggestion) => {
        setOriginSuggestion(suggestion.originIATA)
        setDestinationSuggestion(suggestion.destinationIATA);
    }

    const setFilters = (filteredFlightList: Flight[]) => {
        setFilteredList(filteredFlightList);
    }

    return (
        <div className="d-flex w-100 p-1 flex-column gap-3 align-items-center">
            <FlightSearch onSearch={handleFlightSearch} originiataCode={originSuggestion}
                          destinationiataCode={destinationSuggestion ? destinationSuggestion : ''}/>
           {/* <SearchSuggestions getSearchSuggestion={handleSelectedSuggestion}/>*/}
            {searchResults && searchResults.flightList.length > 0 && <SearchInfoHeader {...searchResults?.searchInfo}/>}
            {searchResults ? !searchResults.pending ? <>
                <div className={"w-100 d-flex flex-row justify-content-center"}>
                    <div className={"flight-search-results d-flex  justify-content-center gap-4"}>
                        <div className={"flight-list-filters-container"}>
                            {!searchResults.pending && searchResults.flightList.length > 0 &&
                                <FlightListFilters flightList={searchResults.flightList}
                                                   dictionaries={searchResults.dictionaries}
                                                   filter={setFilters}/>}
                        </div>
                        {(filteredList && filteredList?.length > 0 ?
                            <FlightList flightList={filteredList}
                                        dictionaries={searchResults.dictionaries}/> :
                            <div className={"flight-list"}></div>)}
                        <div className={"w-25"}>
                            {/*  <DestinationActivities dest={searchResults.searchInfo.destination.iataCode}/>*/}
                        </div>
                    </div>
                </div>
            </> : <LoadingAnimation width={"25%"} height={"25%"}/> : <></>}
        </div>
    );
}

export default Home;