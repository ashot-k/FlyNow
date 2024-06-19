
import Flag from "react-flagkit";
import countryCodes from "../../utils/countryCodes.json";
import {getAirportByIATA} from "../../utils/Utils";
import ArrowRight from "../../static/assets/arrow-right.svg";
import React from "react";
import {SearchSuggestion} from "./SearchSuggestions";

interface UserSearchSuggestionProps {
    suggestion: SearchSuggestion,
    selectSuggestion:(suggestion: SearchSuggestion) => void;
}

export default function UserSearchSuggestion({suggestion, selectSuggestion}: UserSearchSuggestionProps) {
    return (
        <div className={"p-2 px-10 sm:px-5 bg-flyNow-light justify-center items-center rounded-2xl hover:scale-105 shadow-md shadow-black duration-500 transition"}>
            <button className={"flex gap-1 font-bold text-sm justify-center items-center rounded-2xl"}
                    onClick={() => selectSuggestion(suggestion)}>
                <Flag className={"size-4"}
                      country={countryCodes.find(row => row.iata === suggestion.originIATA)?.iso}/>
                <span>{getAirportByIATA(suggestion.originIATA)?.city}</span>
                <img src={ArrowRight} className={"size-5"} alt={''}/>
                <Flag className={"size-4"}
                      country={countryCodes.find(row => row.iata === suggestion.destinationIATA)?.iso}/>
                <span>{getAirportByIATA(suggestion.destinationIATA)?.city}</span>
            </button>
        </div>
    )
}