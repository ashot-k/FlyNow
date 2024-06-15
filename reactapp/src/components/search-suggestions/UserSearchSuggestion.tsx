import Button from "react-bootstrap/Button";
import Flag from "react-flagkit";
import countryCodes from "../../utils/countryCodes.json";
import {getAirportByIATA} from "../../utils/Utils";
import ArrowRight from "../../static/assets/arrow-right.svg";
import React from "react";
import {SearchSuggestion} from "./SearchSuggestions";
import '../../static/SearchSuggestions.css'

interface UserSearchSuggestionProps {
    suggestion: SearchSuggestion,
    selectSuggestion:(suggestion: SearchSuggestion) => void;
}

export default function UserSearchSuggestion({suggestion, selectSuggestion}: UserSearchSuggestionProps) {
    return (
        <div className={"search-suggestion element-shadow flex-column justify-content-center align-items-center"}>
            <Button variant={"btn"}
                    className={"d-flex gap-1 pe-2 p-1 ps-2 fw-bold fs-6 justify-content-center align-items-center rounded-2"}
                    onClick={() => selectSuggestion(suggestion)}>
                <Flag size={16} className={"flag-img"}
                      country={countryCodes.find(row => row.iata === suggestion.originIATA)?.iso}/>
                <span>{getAirportByIATA(suggestion.originIATA)?.city}</span>
                <img src={ArrowRight} width={'16px'} alt={''}/>
                <Flag size={16} className={"flag-img"}
                      country={countryCodes.find(row => row.iata === suggestion.destinationIATA)?.iso}/>
                <span>{getAirportByIATA(suggestion.destinationIATA)?.city}</span>
            </Button>
        </div>
    )
}