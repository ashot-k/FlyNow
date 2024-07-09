import Flag from "react-flagkit";
import { capitalize } from "../../utils/Utils";
import React from "react";
import { Route } from "./FlightSearch";
import arrowRight from "../../static/assets/arrow-right.svg";

interface SearchInfo {
    departureDate: string;
    returnDate: string;
    adults: number;
    children: number;
    origin: Route;
    destination: Route;
    maxPrice: number;
}

interface SearchInfoHeaderProps {
    searchInfo: SearchInfo;
}

export default function SearchInfoHeader({ searchInfo }: SearchInfoHeaderProps) {
    function scroll() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    let origin = searchInfo.origin;
    let destination = searchInfo.destination;
    let departureDate = searchInfo.departureDate;
    let returnDate = searchInfo.returnDate;

    return (
        <div
            className={
                "fixed bottom-0 z-10 flex w-full flex-col items-center justify-center rounded-t-3xl bg-flyNow-light bg-opacity-95 py-1 font-semibold sm:bg-flyNow-component"
            }>
            <button onClick={scroll}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    className="bi bi-chevron-double-up size-6"
                    viewBox="0 0 16 16">
                    <path
                        fillRule="evenodd"
                        d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708z"
                    />
                    <path
                        fillRule="evenodd"
                        d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                    />
                </svg>
            </button>
            <span className={"flex w-full items-center justify-center gap-2 text-lg sm:text-lg"}>
                <Flag className={"size-5 sm:size-6"} country={origin.countryCode} /> {capitalize(origin.cityName)} (
                {origin.iataCode})
                <img src={arrowRight} className={"size-5 sm:size-6"} alt={""} />
                <Flag className={"size-5 sm:size-6"} country={destination.countryCode} />{" "}
                {capitalize(destination.cityName)} ({destination.iataCode})
            </span>
            <div className={"flex items-start justify-start gap-2 text-lg"}>
                {departureDate && <span>Outbound: {new Date(departureDate).toLocaleDateString("en-GB")}</span>}
                {returnDate && <span>Return: {new Date(returnDate).toLocaleDateString("en-GB")}</span>}
            </div>
        </div>
    );
}
