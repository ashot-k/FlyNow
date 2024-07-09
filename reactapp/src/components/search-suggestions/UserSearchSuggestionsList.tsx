import React from "react";
import { SearchSuggestion } from "./SearchSuggestions";
import UserSearchSuggestion from "./UserSearchSuggestion";
import useUserSearchSuggestions from "../../hooks/useUserSearchSuggestions";
import LoadingAnimation from "../loader/LoadingAnimation";

interface SearchSuggestionProps {
    onSuggestionSelect: (searchSuggestion: SearchSuggestion) => void;
    className?: string;
}

export default function UserSearchSuggestionsList({ onSuggestionSelect, className }: SearchSuggestionProps) {
    const { pendingUserSearchSuggestions, userSearchSuggestions } = useUserSearchSuggestions();

    return (
        <>
            {" "}
            {pendingUserSearchSuggestions ? (
                <LoadingAnimation className={"size-12"} />
            ) : userSearchSuggestions?.length > 0 ? (
                <div className={className}>
                    <label className={"text-lg font-light"}>Search Again</label>
                    <div
                        className={
                            "flex max-h-32 w-full justify-start gap-2 overflow-x-scroll border-t-2 border-t-flyNow-secondary p-4 sm:max-h-20 sm:w-3/4 sm:flex-wrap sm:justify-center sm:overflow-x-auto sm:overflow-y-auto"
                        }>
                        {userSearchSuggestions?.map((suggestion, index) => (
                            <UserSearchSuggestion
                                key={index}
                                suggestion={suggestion}
                                selectSuggestion={onSuggestionSelect}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
