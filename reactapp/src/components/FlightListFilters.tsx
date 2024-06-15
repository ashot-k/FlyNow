import {Dictionaries, Flight} from "./FlightCard";
import React, {useEffect, useState} from "react";
import {capitalize} from "../utils/Utils";

import airlineData from '../utils/airlines.json';
interface FlightListFilterProps {
    flightList: Flight[],
    dictionaries: Dictionaries
    filter: (filteredFlightList: Flight[]) => void;
}

export default function FlightListFilters({flightList, dictionaries, filter}: FlightListFilterProps) {

    const [flights, setFlights] = useState<Flight[]>(flightList);
    const [airlines, setAirlines] = useState<string[]>();
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);


    useEffect(() => {
        let carriers = [];
        if(!dictionaries) return;
        for (const carriersKey in dictionaries.carriers) {
            carriers.push(dictionaries.carriers[carriersKey]);
        }
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

    return (
        <div
            className={"w-100 d-flex flex-column justify-content-start align-items-center gap-2"}>
            <h2>Filters</h2>
            <div className={"w-100 component-box element-shadow p-2 rounded-1 d-flex flex-column align-items-center"}>
                <h5 className={"fw-bold"}>Airlines</h5>
                <hr className={"w-100 m-1 m-auto"}/>
                <div className={"w-100 d-flex flex-column align-items-start p-3"}>
                    {airlines?.map((airline, index) => (
                        <div className={"d-flex airline-filter p-1 justify-content-start align-items-center w-100 gap-2"}>
                            <input
                                type="checkbox"
                                key={index}
                                value={airline} className={"form-check-input"}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedAirlines(prevSelectedAirlines => {
                                        if (isChecked) {
                                            return [...prevSelectedAirlines, airline];
                                        } else {
                                            return prevSelectedAirlines.filter(selectedAirline => selectedAirline !== airline);
                                        }
                                    });
                                }}
                            />
                            <label className={"fs-6"}>{capitalize(airline)}</label>
                            <img className={"airline-logo"}
                                 src={airlineData.find(airlineInfo => airlineInfo.name.toLowerCase() === airline.toLowerCase())?.logo}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}