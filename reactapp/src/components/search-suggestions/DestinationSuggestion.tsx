import Flag from "react-flagkit";
import countryCodes from "../../dev-data/mock_json/countryCodes.json";
import { getAirportByIATA } from "../../utils/Utils";
import React, { useContext } from "react";
import { SearchSuggestion } from "./SearchSuggestions";
import { userArea } from "../../context";

interface DestinationSuggestionProps {
    destIATA: string;
    selectSuggestion: (suggestion: SearchSuggestion) => void;
    type: "short" | "full";
}

export default function DestinationSuggestion({ destIATA, selectSuggestion, type }: DestinationSuggestionProps) {
    const userOriginIATA = useContext(userArea);

    return (
        <div
            className={
                "search-suggestion element-shadow d-flex flex-column justify-content-center align-items-center flex-sm-shrink-0"
            }>
            <button
                className={
                    "d-flex fw-bold fs-6 justify-content-center align-items-center rounded-2 gap-2 p-1 pe-2 ps-2"
                }
                onClick={() =>
                    selectSuggestion({
                        originIATA: userOriginIATA,
                        destinationIATA: destIATA,
                    })
                }>
                <Flag
                    className={"flag-img"}
                    size={20}
                    country={countryCodes.find((row) => row.iata === destIATA)?.iso}
                />
                {type === "short" && getAirportByIATA(destIATA)?.city}
                {type === "full" && getAirportByIATA(destIATA)?.city + ", " + getAirportByIATA(destIATA)?.country}
            </button>
        </div>
    );
}
