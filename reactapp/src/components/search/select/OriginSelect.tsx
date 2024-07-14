import React from "react";
import AsyncSelect from "react-select/async";
import { locationSelectStyles, option, originControl, singleValue } from "./LocationSelectProps";
import { Route } from "../FlightSearch";
import { SingleValue } from "react-select";

interface OriginSelectProps {
    isLoading: boolean;
    loadOptions: (inputValue: string) => Promise<Route[]> | undefined;
    value: Route | undefined;
    options: Route[];
    onChange: (option: SingleValue<Route> | undefined) => void;
}

export default function OriginSelect({ isLoading, loadOptions, value, options, onChange }: OriginSelectProps) {
    return (
        <AsyncSelect
            placeholder={"Choose origin"}
            name={"origin-selection"}
            className={"w-full text-lg sm:w-10/12"}
            isLoading={isLoading}
            defaultOptions={options}
            loadOptions={loadOptions}
            value={value}
            onChange={onChange}
            styles={locationSelectStyles}
            components={{
                Control: originControl,
                Option: option,
                SingleValue: singleValue,
            }}
        />
    );
}
