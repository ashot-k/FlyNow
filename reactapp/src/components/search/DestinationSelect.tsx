import React from "react";
import Select, { SingleValue } from "react-select";
import { destinationControl, locationSelectStyles, option, singleValue } from "./select-props/LocationSelectProps";
import { RouteInfo } from "./FlightSearch";
import LoadingAnimation from "../loader/LoadingAnimation";

interface DestinationSelectProps {
    isLoading: boolean;
    options: RouteInfo[];
    value: RouteInfo | undefined;
    onChange: (option: SingleValue<RouteInfo> | undefined) => void;
    className?: string;
}

export default function DestinationSelect({ isLoading, options, value, onChange, className }: DestinationSelectProps) {
    return isLoading ? (
        <LoadingAnimation className={"size-12 py-1.5"} />
    ) : (
        <Select
            placeholder={"Choose destination"}
            name={"destination-selection"}
            className={className}
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
