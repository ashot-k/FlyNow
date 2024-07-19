import { Flight } from "../flight/FlightCard";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import FlightScheduleTable from "../flight/FlightScheduleTable";
import UserDetails from "../UserDetails";
import React, { useContext } from "react";
import { AuthContext } from "../../context";
import { useLocation, useNavigate } from "react-router-dom";

interface FlightOfferDetailsProps {
    className?: string;
    flight: Flight;
    toggle: () => void;
    isOpen: boolean;
}

export default function FlightOfferDetails({ className, flight, toggle, isOpen }: FlightOfferDetailsProps) {
    const userData = useContext(AuthContext);
    const navigate = useNavigate();
    let location = useLocation();

    function book(flight: Flight) {
        if (!userData?.username) {
            return navigate("/login", {
                state: { prevURL: location.pathname + location.search },
            });
        }
    }

    return (
        <Dialog open={isOpen} onClose={toggle} className={className}>
            <div className={"fixed inset-0 flex w-full animate-fadeIn items-center justify-center sm:backdrop-blur-lg"}>
                <DialogPanel
                    className={
                        "flex h-full w-full flex-col items-center justify-start gap-6 bg-flyNow-component pb-6 shadow-md shadow-black sm:h-5/6 sm:w-full sm:rounded-xl sm:px-12 lg:w-2/3"
                    }>
                    <DialogTitle
                        className={
                            "flex w-full flex-col items-center bg-flyNow-secondary py-3 text-center text-2xl sm:bg-transparent"
                        }>
                        Booking Confirmation
                        <hr className={"mt-2 hidden w-1/2 border-gray-500 sm:block"} />
                    </DialogTitle>
                    <div
                        className={
                            "flex w-full flex-col items-start gap-6 overflow-y-auto sm:flex-row sm:justify-between sm:px-1"
                        }>
                        <div className={"flex w-full flex-col gap-2 px-1 sm:h-full sm:w-7/12"}>
                            <h1 className={"px-2 text-lg"}>Complete Schedule</h1>
                            <FlightScheduleTable
                                className={
                                    "flex h-full w-full animate-fadeIn flex-col items-center gap-5 overflow-y-auto border-y-2 border-y-flyNow-secondary px-2 py-5 pt-5 text-sm sm:px-3"
                                }
                                flight={flight}
                            />
                        </div>
                        <div className={"flex w-full flex-col gap-2 px-5 sm:w-5/12"}>
                            <h1 className={"text-lg"}>Traveler</h1>
                            <hr className={"border-gray-500 pt-5"} />
                            <UserDetails className={"flex w-full flex-col items-center gap-3.5 text-base"} />
                        </div>
                    </div>
                    <div className={"px-2 text-base"}>Available Seats: {flight.numberOfBookableSeats}</div>
                    <div className={"flex w-full justify-center gap-5 px-2 text-sm sm:justify-end sm:text-lg"}>
                        <Button
                            className={
                                "w-1/4 rounded-lg bg-gray-500 py-1.5 transition duration-500 hover:bg-gray-400 sm:w-1/6"
                            }
                            onClick={toggle}>
                            Cancel
                        </Button>
                        <Button
                            className={
                                "w-7/12 rounded-lg bg-flyNow-light py-1.5 transition duration-500 hover:bg-flyNow-secondary sm:w-1/3 sm:px-4"
                            }
                            onClick={() => book(flight)}>
                            Book for{" "}
                            <span className={"font-bold"}>
                                {flight.price.total} {flight.price.currency}
                            </span>
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
