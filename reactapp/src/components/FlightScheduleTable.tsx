import {Dictionaries, Flight} from "./FlightCard";
import {flightDateToStringShort, flightDateToStringTime, getAirportByIATA} from "../utils/Utils";
import Flag from "react-flagkit";
import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLongArrowDown} from '@fortawesome/free-solid-svg-icons'

interface FlightScheduleTableProps {
    flight: Flight,
    dictionaries: Dictionaries
    className?: string
}

function timeDiffToHoursAndMins(time1: string, time2: string) {
    let date1 = new Date(time1);
    let date2 = new Date(time2);
    let diff = (date2.getTime() - date1.getTime()) / 1000 / 60;
    let hours = Math.floor(diff / 60);
    let minutes = diff % 60

    if (minutes <= 0) {
        return hours + "h";
    } else if (hours > 0)
        return hours + "h " + minutes;
    else
        return minutes + "m";
}
function compareDate(date1: Date, date2: Date){
    console.log(date1.getHours())
    console.log(date2.getHours())

   return  date2.getHours() - date1.getHours() >= 0
}

function timeDiff(time1: string,  time2:string){
    let date1 = new Date(time1);
    let date2 = new Date(time2);
    let diff = (date2.getTime() - date1.getTime()) / 1000 / 60;
}

export default function FlightScheduleTable({className, flight, dictionaries}: FlightScheduleTableProps) {
    const outboundStart = flight.itineraries[0]?.segments[0].departure.at;
    const outboundEnd = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.at;
    const returnStart = flight.itineraries[1]?.segments[0].departure.at;
    const returnEnd = flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at;

    return (
        <div className={className}>
            {flight.itineraries.map((itinerary: any, itineraryIdx: any) =>
                <div className={"w-full flex flex-col gap-2"}>
                    {itineraryIdx === 0 ?
                        <h4 className={"px-3 sm:px-0 text-start text-2xl"}>Outbound <span
                            className={"text-blue-400"}>{flightDateToStringShort(outboundStart)}</span>
                        </h4> :
                        <h4 className={"px-3 sm:px-0 text-start text-2xl"}>Return <span
                            className={"text-blue-400"}>{flightDateToStringShort(returnStart)}</span>
                        </h4>}
                    <div className={"outline outline-1 outline-gray-500 rounded-lg"}>
                        {itinerary.segments.map((segment: any, segmentIdx: any) =>
                            <>
                                <div key={segmentIdx}
                                     className={"flex flex-col gap-1 items-center text-sm px-5 py-5 font-medium"}>
                                    <span className={"w-full flex items-center justify-start gap-2"}>
                                        <span
                                            className={"text-2xl"}>{flightDateToStringTime(segment.departure.at)}</span>
                                        <Flag className={"size-7"}
                                              country={dictionaries.locations[segment.departure.iataCode].countryCode}/>{' '}
                                        <span>
                                            {getAirportByIATA(segment.departure.iataCode)?.city || ""}{', '}
                                            {getAirportByIATA(segment.departure.iataCode)?.name || ""}{' '} ({segment.departure.iataCode})
                                        </span>
                                    </span>
                                    <FontAwesomeIcon icon={faLongArrowDown} className="size-5"/>
                                    <span className={"w-full flex items-center justify-start gap-2"}>
                                        <span
                                            className={"text-2xl"}>{flightDateToStringTime(segment.arrival.at)} </span>
                                        <Flag className={"size-7"}
                                              country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>{' '}
                                        <span>
                                            {getAirportByIATA(segment.arrival.iataCode)?.city || ""}{', '}
                                            {getAirportByIATA(segment.arrival.iataCode)?.name || ""}{' '}({segment.arrival.iataCode})

                                        </span>
                                    </span>
                                    {itineraryIdx == 0 && segmentIdx == itinerary.segments.length - 1
                                        && !compareDate(new Date(outboundStart), new Date(outboundEnd))
                                        && <span className={"w-full text-sm"}>Arriving at <span className={"text-blue-400"}>{flightDateToStringShort(segment.arrival.at)}</span></span>}

                                    {itineraryIdx == 1 && segmentIdx == itinerary.segments.length - 1
                                        && !compareDate(new Date(returnStart), new Date(returnEnd))
                                        && <span className={"w-full text-sm"}>Arriving at <span className={"text-blue-400"}>{flightDateToStringShort(segment.arrival.at)}</span></span>}
                                </div>
                                {segmentIdx < itinerary.segments.length - 1 &&
                                    <div
                                        className={"text-lg py-2 text-center text-red-400 font-bold"}>Standby in
                                        airport: {timeDiffToHoursAndMins(segment.arrival.at, itinerary.segments[segmentIdx + 1].departure.at)}</div>}
                            </>)}
                    </div>
                </div>
            )}
            <div className={"px-2 text-lg"}>
                Available Seats: {flight.numberOfBookableSeats}
            </div>
        </div>
    )
}