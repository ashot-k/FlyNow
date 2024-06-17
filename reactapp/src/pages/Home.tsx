import React, {useState} from "react";
import FlightSearch, {FlightSearchData} from "../components/FlightSearch";
import {userArea} from "../utils/Utils";
import {SearchSuggestion} from "../components/search-suggestions/SearchSuggestions";
import FlightSearchResults from "../components/FlightSearchResults";

export default function Home() {
    const [searchResults, setSearchResults] = useState<FlightSearchData | undefined>(undefined);

    //hardcoded userArea due to AmadeusAPI test version limitations
    const [originSuggestion, setOriginSuggestion] = useState<string>(userArea);
    const [destinationSuggestion, setDestinationSuggestion] = useState<string>();

    const handleFlightSearch = (searchData: FlightSearchData) => {
        setSearchResults(searchData);
    }

    const handleSelectedSuggestion = (suggestion: SearchSuggestion) => {
        setOriginSuggestion(suggestion.originIATA)
        setDestinationSuggestion(suggestion.destinationIATA);
    }

    return (
        <div className="flex w-full h-full flex-col gap-0.5 items-center">
            <FlightSearch className={" mt-20 sm:rounded-xl pt-10 px-6 pb-6 sm:mt-64 w-full sm:w-11/12 lg:w-4/6 sm:px-8 sm:py-8 bg-flyNow-component shadow-lg shadow-black gap-2 flex flex-col rounded-1 text-2xl font-normal"}
                          onSearch={handleFlightSearch} originiataCode={originSuggestion}
                          destinationiataCode={destinationSuggestion ? destinationSuggestion : ''}/>
            <FlightSearchResults searchResults={searchResults}/>
        </div>
    );
}