import React from "react";
import Select, { SingleValue } from "react-select";
import { destinationControl, locationSelectStyles, option, singleValue } from "./LocationSelectProps";
import { Route } from "../FlightSearch";
import LoadingAnimation from "../../loader/LoadingAnimation";

interface DestinationSelectProps {
    isLoading: boolean;
    options: Route[];
    value: Route | undefined;
    onChange: (option: SingleValue<Route> | undefined) => void;
}

export default function DestinationSelect({ isLoading, options, value, onChange }: DestinationSelectProps) {
    return isLoading ? (
        <LoadingAnimation className={"size-12 py-1.5"} />
    ) : (
        <Select
            placeholder={"Choose destination"}
            name={"destination-selection"}
            className={"w-full text-lg sm:w-10/12"}
            options={options}
            value={value}
            onChange={onChange}
            styles={locationSelectStyles}
            components={{
                Control: destinationControl,
                Option: option,
                SingleValue: singleValue,
            }}
        />
    );
}
