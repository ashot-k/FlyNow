import { Dictionaries, Flight } from "./FlightCard";
import React, { useEffect, useState } from "react";
import { capitalize, inverse, minutesToClock } from "../../utils/Utils";

import airlineData from "../../utils/airlines.json";
import { Field, Input, Label } from "@headlessui/react";

interface FlightListFilterProps {
    flightList: Flight[];
    dictionaries: Dictionaries;
    filter: (filteredFlightList: Flight[]) => void;
    className?: string;
}

export default function FlightListFilters({ flightList, dictionaries, filter, className }: FlightListFilterProps) {
    const [flights, setFlights] = useState<Flight[]>(flightList);
    const [airlines, setAirlines] = useState<string[]>();
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [departureTime, setDepartureTime] = useState<number>(0);

    useEffect(() => {
        let carriers = [];
        if (!dictionaries) return;
        for (const carriersKey in dictionaries.carriers) {
            if (flightList.find((flight) => flight.validatingAirlineCodes.includes(carriersKey)))
                carriers.push(dictionaries.carriers[carriersKey]);
        }
        setAirlines(carriers);
    }, [flightList, dictionaries]);

    useEffect(() => {
        if (selectedAirlines?.length > 0) filterAirline();
        else filter(flightList);
    }, [selectedAirlines]);

    function filterAirline() {
        const filtered = flightList.filter((flight: Flight) =>
            selectedAirlines.includes(dictionaries.carriers[flight.validatingAirlineCodes]),
        );
        filter(filtered);
    }

    return (
        <div className={className}>
            <div
                className={
                    "rounded-1 flex w-full flex-col items-start gap-2 rounded-lg bg-flyNow-component bg-opacity-85 p-8 shadow-lg shadow-black backdrop-blur"
                }>
                <div className={"flex w-full flex-col gap-1"}>
                    <h5 className={"text-xl font-medium"}>Airlines</h5>
                    <hr className={"w-full border-gray-500"} />
                </div>
                <div className={"flex w-full flex-col items-start"}>
                    {airlines?.map((airline, idx) => (
                        <div key={idx} className={"flex w-full items-center justify-start gap-2 py-2"}>
                            <div className={"flex w-3/4 items-center justify-start gap-2"}>
                                <Input
                                    type="checkbox"
                                    value={airline}
                                    className={"size-5 border-2 border-black accent-flyNow-light sm:size-5"}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setSelectedAirlines((prevSelectedAirlines) => {
                                            if (isChecked) return [...prevSelectedAirlines, airline];
                                            else
                                                return prevSelectedAirlines.filter(
                                                    (selectedAirline) => selectedAirline !== airline,
                                                );
                                        });
                                    }}
                                />
                                <label className={"max-w-full text-sm sm:text-lg"}>{capitalize(airline)}</label>
                            </div>
                            <div className={"flex w-1/4 items-center justify-end gap-2"}>
                                <img
                                    className={"size-8 rounded-full text-xs"}
                                    src={
                                        airlineData.find(
                                            (airlineInfo) => airlineInfo.name.toLowerCase() === airline.toLowerCase(),
                                        )?.logo
                                    }
                                    alt={airline}
                                />
                                <small className={"font-sans"}>
                                    (
                                    {
                                        flightList.filter((flight) =>
                                            flight.validatingAirlineCodes.includes(
                                                inverse(dictionaries.carriers)[airline.toUpperCase()],
                                            ),
                                        ).length
                                    }
                                    )
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={
                    "rounded-1 flex w-full flex-col items-start gap-2 rounded-lg bg-flyNow-component p-8 shadow-lg shadow-black"
                }>
                <div className={"flex w-full flex-col gap-1"}>
                    <h5 className={"text-xl font-medium"}>Time range</h5>
                    <hr className={"w-full border-gray-500"} />
                </div>
                <div className={"flex w-full flex-col items-start"}>
                    <Field>
                        <Label className={"text-lg"}>Departure {minutesToClock(departureTime)}</Label>
                        <Input
                            type={"range"}
                            max={"1440"}
                            min={"0"}
                            onChange={(e) => setDepartureTime(parseInt(e.target.value))}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
