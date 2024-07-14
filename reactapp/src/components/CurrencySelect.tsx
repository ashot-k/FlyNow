import React, { useEffect, useState } from "react";
import Select from "react-select";
import { control, CurrencySelectStyles, option, singleValue } from "./search/select/CurrencySelectProps";
import ct from "countries-and-timezones";
export interface CurrencyOption {
    value: string;
    label: string;
    currencyName: string;
    country: string;
    currencyCode: string;
    countryCode: string;
    symbol: string;
}
interface CurrencySelectProps {
    className?: string;
}
export default function CurrencySelect({ className }: CurrencySelectProps) {
    const [options, setOptions] = useState<CurrencyOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<CurrencyOption>();
    useEffect(() => {
        const countryData = require("country-data");
        const ct = require("countries-and-timezones");
        const currencyCookie = localStorage.getItem("currency");
        const userCountry = ct.getCountryForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        let options: CurrencyOption[] = [];
        for (const countryInfo of countryData.countries.all) {
            const currencyInfo = countryData.currencies[countryInfo.currencies[0]];
            const option = {
                value: countryInfo.alpha2 + "/" + currencyInfo?.code,
                label: countryInfo?.name + " " + currencyInfo?.name,
                country: countryInfo.name,
                countryCode: countryInfo.alpha2,
                currencyName: currencyInfo?.name,
                currencyCode: countryInfo.currencies[0],
                symbol: currencyInfo?.symbol,
            };
            if (currencyCookie) {
                if (option.value === currencyCookie) {
                    options.unshift(option);
                } else {
                    options.push(option);
                }
            } else if (countryInfo.alpha2 === userCountry.id) {
                options.unshift(option);
            } else {
                options.push(option);
            }
        }
        setOptions(options);
        setSelectedOption(options[0]);
    }, []);

    useEffect(() => {
        if (selectedOption) {
            localStorage.setItem("currency", selectedOption.value);
        }
    }, [selectedOption]);
    return (
        <div className={className}>
            <Select
                defaultValue={options ? options[0] : undefined}
                value={selectedOption}
                options={options ? options : undefined}
                onChange={(option) => {
                    if (option) {
                        setSelectedOption(option);
                        window.location.reload();
                    }
                }}
                className={"w-full rounded-xl bg-flyNow-component text-white"}
                styles={CurrencySelectStyles}
                components={{
                    Option: option,
                    Control: control,
                    SingleValue: singleValue,
                }}
                placeholder={"Currency"}
            />
        </div>
    );
}
