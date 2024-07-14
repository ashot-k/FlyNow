import { Flight } from "./FlightCard";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { flightDateToStringShort, flightDateToStringTime, timeDiffToHoursAndMins } from "../../utils/Utils";
import ArrowRight from "../../static/assets/arrow-right.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faLongArrowDown } from "@fortawesome/free-solid-svg-icons";
import FlightScheduleTable from "./FlightScheduleTable";
import React, { useMemo } from "react";

interface FlightCardDisclosureProps {
    flight: Flight;
}

export default function FlightCardDisclosure({ flight }: FlightCardDisclosureProps) {
    const outboundStart = useMemo(() => flight.itineraries[0]?.segments[0].departure.at, [flight.itineraries]);
    const outboundEnd = useMemo(
        () => flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.at,
        [flight.itineraries],
    );
    const origin = useMemo(() => flight.itineraries[0]?.segments[0].departure.iataCode, [flight.itineraries]);
    const destination = useMemo(
        () => flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.iataCode,
        [flight.itineraries],
    );
    const returnStart = useMemo(() => flight.itineraries[1]?.segments[0].departure.at, [flight.itineraries]);
    const returnEnd = useMemo(
        () => flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at,
        [flight.itineraries],
    );
    return (
        <Disclosure as={"div"} defaultOpen={false}>
            <DisclosureButton
                className={
                    "group relative flex w-full items-center justify-between transition-all duration-500 hover:scale-95"
                }>
                <div className={"flex w-full flex-col items-center gap-2"}>
                    {flight.itineraries[0] && (
                        <div className={"flex w-2/3 flex-col gap-0"}>
                            <div className={"flex justify-center"}>
                                <span className={"flex w-full items-center justify-center gap-1.5 text-center text-sm"}>
                                    <span>Outbound</span>
                                    <span className={"text-blue-400"}>{flightDateToStringShort(outboundStart)}</span>
                                    <FontAwesomeIcon icon={faClock} className={"text-gray-300"} />
                                    <span className={"text-rose-500"}>
                                        {timeDiffToHoursAndMins(outboundStart, outboundEnd)}
                                    </span>
                                </span>
                            </div>
                            <div className={"flex items-center justify-center gap-1.5 text-lg"}>
                                <span> {flightDateToStringTime(outboundStart)}</span>
                                <img src={ArrowRight} className={"size-5"} alt={""} />
                                <span> {flightDateToStringTime(outboundEnd)}</span>
                            </div>
                        </div>
                    )}
                    {flight.itineraries[1] && (
                        <div className={"flex w-2/3 flex-col gap-0"}>
                            <div className={"flex justify-center"}>
                                <span className={"flex w-full items-center justify-center gap-1.5 text-center text-sm"}>
                                    <span>Return</span>
                                    <span className={"text-blue-400"}>{flightDateToStringShort(returnStart)}</span>
                                    <FontAwesomeIcon icon={faClock} className={"text-gray-300"} />
                                    <span className={"text-rose-500"}>
                                        {timeDiffToHoursAndMins(returnStart, returnEnd)}
                                    </span>
                                </span>
                            </div>
                            <div className={"flex items-center justify-center gap-1.5 text-lg"}>
                                <span> {flightDateToStringTime(returnStart)}</span>
                                <img src={ArrowRight} className={"size-5"} alt={""} />
                                <span> {flightDateToStringTime(returnEnd)}</span>
                            </div>
                        </div>
                    )}
                </div>
                <FontAwesomeIcon
                    icon={faLongArrowDown}
                    className="absolute right-5 size-7 p-8 transition-colors duration-300 hover:text-emerald-400 group-data-[open]:rotate-180 sm:right-0"
                />
            </DisclosureButton>
            <DisclosurePanel className="mt-3 overflow-auto text-sm sm:px-1">
                <FlightScheduleTable
                    className={"animate-slideInDiagonal mt-5 flex w-full flex-col gap-5"}
                    flight={flight}
                />
            </DisclosurePanel>
        </Disclosure>
    );
}
