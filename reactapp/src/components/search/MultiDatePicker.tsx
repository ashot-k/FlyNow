import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import "./day-names.css";
import {
    avgPricedDatesStyle,
    behindCurrentDateStyle,
    cheapestDatesStyle,
    customRangeInput,
    dateContainerStyle,
    defaultDateStyle,
    expensiveDatesStyle,
    inRangeDateStyle,
    selectedEndDateStyle,
    selectedStartDateStyle,
} from "./DatePickerProps";
import { detectMob, devMode, normalizeDate } from "../../utils/Utils";
import { searchCheapestDatesRoundTrip } from "../../services/DummyAmadeusService";
import { isSameDate } from "../../utils/Time";

interface MultiDatePickerProps {
    className?: string;
    values: (dates: [Date | null, Date | null]) => void;
}

interface FlightDate {
    type: string;
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    price: {
        total: string;
    };
}
export default function MultiDatePicker({ className, values }: MultiDatePickerProps) {
    const startDate = useRef<Date | undefined | null>();
    const endDate = useRef<Date | undefined | null>(undefined);
    const minDate = new Date();
    const [dateCosts, setDateCosts] = useState<FlightDate[]>();
    const [currency, setCurrency] = useState<string>("");

    const onChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        startDate.current = start;
        endDate.current = end;
        values(dates);
    };

    useEffect(() => {
        if (devMode()) {
            searchCheapestDatesRoundTrip().then((response) => {
                const costs = response.data.data;
                const countryData = require("country-data");
                setDateCosts(costs);
                setCurrency(countryData.currencies[response.data.meta.currency].symbol);
            });
        }
    }, []);

    const findReturnDatesPrices = useMemo((): FlightDate[] | undefined => {
        return dateCosts?.filter((fDate) => {
            if (startDate.current) {
                return isSameDate(new Date(fDate.departureDate), startDate.current);
            }
        });
    }, [dateCosts, startDate.current]);

    const findMaxReturnPrice = useMemo(() => {
        const returnDatesCosts = findReturnDatesPrices;
        if (returnDatesCosts && returnDatesCosts.length > 0) {
            return returnDatesCosts?.reduce(function (prev: FlightDate, curr: FlightDate) {
                return parseFloat(prev.price.total) < parseFloat(curr.price.total) ? curr : prev;
            });
        }
    }, [findReturnDatesPrices]);

    const findMinReturnPrice = useMemo(() => {
        const returnDatesCosts = findReturnDatesPrices;
        if (returnDatesCosts && returnDatesCosts.length > 0) {
            return returnDatesCosts?.reduce(function (prev: FlightDate, curr: FlightDate) {
                return parseFloat(prev.price.total) > parseFloat(curr.price.total) ? curr : prev;
            });
        }
    }, [findReturnDatesPrices]);

    const findDepartureDatePrices = (date: Date) => {
        return dateCosts?.filter((fDate: FlightDate) => isSameDate(new Date(fDate.departureDate), date));
    };
    const memoizedFindDepartureDatePrices = useMemo(() => {
        console.log("called");
        return (date: Date) => {
            return dateCosts?.filter((fDate: FlightDate) => isSameDate(new Date(fDate.departureDate), date));
        };
    }, [dateCosts, endDate.current]);

    const findMaxDepartPrice = useMemo(() => {
        return dateCosts?.reduce(function (prev: FlightDate, curr: FlightDate) {
            return parseFloat(prev.price.total) < parseFloat(curr.price.total) ? curr : prev;
        });
    }, [dateCosts]);
    const findMinDepartPrice = useMemo(() => {
        return dateCosts?.reduce(function (prev: FlightDate, curr: FlightDate) {
            return parseFloat(prev.price.total) > parseFloat(curr.price.total) ? curr : prev;
        });
    }, [dateCosts]);

    /*  function checkPrice(date: Date): string {
        if (dateCosts) {
            if (startDate.current && !endDate.current) {
                const min = findMinReturnPrice;
                if (min && isSameDate(new Date(min.returnDate), date)) {
                    return cheapestDatesStyle;
                }
                const max = findMaxReturnPrice;
                if (max && isSameDate(new Date(max.returnDate), date)) {
                    return expensiveDatesStyle;
                }
                const returnPrices = findReturnDatesPrices;
                if (
                    returnPrices &&
                    returnPrices.filter((flightDate: FlightDate) => isSameDate(new Date(flightDate.returnDate), date))
                        .length > 0
                ) {
                    return avgPricedDatesStyle;
                }
            }
            if (!startDate.current || endDate.current) {
                const min = findMinDepartPrice;
                if (min && isSameDate(new Date(min?.departureDate), date)) {
                    return cheapestDatesStyle;
                }
                const max = findMaxDepartPrice;
                if (max && isSameDate(new Date(max?.departureDate), date)) {
                    return expensiveDatesStyle;
                }
                const departurePrices = memoizedFindDepartureDatePrices(date);
                if (departurePrices && departurePrices.length > 0) {
                    return avgPricedDatesStyle;
                }
            }
        }
        return defaultDateStyle;
    }

    function colorDates(date: Date) {
        if (!date) return "";

        const min = normalizeDate(minDate);
        const checkDate = normalizeDate(date);
        const checkDateTime = checkDate.getTime();
        const start = startDate.current;
        start?.setHours(0, 0, 0, 0);
        const end = endDate.current;
        end?.setHours(0, 0, 0, 0);

        if (checkDateTime < min.getTime()) {
            return behindCurrentDateStyle;
        } else if (checkDateTime === start?.getTime() && checkDateTime === end?.getTime()) {
            return selectedStartDateStyle + selectedEndDateStyle;
        } else if (checkDateTime === start?.getTime()) {
            return selectedStartDateStyle;
        } else if (checkDateTime === end?.getTime()) {
            return selectedEndDateStyle;
        } else if (start && end && checkDateTime > start?.getTime() && checkDateTime < end?.getTime()) {
            return inRangeDateStyle;
        } else if (start || !end) {
            return checkPrice(checkDate);
        }
        return defaultDateStyle;
    }
*/
    const renderDayContents = (day: number, date: Date) => {
        if (!date) return "";
        let dayNameClass = defaultDateStyle;
        let cost = undefined;

        const min = normalizeDate(minDate);
        const checkDate = normalizeDate(date);
        const checkDateTime = checkDate.getTime();
        const start = startDate.current;
        start?.setHours(0, 0, 0, 0);
        const end = endDate.current;
        end?.setHours(0, 0, 0, 0);

        if (checkDateTime < min.getTime()) {
            dayNameClass = behindCurrentDateStyle;
        } else if (checkDateTime === start?.getTime() && checkDateTime === end?.getTime()) {
            dayNameClass = selectedStartDateStyle + selectedEndDateStyle;
        } else if (checkDateTime === start?.getTime()) {
            dayNameClass = selectedStartDateStyle;
        } else if (checkDateTime === end?.getTime()) {
            dayNameClass = selectedEndDateStyle;
        } else if (start && end && checkDateTime > start?.getTime() && checkDateTime < end?.getTime()) {
            dayNameClass = inRangeDateStyle;
        } else if (start || !end) {
            if (dateCosts) {
                if (startDate.current && !endDate.current) {
                    const min = findMinReturnPrice;
                    const max = findMaxReturnPrice;
                    const returnPrice = findReturnDatesPrices?.filter((flightDate: FlightDate) =>
                        isSameDate(new Date(flightDate.returnDate), date),
                    );
                    if (min && isSameDate(new Date(min.returnDate), date)) {
                        cost = min.price.total;
                        dayNameClass = cheapestDatesStyle;
                    } else if (max && isSameDate(new Date(max.returnDate), date)) {
                        cost = max.price.total;
                        dayNameClass = expensiveDatesStyle;
                    } else if (returnPrice && returnPrice.length > 0) {
                        cost = returnPrice[0].price.total;
                        dayNameClass = avgPricedDatesStyle;
                    }
                } else if (!startDate.current || endDate.current) {
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
            }
        }

        /*  if (
            startDate.current &&
            isSameDate(startDate.current, date) &&
            endDate.current &&
            isSameDate(endDate.current, date)
        ) {
            if (startDate.current && !endDate.current) {
                cost = findReturnDatesPrices?.filter(
                    (fDate) =>
                        new Date(fDate.returnDate).toLocaleDateString().toString() ===
                        date?.toLocaleDateString().toString(),
                );
            } else if (!startDate.current || endDate.current) {
                cost = memoizedFindDepartureDatePrices(date);
            }
        }*/
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
                customInput={customRangeInput("Departure & Return", startDate.current, endDate.current)}
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
                selectsRange
                startDate={startDate.current ? startDate.current : undefined}
                endDate={endDate.current ? endDate.current : undefined}
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
