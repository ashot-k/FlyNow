import { components, ControlProps, OptionProps, SingleValueProps } from "react-select";
import { CurrencyOption } from "../../CurrencySelect";
import Flag from "react-flagkit";
import React from "react";
import { Route } from "../FlightSearch";

export const option = ({ innerProps, label, data }: OptionProps<CurrencyOption, false>) => (
    <div
        className={
            "flex cursor-pointer gap-2 px-2 py-1 odd:bg-flyNow-odd-option even:bg-flyNow-component hover:bg-flyNow-light"
        }
        {...innerProps}>
        <Flag className={"size-6"} country={data.countryCode} />
        <span>
            {data.currencyCode} - {data.symbol}
        </span>
    </div>
);
export const control = ({ children, ...props }: ControlProps<CurrencyOption>) => {
    return (
        <components.Control {...props}>
            {/*<label htmlFor={"currency-select"} className={"absolute -top-2 left-6 px-2"}>
                Currency
            </label>*/}

            {children}
        </components.Control>
    );
};
export const singleValue = ({ data, children, ...props }: SingleValueProps<CurrencyOption>) => {
    return (
        <components.SingleValue
            data={data}
            className={"flex cursor-pointer items-center gap-2 bg-transparent"}
            {...props}>
            <Flag className={"size-6"} country={data.countryCode} />
            <span>
                {data.currencyCode} - {data.symbol}
            </span>
        </components.SingleValue>
    );
};

const textColor = "white";

export const CurrencySelectStyles = {
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
        padding: "0.25rem 0.2rem",
        borderRadius: "0.5rem",
    }),
    menu: (provided: any) => ({
        ...provided,
        background: "#242529",
        padding: "0",
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
