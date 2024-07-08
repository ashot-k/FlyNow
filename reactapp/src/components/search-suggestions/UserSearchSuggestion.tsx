import Flag from "react-flagkit";
import countryCodes from "../../utils/countryCodes.json";
import { getAirportByIATA } from "../../utils/Utils";
import ArrowRight from "../../static/assets/arrow-right.svg";
import React from "react";
import { SearchSuggestion } from "./SearchSuggestions";

interface UserSearchSuggestionProps {
    suggestion: SearchSuggestion;
    selectSuggestion: (suggestion: SearchSuggestion) => void;
}

export default function UserSearchSuggestion({ suggestion, selectSuggestion }: UserSearchSuggestionProps) {
    return (
        <div
            className={
                "flex w-fit items-center justify-center rounded-2xl bg-flyNow-light px-10 py-3 shadow-md shadow-black transition duration-500 hover:scale-105 hover:cursor-pointer sm:px-3 sm:py-2"
            }>
            <button
                onClick={() => selectSuggestion(suggestion)}
                className={"flex items-center justify-center gap-1 rounded-2xl text-sm font-bold"}>
                <Flag
                    className={"size-4"}
                    country={countryCodes.find((row) => row.iata === suggestion.originIATA)?.iso}
                />
                <span>{getAirportByIATA(suggestion.originIATA)?.city}</span>
                <img src={ArrowRight} className={"size-5"} alt={""} />
                <Flag
                    className={"size-4"}
                    country={countryCodes.find((row) => row.iata === suggestion.destinationIATA)?.iso}
                />
                <span>{getAirportByIATA(suggestion.destinationIATA)?.city}</span>
            </button>
        </div>
    );
}
