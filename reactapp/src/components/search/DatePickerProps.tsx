import calendarIcon from "../../static/assets/calendar-color-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const customRangeInput = (
    label: string,
    startDate: Date | undefined | null,
    endDate: Date | undefined | null,
) => {
    return (
        <button className={"flex items-center justify-center gap-2 px-5 text-sm sm:text-sm"}>
            <h5 className={"absolute -top-3 left-4 flex items-center gap-2 bg-flyNow-component px-2 sm:left-6"}>
                {label}
                <img className={"size-4"} src={calendarIcon} alt={""} />
            </h5>
            <FontAwesomeIcon icon={"calendar"} />
            {startDate ? startDate.toLocaleDateString() : "dd/mm/yyyy"}{" "}
            <FontAwesomeIcon icon={"arrows-left-right"} className={"size-5"} />{" "}
            {endDate ? endDate.toLocaleDateString() : "dd/mm/yyyy"}
        </button>
    );
};
export const customSingleInput = (label: string, selectedDate: Date | undefined | null) => {
    return (
        <button className={"flex items-center justify-center gap-2 px-5 text-sm sm:text-sm"}>
            <h5 className={"absolute -top-3 left-4 flex items-center gap-2 bg-flyNow-component px-2 sm:left-6"}>
                {label}
                <img className={"size-4"} src={calendarIcon} alt={""} />
            </h5>
            <FontAwesomeIcon icon={"calendar"} />
            {selectedDate ? selectedDate.toLocaleDateString() : "dd/mm/yyyy"}{" "}
        </button>
    );
};
export const dateContainerStyle = " ";
const defaultStyle =
    " animate-fadeIn transition-all duration-500 sm:hover:!bg-cyan-600 relative flex !min-h-14 flex-col items-center justify-center p-1 font-bold";
export const selectedStartDateStyle = "!text-white !bg-cyan-600 !rounded-l-full" + " " + defaultStyle;
export const selectedEndDateStyle = "!text-white !bg-cyan-600 !rounded-r-full" + " " + defaultStyle;
export const selectedDateStyle = "!text-white !bg-cyan-600 !rounded-full" + " " + defaultStyle;
export const inRangeDateStyle = "!text-transparent  !bg-cyan-600 hover:!bg-rose-500" + " " + defaultStyle;
export const defaultDateStyle =
    "!text-white !bg-black !bg-opacity-50 hover:!bg-opacity-100 hover:!bg-black" + " " + defaultStyle;
export const behindCurrentDateStyle = "!text-gray-500 pointer-events-none !bg-black" + " " + defaultStyle;
export const expensiveDatesStyle = "!text-white !bg-rose-900 hover:!bg-rose-800 !rounded-full" + " " + defaultStyle;
export const cheapestDatesStyle = "!text-white !bg-green-900 hover:!bg-green-800 !rounded-full" + " " + defaultStyle;
export const avgPricedDatesStyle =
    "!text-white bg-amber-500 !bg-opacity-80 hover:!bg-yellow-800 !rounded-full" + " " + defaultStyle;
