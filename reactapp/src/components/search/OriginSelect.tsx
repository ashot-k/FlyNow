import React from "react";
import AsyncSelect from "react-select/async";
import { locationSelectStyles, option, originControl, singleValue } from "./select-props/LocationSelectProps";
import { RouteInfo } from "./FlightSearch";
import { SingleValue } from "react-select";

interface OriginSelectProps {
    isLoading: boolean;
    loadOptions: (inputValue: string) => Promise<RouteInfo[]> | undefined;
    value: RouteInfo | undefined;
    defaultOptions: RouteInfo[];
    onChange: (option: SingleValue<RouteInfo> | undefined) => void;
    className?: string;
}

export default function OriginSelect({
    isLoading,
    loadOptions,
    defaultOptions,
    value,
    onChange,
    className,
}: OriginSelectProps) {
    return (
        <AsyncSelect
            placeholder={"Choose origin"}
            name={"origin-selection"}
            className={className}
            isLoading={isLoading}
            loadOptions={loadOptions}
            defaultOptions={defaultOptions}
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
