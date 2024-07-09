import { Flight } from "./FlightCard";
import {
    compareDate,
    flightDateToStringShort,
    flightDateToStringTime,
    getAirportByIATA,
    timeDiffToHoursAndMins,
} from "../../utils/Utils";
import Flag from "react-flagkit";
import React, { useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/free-solid-svg-icons";
import { DictionariesContext } from "../../context";

interface FlightScheduleTableProps {
    flight: Flight;
    className?: string;
}

export function diffInMins(time1: string, time2: string) {
    let date1 = new Date(time1);
    let date2 = new Date(time2);
    return (date2.getTime() - date1.getTime()) / 1000 / 60;
}

export default function FlightScheduleTable({ className, flight }: FlightScheduleTableProps) {
    const dictionaries = useContext(DictionariesContext);
    const outboundStart = flight.itineraries[0]?.segments[0].departure.at;
    const outboundEnd = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.at;
    const returnStart = flight.itineraries[1]?.segments[0].departure.at;
    const returnEnd = flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at;
    const airportData = useRef();

    return (
        <div className={className}>
            {flight.itineraries.map((itinerary: any, itineraryIdx: number) => (
                <div key={itineraryIdx} className={"flex w-full flex-col gap-2 px-2 pb-0.5"}>
                    {itineraryIdx === 0 ? (
                        <h4 className={"px-3 text-start text-xl sm:px-0"}>
                            Outbound <span className={"text-blue-400"}>{flightDateToStringShort(outboundStart)}</span>{" "}
                            <span className={"text-end text-lg font-bold text-rose-500"}>
                                {timeDiffToHoursAndMins(outboundStart, outboundEnd)}
                            </span>
                        </h4>
                    ) : (
                        <h4 className={"px-3 text-start text-xl sm:px-0"}>
                            Return <span className={"text-blue-400"}>{flightDateToStringShort(returnStart)}</span>{" "}
                            <span className={"text-end text-lg font-bold text-rose-500"}>
                                {timeDiffToHoursAndMins(returnStart, returnEnd)}
                            </span>
                        </h4>
                    )}
                    <div className={"rounded-sm outline outline-1 outline-gray-500 sm:rounded-lg"}>
                        {itinerary.segments.map((segment: any, segmentIdx: number) => (
                            <>
                                <div key={segmentIdx} className={"flex flex-col items-center gap-1 px-5 py-3 text-sm"}>
                                    <span className={"flex w-full items-center justify-start gap-2"}>
                                        <span className={"text-2xl"}>
                                            {flightDateToStringTime(segment.departure.at)}
                                        </span>
                                        <Flag
                                            className={"size-6"}
                                            country={dictionaries?.locations[segment.departure.iataCode].countryCode}
                                        />{" "}
                                        <span>
                                            {getAirportByIATA(segment.departure.iataCode)?.city || ""}
                                            {", "}
                                            {getAirportByIATA(segment.departure.iataCode)?.name || ""} (
                                            {segment.departure.iataCode})
                                        </span>
                                    </span>
                                    <FontAwesomeIcon icon={faLongArrowDown} className="size-5" />
                                    <span className={"flex w-full items-center justify-start gap-2"}>
                                        <span className={"text-2xl"}>
                                            {flightDateToStringTime(segment.arrival.at)}{" "}
                                        </span>
                                        <Flag
                                            className={"size-6"}
                                            country={dictionaries?.locations[segment.arrival.iataCode].countryCode}
                                        />{" "}
                                        <span>
                                            {getAirportByIATA(segment.arrival.iataCode)?.city || ""}
                                            {", "}
                                            {getAirportByIATA(segment.arrival.iataCode)?.name || ""} (
                                            {segment.arrival.iataCode})
                                        </span>
                                    </span>
                                    {itineraryIdx == 0 &&
                                        segmentIdx == itinerary.segments.length - 1 &&
                                        !compareDate(new Date(outboundStart), new Date(outboundEnd)) && (
                                            <span className={"w-full text-sm"}>
                                                Arriving at{" "}
                                                <span className={"text-blue-400"}>
                                                    {flightDateToStringShort(segment.arrival.at)}
                                                </span>
                                            </span>
                                        )}

                                    {itineraryIdx == 1 &&
                                        segmentIdx == itinerary.segments.length - 1 &&
                                        !compareDate(new Date(returnStart), new Date(returnEnd)) && (
                                            <span className={"w-full text-sm"}>
                                                Arriving at{" "}
                                                <span className={"text-blue-400"}>
                                                    {flightDateToStringShort(segment.arrival.at)}
                                                </span>
                                            </span>
                                        )}
                                </div>
                                {segmentIdx < itinerary.segments.length - 1 && (
                                    <div className={"py-2 text-center text-lg font-bold text-red-400"}>
                                        Standby in airport:{" "}
                                        {timeDiffToHoursAndMins(
                                            segment.arrival.at,
                                            itinerary.segments[segmentIdx + 1].departure.at,
                                        )}
                                    </div>
                                )}
                            </>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
