import FlightCard, {Dictionaries, Flight} from "./FlightCard";
import React, {useEffect, useState} from "react";
import {FlightSearchData} from "./FlightSearch";

interface FlightListFilterProps {
    flightList: Flight[],
    dictionaries: Dictionaries
    filter:(filteredFlightList: Flight[]) => void;
}

export default function FlightListFilters({flightList, dictionaries, filter}: FlightListFilterProps){

    const [flights, setFlights] = useState<Flight[]>(flightList);

    function onFilter(){
        filter(flights);
    }

    useEffect(() => {
        console.log(flightList)
    }, []);

    return (
        <div
            className={"w-100 d-flex gap-4 justify-content-center align-items-center"}>
            <div className={"w-25 component-box p-2 rounded-1"}>
                <h3>Filters</h3>
                <div> </div>
            </div>
        </div>
    );
}