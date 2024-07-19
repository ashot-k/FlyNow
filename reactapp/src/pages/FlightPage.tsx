import { Button } from "@headlessui/react";
import FlightScheduleTable from "../components/flight/FlightScheduleTable";
import UserDetails from "../components/UserDetails";
import React from "react";
import { Flight } from "../components/flight/FlightCard";

interface FlightPageProps {
    flight: Flight;
    className?: string;
}

export default function FlightPage({ flight }: FlightPageProps) {
    return (
        <div
            className={
                "flex h-full w-full flex-col items-center justify-start gap-6 bg-flyNow-component pb-6 shadow-md shadow-black sm:h-5/6 sm:w-1/2 sm:rounded-xl sm:px-12"
            }>
            <div
                className={
                    "flex w-full flex-col items-center bg-flyNow-secondary py-3 text-center text-2xl sm:bg-transparent"
                }>
                Booking Confirmation
                <hr className={"mt-2 hidden w-1/2 border-gray-500 sm:block"} />
            </div>
            <div
                className={
                    "flex w-full flex-col items-start gap-6 overflow-y-auto sm:flex-row sm:justify-between sm:px-1"
                }>
                <div className={"flex h-2/3 w-full flex-col gap-2 px-1 sm:h-full sm:w-7/12"}>
                    <h1 className={"px-2 text-xl"}>Complete Schedule</h1>
                    <FlightScheduleTable
                        className={
                            "flex h-full w-full animate-fadeIn flex-col items-center gap-5 overflow-y-auto border-y-2 border-y-flyNow-secondary px-2 py-5 pt-5 sm:px-3"
                        }
                        flight={flight}
                    />
                </div>
                <div className={"flex w-full flex-col gap-2 px-5 sm:w-5/12"}>
                    <h1 className={"text-xl"}>Traveler</h1>
                    <hr className={"border-gray-500 pt-5"} />
                    <UserDetails className={"flex w-full flex-col items-center gap-3.5"} />
                </div>
            </div>
            <div className={"px-2 text-lg"}>Available Seats: {flight.numberOfBookableSeats}</div>
            <div className={"flex w-full justify-center gap-5 px-2 text-sm sm:justify-end sm:text-lg"}>
                <Button
                    className={
                        "w-1/4 rounded-lg bg-gray-500 py-1.5 transition duration-500 hover:bg-gray-400 sm:w-1/6"
                    }>
                    <span className={"font-bold"}>
                        Book for {flight.price.total} {flight.price.currency}
                    </span>
                </Button>
            </div>
        </div>
    );
}
