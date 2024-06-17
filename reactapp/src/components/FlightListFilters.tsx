import {Dictionaries, Flight} from "./FlightCard";
import React, {useEffect, useState} from "react";
import {capitalize} from "../utils/Utils";

import airlineData from '../utils/airlines.json';
import {Input} from "@headlessui/react";

interface FlightListFilterProps {
    flightList: Flight[],
    dictionaries: Dictionaries
    filter: (filteredFlightList: Flight[]) => void;
    className?: string;
}

export default function FlightListFilters({flightList, dictionaries, filter, className}: FlightListFilterProps) {

    const [flights, setFlights] = useState<Flight[]>(flightList);
    const [airlines, setAirlines] = useState<string[]>();
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);


    useEffect(() => {
        let carriers = [];
        if (!dictionaries) return;
        for (const carriersKey in dictionaries.carriers) {
            if (flightList.find((flight) => flight.validatingAirlineCodes.includes(carriersKey)))
                carriers.push(dictionaries.carriers[carriersKey]);
        }
        console.log(carriers)
        setAirlines(carriers);
    }, [flightList, dictionaries]);

    useEffect(() => {
        if (selectedAirlines?.length > 0)
            filterAirline();
        else
            filter(flightList)
    }, [selectedAirlines]);

    function filterAirline() {
        const filtered = flightList.filter((flight: Flight) => selectedAirlines.includes(dictionaries.carriers[flight.validatingAirlineCodes]));
        filter(filtered);
    }


    function inverse(obj: any){
        let retobj  :any = {};
        for(let key in obj){
            retobj[obj[key]] = key;
        }
        return retobj;
    }

    return (
        <div className={className}>
                <h2 className={"text-4xl mb-10 font-normal"}>Filters</h2>
                <div className={"w-full rounded-1 flex flex-col items-start gap-2"}>
                    <div className={"w-full"}>
                        <h5 className={"text-2xl font-bold"}>Airlines</h5>
                        <hr className={"w-full m-auto"}/>
                    </div>
                    <div className={"w-full flex flex-col items-start"}>
                        {airlines?.map((airline, index) => (
                            <div className={"w-full flex py-2 justify-start items-center gap-2"}>
                                <Input
                                    type="checkbox"
                                    key={index}
                                    value={airline} className={"accent-flyNow-light"}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setSelectedAirlines(prevSelectedAirlines => {
                                            if (isChecked)
                                                return [...prevSelectedAirlines, airline];
                                            else
                                                return prevSelectedAirlines.filter(selectedAirline => selectedAirline !== airline);
                                        });
                                    }}
                                />
                                <label className={"text-lg max-w-full"}>{capitalize(airline)}</label>
                                <img className={"w-10 h-10 rounded-full"}
                                     src={airlineData.find(airlineInfo => airlineInfo.name.toLowerCase() === airline.toLowerCase())?.logo}
                                     alt={""}/>
                                <small className={"font-sans"}>({flightList.filter((flight) =>
                                    flight.validatingAirlineCodes
                                    .includes(
                                        inverse(dictionaries.carriers)[airline.toUpperCase()]
                                    )).length})</small>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    );
}