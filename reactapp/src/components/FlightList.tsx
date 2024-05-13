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
            className={"w-100 d-flex flex-column flex-wrap gap-4 justify-content-start align-items-center"}>
            <div className={"w-100 d-flex flex-column align-items-center justify-content-center gap-4 mt-3"}>
                {flightList.map((flight: Flight, index: number) => {
                    return <FlightCard key={index} flight={flight} dictionaries={dictionaries}/>
                })}
            </div>
        </div>
    );
};
