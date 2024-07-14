import FlightCard, { Flight } from "./FlightCard";
import React, { forwardRef } from "react";

interface FlightListProps {
    flightList: Flight[];
    className?: string;
}

export const FlightList = forwardRef<HTMLDivElement, FlightListProps>(({ flightList, className }, ref) => {
    return (
        <div ref={ref} className={className}>
            {flightList.map((flight: Flight, idx: number) => (
                <FlightCard
                    key={idx}
                    className={
                        "flex w-full animate-fadeIn flex-col gap-1.5 bg-flyNow-component bg-opacity-75 shadow-md shadow-black backdrop-blur-sm sm:w-2/3 sm:rounded-lg sm:bg-opacity-75 sm:px-2"
                    }
                    flight={flight}
                />
            ))}
        </div>
    );
});
