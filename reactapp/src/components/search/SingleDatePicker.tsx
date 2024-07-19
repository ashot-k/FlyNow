import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import "./day-names.css";
import {
    avgPricedDatesStyle,
    behindCurrentDateStyle,
    cheapestDatesStyle,
    customSingleInput,
    dateContainerStyle,
    defaultDateStyle,
    expensiveDatesStyle,
    selectedDateStyle,
} from "./DatePickerProps";
import { detectMob, devMode, normalizeDate } from "../../utils/Utils";
import { searchCheapestDates, searchCheapestDatesRoundTrip } from "../../services/DummyAmadeusService";
import { isSameDate } from "../../utils/Time";

interface SingleDatePickerProps {
    className?: string;
    value: (date: Date | null) => void;
    origin?: string;
    destination?: string;
}

interface oneWayFlightDate {
    type: string;
    origin: string;
    destination: string;
    departureDate: string;
    price: {
        total: string;
    };
}
export default function SingleDatePicker({ className, value, origin, destination }: SingleDatePickerProps) {
    const selectedDate = useRef<Date | undefined | null>();
    const minDate = new Date();
    const [dateCosts, setDateCosts] = useState<oneWayFlightDate[]>();
    const [currency, setCurrency] = useState<string>("");

    const onChange = (date: Date | null) => {
        selectedDate.current = date;
        value(date);
    };
    useEffect(() => {
        if (origin && destination) {
            if (devMode()) {
                searchCheapestDates().then((response) => {
                    let date_LowestPricePair: { departureDate: { [price: string]: string } };
                    const costs = response.data.data;
                    costs.reduce((prev: any, curr: oneWayFlightDate) => {
                        if (prev.departureDate === undefined) {
                            prev.departureDate = [];
                        } else if (prev.departureDate[curr.departureDate] === undefined) {
                            prev.departureDate[curr.departureDate] = curr.price.total;
                        } else if (prev.departureDate[curr.departureDate]) {
                            if (prev.departureDate[curr.departureDate] > curr.price.total) {
                                prev.departureDate[curr.departureDate] = curr.price.total;
                            }
                        } else {
                            prev.departureDate[curr.departureDate] = curr.price.total;
                        }
                        date_LowestPricePair = prev;
                        return prev;
                    }, {});
                    const filteredDates = costs.filter((fDate: oneWayFlightDate) => {
                        if (fDate.price.total === date_LowestPricePair?.departureDate[fDate.departureDate]) {
                            return fDate;
                        }
                    });
                    const mapFromDates = new Map<string, oneWayFlightDate>(
                        filteredDates.map((d: oneWayFlightDate) => [d.departureDate, d]),
                    );
                    setDateCosts(Array.from(mapFromDates.values()));
                    const countryData = require("country-data");
                    setCurrency(countryData.currencies[response.data.meta.currency].symbol);
                });
            } else {
            }
        }
    }, [origin, destination]);

    const findDepartureDatePrices = (date: Date) => {
        return dateCosts?.filter((fDate: oneWayFlightDate) => isSameDate(new Date(fDate.departureDate), date));
    };
    const memoizedFindDepartureDatePrices = useMemo(() => {
        return (date: Date) => {
            return dateCosts?.filter((fDate: oneWayFlightDate) => isSameDate(new Date(fDate.departureDate), date));
        };
    }, [dateCosts]);

    const findMaxDepartPrice = useMemo(() => {
        return dateCosts?.reduce(function (prev: oneWayFlightDate, curr: oneWayFlightDate) {
            return parseFloat(prev.price.total) < parseFloat(curr.price.total) ? curr : prev;
        });
    }, [dateCosts]);
    const findMinDepartPrice = useMemo(() => {
        return dateCosts?.reduce(function (prev: oneWayFlightDate, curr: oneWayFlightDate) {
            return parseFloat(prev.price.total) > parseFloat(curr.price.total) ? curr : prev;
        });
    }, [dateCosts]);

    const renderDayContents = (day: number, date: Date) => {
        if (!date) return "";
        let dayNameClass = defaultDateStyle;
        let cost = undefined;

        const min = normalizeDate(minDate);
        const checkDate = normalizeDate(date);
        const checkDateTime = checkDate.getTime();
        const selected = selectedDate.current;
        selected?.setHours(0, 0, 0, 0);

        if (checkDateTime < min.getTime()) {
            dayNameClass = behindCurrentDateStyle;
        } else if (checkDateTime === selected?.getTime()) {
            const departurePrices = memoizedFindDepartureDatePrices(date);
            if (departurePrices && departurePrices.length > 0) {
                cost = departurePrices.reduce(function (prev: oneWayFlightDate, curr: oneWayFlightDate) {
                    return parseFloat(prev.price.total) > parseFloat(curr.price.total) ? curr : prev;
                }).price.total;
            }
            dayNameClass = selectedDateStyle;
        } else if (dateCosts) {
            const min = findMinDepartPrice;
            const max = findMaxDepartPrice;
            const departurePrices = memoizedFindDepartureDatePrices(date);
            if (min && isSameDate(new Date(min?.departureDate), date)) {
                cost = min.price.total;
                dayNameClass = cheapestDatesStyle;
            } else if (max && isSameDate(new Date(max?.departureDate), date)) {
                cost = max.price.total;
                dayNameClass = expensiveDatesStyle;
            } else if (departurePrices && departurePrices.length > 0) {
                cost = departurePrices[0].price.total;
                dayNameClass = avgPricedDatesStyle;
            }
        }

        return (
            <span className={dayNameClass}>
                <span className={cost ? "!top-0 !flex -translate-y-2" : "!top-0 !flex"}>{date.getDate()}</span>
                {cost && (
                    <span className={"absolute bottom-2 text-sm font-extrabold"}>
                        {parseInt(cost)}
                        {currency}
                    </span>
                )}
            </span>
        );
    };

    return (
        <div className={className}>
            <DatePicker
                customInput={customSingleInput("Departure", selectedDate.current)}
                dateFormat={"d/MM/YYYY"}
                minDate={minDate}
                className={
                    "w-full rounded-lg border-black bg-transparent p-3 text-center text-sm outline outline-1 outline-gray-500"
                }
                renderDayContents={renderDayContents}
                onChange={onChange}
                shouldCloseOnSelect={false}
                dayClassName={(date: Date) => dateContainerStyle}
                focusSelectedMonth
                popperClassName={"!flex !top-0 !bg-black"}
                calendarClassName={
                    "!absolute justify-center !border-0 py-2 px-4 !flex top-16 sm:top-64 sm:!flex-row !flex-col !bg-flyNow-component !bg-opacity-85"
                }
                weekDayClassName={() => "!bg-transparent  text-lg !text-white"}
                monthsShown={detectMob() ? 1 : 2}
                withPortal
                selected={selectedDate.current}
                renderCustomHeader={({ monthDate, customHeaderCount, decreaseMonth, increaseMonth }) => (
                    <div>
                        <button
                            aria-label="Previous Month"
                            className={"react-datepicker__navigation react-datepicker__navigation--previous"}
                            style={customHeaderCount === 1 && !detectMob() ? { visibility: "hidden" } : undefined}
                            onClick={decreaseMonth}>
                            <span
                                className={
                                    "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                                }>
                                {"<"}
                            </span>
                        </button>
                        <span className="react-datepicker__current-month !text-white">
                            {monthDate.toLocaleString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                        <button
                            aria-label="Next Month"
                            className={"react-datepicker__navigation react-datepicker__navigation--next"}
                            style={customHeaderCount === 0 && !detectMob() ? { visibility: "hidden" } : undefined}
                            onClick={increaseMonth}>
                            <span
                                className={"react-datepicker__navigation-icon react-datepicker__navigation-icon--next"}>
                                {">"}
                            </span>
                        </button>
                    </div>
                )}
            />
        </div>
    );
}
