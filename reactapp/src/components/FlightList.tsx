import FlightCard, { Flight } from "./FlightCard";
import React, { useEffect } from "react";

interface FlightListProps {
    flightList: Flight[];
    className?: string;
}

export const FlightList = ({ flightList, className }: FlightListProps) => {
    useEffect(() => {
        const elementPOS = document.getElementById("results")?.getBoundingClientRect();
        if (elementPOS) {
            window.scrollTo({ top: elementPOS.top - 64, behavior: "smooth" });
        }
    }, []);
    return (
        <div className={className} onChange={(e) => console.log(e.target)}>
            {flightList.map((flight: Flight, idx: number) => (
                <FlightCard
                    key={idx}
                    className={
                        "flex w-full animate-fadeIn flex-col bg-flyNow-component bg-opacity-75 shadow-md shadow-black backdrop-blur-sm sm:w-2/3 sm:rounded-lg sm:bg-opacity-75 sm:px-2"
                    }
                    flight={flight}
                />
            ))}
        </div>
    );
};
