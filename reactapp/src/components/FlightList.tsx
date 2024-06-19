import FlightCard, {Dictionaries, Flight} from "./FlightCard";
import React from "react";

interface FlightListProps {
    flightList: Flight[],
    dictionaries: Dictionaries
    className?: string
}

export const FlightList = ({flightList, dictionaries, className}: FlightListProps) => {

    return (
        <div className={className}>
            {flightList.map((flight: Flight, index: number) =>
                <FlightCard key={index} className={"animate-fadeIn w-full sm:w-3/4 flex flex-col bg-flyNow-component shadow-black shadow-md rounded-lg gap-2"}
                            flight={flight} dictionaries={dictionaries}/>
            )}
        </div>
    );
};
