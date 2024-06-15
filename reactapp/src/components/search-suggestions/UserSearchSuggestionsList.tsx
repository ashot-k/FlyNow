import React, {useEffect, useState} from "react";
import {getSearchTerms} from "../../services/FlyNowServiceAPI";
import {SearchSuggestion} from "./SearchSuggestions";
import UserSearchSuggestion from "./UserSearchSuggestion";
import pendingSearchIcon from "../../static/assets/infinite-spinner.svg";
import useUserSearchSuggestions from "../../hooks/useUserSearchSuggestions";

interface SearchSuggestionProps {
    onSuggestionSelect: (searchSuggestion: SearchSuggestion) => void;
    className: string;
}

export default function UserSearchSuggestionsList({onSuggestionSelect, className}: SearchSuggestionProps) {
    const {pendingUserSearchSuggestions, userSearchSuggestions} = useUserSearchSuggestions();

    return (
        <> {pendingUserSearchSuggestions ? <img src={pendingSearchIcon} width={"25%"} height={"25%"}
                           alt={""}/> : userSearchSuggestions?.length > 0 ?
            <div className={className}>
                <h4>Search again</h4>
                <div className={"search-suggestion-list d-flex flex-wrap gap-2 overflow-auto"}>
                    {userSearchSuggestions?.map((suggestion, index) => (
                        <UserSearchSuggestion key={index} suggestion={suggestion}
                                              selectSuggestion={onSuggestionSelect}/>
                    ))}
                </div>
            </div> : <></>}
        </>
    )
}