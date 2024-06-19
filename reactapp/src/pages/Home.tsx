import React, {useState} from "react";
import FlightSearch, {FlightSearchData} from "../components/FlightSearch";
import {userArea} from "../utils/Utils";
import {SearchSuggestion} from "../components/search-suggestions/SearchSuggestions";
import FlightSearchResults from "../components/FlightSearchResults";
interface HomePageProps{
    className?: string;
}
export default function Home({className}: HomePageProps) {
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
        <div className={className}>
            <FlightSearch className={"flex flex-col gap-2 text-2xl font-normal rounded-lg sm:outline sm:outline-3 sm:outline-flyNow-light bg-flyNow-component mt-24 sm:rounded-xl pt-10 px-6 pb-6 sm:mt-44 w-full sm:w-11/12 lg:w-4/6 sm:px-12 sm:pt-12 sm:pb-8  shadow-lg shadow-black "}
                          onSearch={handleFlightSearch} originIATA={originSuggestion}
                          destinationIATA={destinationSuggestion ? destinationSuggestion : ''}/>
            <FlightSearchResults searchResults={searchResults}/>
        </div>
    );
}