import Flag from "react-flagkit";
import { capitalize } from "../../utils/Utils";
import React, { useContext, useEffect, useState } from "react";
import { RouteInfo, SearchParams } from "./FlightSearch";
import { DictionariesContext } from "../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchInfoHeaderProps {
    searchInfo: SearchParams;
}

export default function SearchInfoHeader({ searchInfo }: SearchInfoHeaderProps) {
    function scroll() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const dictionary = useContext(DictionariesContext);
    let origin = searchInfo.origin;
    let destination = searchInfo.destination;
    let departureDate = searchInfo.departureDate;
    let returnDate = searchInfo.returnDate;
    const [originCity, setOriginCity] = useState<string>();
    const [destinationCity, setDestinationCity] = useState<string>();

    useEffect(() => {
        const originCity = localStorage.getItem("originCity");
        const destinationCity = localStorage.getItem("destinationCity");
        if (originCity && destinationCity) {
            setOriginCity(originCity);
            setDestinationCity(destinationCity);
        }
    }, []);
    return (
        <div
            className={
                "fixed bottom-0 z-10 flex w-full flex-col items-center justify-center rounded-t-3xl bg-flyNow-component bg-opacity-95 py-1 font-semibold sm:bg-flyNow-component"
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
            <div className={"flex w-full items-center justify-evenly gap-1 text-sm sm:justify-center sm:text-lg"}>
                <div className={"flex w-40 items-center justify-center gap-2 sm:w-48"}>
                    <div className={"flex flex-col items-center"}>
                        <span className={"flex items-center gap-2"}>
                            <Flag className={"size-5"} country={dictionary?.locations[searchInfo.origin].countryCode} />
                            {capitalize(originCity)} ({searchInfo.origin})
                        </span>
                        {departureDate && <span>{new Date(searchInfo.departureDate).toLocaleDateString()}</span>}
                    </div>
                </div>
                <div className={"flex size-6 flex-col items-center justify-center"}>
                    <FontAwesomeIcon icon={returnDate ? "arrows-left-right" : "arrow-right"} className={"size-6"} />
                </div>
                <div className={"flex w-40 items-center justify-center gap-2 sm:w-48"}>
                    <div className={"flex flex-col items-center"}>
                        <span className={"flex items-center gap-2"}>
                            <Flag
                                className={"size-5"}
                                country={dictionary?.locations[searchInfo.destination].countryCode}
                            />
                            {capitalize(destinationCity)} ({searchInfo.destination})
                        </span>
                        {returnDate && <span>{new Date(searchInfo.returnDate).toLocaleDateString()}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
