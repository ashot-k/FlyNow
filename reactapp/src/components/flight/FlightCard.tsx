import { calculateStops } from "../../utils/Utils";
import React, { useContext, useMemo, useState } from "react";
import { DictionariesContext } from "../../context";
import airlines from "../../utils/airlines.json";
import FlightOfferDetails from "../modals/FlightOfferDetails";
import FlightCardDisclosure from "./FlightCardDisclosure";

export interface Flight {
    itineraries: {
        segments: {
            departure: {
                at: string;
                iataCode: string;
            };
            arrival: {
                at: string;
                iataCode: string;
            };
        }[];
    }[];
    validatingAirlineCodes: string;
    numberOfBookableSeats: number;
    price: {
        total: number;
        currency: string;
    };
}

export interface Dictionaries {
    carriers: {
        [code: string]: string;
    };
    locations: {
        [code: string]: {
            cityCode: string;
            countryCode: string;
        };
    };
    aircraft: {
        [code: string]: string;
    };
}

interface FlightCardProps {
    flight: Flight;
    className?: string;
}

export default function FlightCard({ flight, className }: FlightCardProps) {
    const dictionaries = useContext(DictionariesContext);
    const airlineInfo = useMemo(
        () =>
            airlines.find(
                (airline) =>
                    airline.name.toLowerCase() === dictionaries?.carriers[flight.validatingAirlineCodes]?.toLowerCase(),
            ),
        [dictionaries?.carriers, flight.validatingAirlineCodes],
    );
    const totalFlights = useMemo(() => {
        let count = flight.itineraries[0].segments.length;
        if (flight.itineraries[1]) count += flight.itineraries[1].segments.length;
        return count;
    }, [flight.itineraries]);
    const [showModal, setShowModal] = useState(false);

    function toggle() {
        setShowModal(!showModal);
    }

    return (
        <div className={className}>
            <div className={"flex w-full items-start justify-between font-bold text-white"}>
                <div className={"flex w-full items-center justify-between gap-2 p-2 sm:items-center"}>
                    <div className={"flex items-center gap-2 sm:items-center"}>
                        <img
                            loading={"lazy"}
                            className={"relative left-0 top-0 size-12 rounded-full sm:size-16"}
                            src={
                                airlineInfo?.logo ||
                                "https://www.emme2servizi.it/wp-content/uploads/2020/12/no-image.jpg"
                            }
                            alt={"image unavailable"}
                        />
                        <span className={"w-3/4 overflow-auto text-start text-sm sm:ps-2 sm:pt-0"}>
                            {dictionaries?.carriers[flight.validatingAirlineCodes]} ({flight.validatingAirlineCodes})
                        </span>
                    </div>
                    <div className={"flex h-full w-1/3 flex-col items-end justify-end py-2 pe-2 ps-5"}>
                        <span className={"text-end text-sm"}>Flights {totalFlights}</span>
                        <span className={"text-end text-sm"}>
                            Stops {calculateStops(flight.itineraries[0].segments)}
                        </span>
                    </div>
                </div>
            </div>
            <FlightCardDisclosure flight={flight} />
            <div className={"flex items-center justify-center px-5 py-4"}>
                <button
                    onClick={toggle}
                    className={
                        "w-2/3 rounded-xl bg-flyNow-light px-2 py-2 transition duration-500 hover:bg-flyNow-secondary lg:w-5/6 xl:w-5/12"
                    }>
                    Book for{" "}
                    <span className={"font-bold"}>
                        {flight.price.total} {flight.price.currency}
                    </span>
                </button>
            </div>
            <FlightOfferDetails
                className={"relative z-50 text-white"}
                flight={flight}
                isOpen={showModal}
                toggle={toggle}
            />
        </div>
    );
}
