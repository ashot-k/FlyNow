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
            <FlightSearch className={"flex flex-col items-center sm:gap-8 text-2xl font-normal rounded-lg sm:outline sm:outline-2 sm:outline-flyNow-light bg-flyNow-component mt-12 sm:rounded-xl pt-10 px-5 pb-6 sm:mt-36 w-full sm:w-11/12 lg:w-4/6 sm:px-20 sm:py-20 sm:pb-8 shadow-lg shadow-black"}
                          onSearch={handleFlightSearch} originIATA={originSuggestion}
                          destinationIATA={destinationSuggestion ? destinationSuggestion : ''}/>
            <FlightSearchResults searchResults={searchResults}/>
        </div>
    );
}