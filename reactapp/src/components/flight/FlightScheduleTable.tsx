import { Flight } from "./FlightCard";
import { getAirportByIATA } from "../../utils/Utils";
import Flag from "react-flagkit";
import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DictionariesContext } from "../../context";
import {
    compareDateHours,
    flightDateToStringShort,
    flightDateToStringTime,
    dateDiffInHoursAndMins,
} from "../../utils/Time";

interface FlightScheduleTableProps {
    flight: Flight;
    className?: string;
}

export default function FlightScheduleTable({ className, flight }: FlightScheduleTableProps) {
    const dictionaries = useContext(DictionariesContext);
    const outboundStart = flight.itineraries[0]?.segments[0].departure.at;
    const outboundEnd = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.at;
    const returnStart = flight.itineraries[1]?.segments[0].departure.at;
    const returnEnd = flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at;

    return (
        <div className={className}>
            {flight.itineraries.map((itinerary: any, itineraryIdx: number) => (
                <div key={itineraryIdx} className={"flex w-full flex-col gap-2 px-2 pb-0.5"}>
                    {itineraryIdx === 0 ? (
                        <h4 className={"flex items-center gap-2 pe-3 text-start text-lg sm:px-0"}>
                            <span className={"text-blue-400"}>{flightDateToStringShort(outboundStart)}</span>
                            <span className={"text-end text-sm font-bold text-rose-500"}>
                                {" "}
                                <FontAwesomeIcon icon={"clock"} className={"text-gray-300"} />{" "}
                                {dateDiffInHoursAndMins(outboundStart, outboundEnd)}
                            </span>
                        </h4>
                    ) : (
                        <h4 className={"flex items-center gap-2 pe-3 text-start text-lg sm:px-0"}>
                            <span className={"text-blue-400"}>{flightDateToStringShort(returnStart)}</span>
                            <span className={"text-end text-sm font-bold text-rose-500"}>
                                <FontAwesomeIcon icon={"clock"} className={"text-gray-300"} />{" "}
                                {dateDiffInHoursAndMins(returnStart, returnEnd)}
                            </span>
                        </h4>
                    )}
                    <div className={"rounded-sm text-sm outline outline-1 outline-gray-500 sm:rounded-lg"}>
                        {itinerary.segments.map((segment: any, segmentIdx: number) => (
                            <div key={segmentIdx}>
                                <div className={"flex flex-col items-center gap-1 px-5 py-3 text-sm"}>
                                    <span className={"flex w-full items-center justify-start gap-2"}>
                                        <span className={"text-xl"}>
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
                                    <FontAwesomeIcon icon={"long-arrow-down"} className="size-4" />
                                    <span className={"flex w-full items-center justify-start gap-2"}>
                                        <span className={"text-xl"}>{flightDateToStringTime(segment.arrival.at)} </span>
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
                                        !compareDateHours(outboundStart, outboundEnd) && (
                                            <span className={"w-full"}>
                                                Arriving at{" "}
                                                <span className={"text-blue-400"}>
                                                    {flightDateToStringShort(segment.arrival.at)}
                                                </span>
                                            </span>
                                        )}
                                    {itineraryIdx == 1 &&
                                        segmentIdx == itinerary.segments.length - 1 &&
                                        !compareDateHours(returnStart, returnEnd) && (
                                            <span className={"w-full"}>
                                                Arriving at{" "}
                                                <span className={"text-blue-400"}>
                                                    {flightDateToStringShort(segment.arrival.at)}
                                                </span>
                                            </span>
                                        )}
                                </div>
                                {segmentIdx < itinerary.segments.length - 1 && (
                                    <div className={"py-0.5 text-center font-bold text-red-400"}>
                                        Standby in airport:{" "}
                                        {dateDiffInHoursAndMins(
                                            segment.arrival.at,
                                            itinerary.segments[segmentIdx + 1].departure.at,
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
