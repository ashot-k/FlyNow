import FlightCard, {Dictionaries, Flight} from "./FlightCard";
import React from "react";
import '../static/FlightCard.css'

interface FlightListProps {
    flightList: Flight[],
    dictionaries: Dictionaries
}

export const FlightList = ({flightList, dictionaries}: FlightListProps) => {

    return (
        <div
            className={"flight-list d-flex flex-column flex-wrap justify-content-start align-items-center gap-2"}>
            <h2>Results</h2>
            <div className={"w-100 d-flex flex-column align-items-center justify-content-center gap-4"}>
                {flightList.map((flight: Flight, index: number) => {
                    return <FlightCard key={index} flight={flight} dictionaries={dictionaries}/>
                })}
            </div>
        </div>
    );
};
