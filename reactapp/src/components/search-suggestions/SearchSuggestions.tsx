
import React, {useContext} from "react";
import {AuthContext} from "../../context";
import UserSearchSuggestionsList from "./UserSearchSuggestionsList";
import '../../static/SearchSuggestions.css'
import PopularDestinationSuggestionsList from "./PopularDestinationSuggestionsList";

export interface SearchSuggestion {
    originIATA: string;
    destinationIATA: string;
}

interface SearchSuggestionsProps {
    getSearchSuggestion: (searchSuggestion: SearchSuggestion) => void;
}

export default function SearchSuggestions({getSearchSuggestion}: SearchSuggestionsProps) {

    const userData = useContext(AuthContext);

    return (
        <div className={"d-flex search-suggestion-main-container mt-3 gap-4 justify-content-center align-content-center"}>
            <PopularDestinationSuggestionsList className={"search-suggestion-container component-box p-3"} period={"2017-01"} onSuggestionSelect={getSearchSuggestion}/>
          {userData?.username && <UserSearchSuggestionsList className={"search-suggestion-container component-box p-2"} onSuggestionSelect={getSearchSuggestion}/>}
        </div>
    )
}