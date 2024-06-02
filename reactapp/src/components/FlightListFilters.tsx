import {Dictionaries, Flight} from "./FlightCard";
import React, {useEffect, useState} from "react";

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
        for (const carriersKey in dictionaries.carriers) {
            carriers.push(dictionaries.carriers[carriersKey]);
        }
        setAirlines(carriers);
    }, []);

    useEffect(() => {
        console.log(selectedAirlines)
        if (selectedAirlines?.length > 0)
            filterAirline();
        else
            filter(flightList)
    }, [selectedAirlines]);

    function filterAirline() {
        const filtered = flightList.filter((flight: Flight) => selectedAirlines.includes(dictionaries.carriers[flight.validatingAirlineCodes]));
        console.log(filtered)
        filter(filtered);
    }

    return (
        <div
            className={"w-100 d-flex flex-column justify-content-center align-items-center gap-2"}>
            <h2>Filters</h2>
            <div className={"w-100 component-box p-2 rounded-1"}>
                <div className={"d-flex flex-column align-items-center"}>
                    <h3>Airlines</h3>
                    <div className={"w-75 d-flex flex-column align-items-center p-3"}>
                        {airlines?.map((airline, index) => (
                            <div className={"d-flex justify-content-between w-100 gap-2"}>
                                <label>{airline}</label>
                                <input
                                    type="checkbox"
                                    key={index}
                                    value={airline}
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
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}