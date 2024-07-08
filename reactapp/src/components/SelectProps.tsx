import { components, ControlProps, OptionProps, SingleValueProps } from "react-select";
import Flag from "react-flagkit";
import React from "react";
import { Route } from "./FlightSearch";

export const option = ({ innerProps, label, data }: OptionProps<Route, false>) => (
    <div
        className={
            "flex cursor-pointer gap-2 px-2 py-2 odd:bg-flyNow-odd-option even:bg-flyNow-even-option hover:bg-flyNow-light"
        }
        {...innerProps}>
        <Flag className={"size-6"} country={data.countryCode} />
        <span className={"text-lg"}>{label}</span>
    </div>
);
export const originControl = ({ children, ...props }: ControlProps<Route>) => {
    return (
        <components.Control {...props}>
            <h3 className={"absolute -top-4 left-6 bg-flyNow-component px-2"}>Origin</h3>
            {children}
        </components.Control>
    );
};
export const destinationControl = ({ children, ...props }: ControlProps<Route>) => {
    return (
        <components.Control {...props}>
            <label htmlFor={"destination-selection"} className={"absolute -top-4 left-6 bg-flyNow-component px-2"}>
                Destination
            </label>
            {children}
        </components.Control>
    );
};

export const singleValue = ({ data, children, ...props }: SingleValueProps<Route>) => {
    return (
        <components.SingleValue
            data={data}
            className={"flex cursor-pointer items-center gap-2 bg-transparent"}
            {...props}>
            <Flag className={"size-6"} country={data.countryCode} />
            <span className={"text-lg"}>{data.label}</span>
        </components.SingleValue>
    );
};

const textColor = "white";

export const locationSelectStyles = {
    control: (provided: any) => ({
        ...provided,
        background: "transparent",
        display: "flex",
        flexWrap: "nowrap",
        color: textColor,
        boxShadow: "none",
        borderColor: "#6b7280",
        "&:hover": {
            borderColor: "#0D7BBA",
        },
        boxSizing: "border-box !important",
        borderWidth: "1px",
        borderStyle: "solid",
        padding: "0.5rem 1.0rem",
        borderRadius: "0.5rem",
    }),
    menu: (provided: any) => ({
        ...provided,
        background: "#242529",
        padding: "0.3rem",
        marginTop: "-0.125rem",
        borderRadius: "2%",
        zIndex: "15",
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: textColor,
    }),
    input: (provided: any) => ({
        ...provided,
        color: textColor,
    }),
};
