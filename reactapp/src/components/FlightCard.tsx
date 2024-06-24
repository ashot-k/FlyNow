import {calculateStops, flightDateToStringShort, flightDateToStringTime,} from "../utils/Utils";
import React, {useContext, useState} from "react";
import {AuthContext} from "../context";
import {axiosFlyNow} from "../services/FlyNowServiceAPI";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import airlines from '../utils/airlines.json';
import ArrowRight from '../static/assets/arrow-right.svg'
import {
    Button,
    Dialog,
    DialogPanel,
    DialogTitle,
    Disclosure,
    DisclosureButton,
    DisclosurePanel
} from "@headlessui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLongArrowDown} from '@fortawesome/free-solid-svg-icons'
import FlightScheduleTable from "./FlightScheduleTable";

export interface Flight {
    itineraries: {
        segments: {
            departure: {
                at: string;
                iataCode: string;
            };
            arrival: {
                at: string;
                iataCode: string
            };
        }[];
    }[],
    validatingAirlineCodes: string,
    numberOfBookableSeats: number,
    price: {
        total: number,
        currency: string;
    }
}

export interface Dictionaries {
    carriers: {
        [code: string]: string;
    },
    locations: {
        [code: string]: {
            cityCode: string;
            countryCode: string;
        };
    },
    "aircraft": {
        [code: string]: string;
    },
}

interface FlightCardProps {
    flight: Flight,
    dictionaries: Dictionaries,
    className?: string
}


export default function FlightCard({flight, dictionaries, className}: FlightCardProps) {
    const userData = useContext(AuthContext);
    const navigate = useNavigate();
    const outboundStart = flight.itineraries[0]?.segments[0].departure.at;
    const outboundEnd = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.at;

    const destination = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.iataCode
    const returnStart = flight.itineraries[1]?.segments[0].departure.at;
    const returnEnd = flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at;


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let location = useLocation();
    const airlineInfo = airlines.find(airline => airline.name.toLowerCase() === dictionaries?.carriers[flight.validatingAirlineCodes]?.toLowerCase());

    let totalFlights = flight.itineraries[0].segments.length
    if (flight.itineraries[1])
        totalFlights += flight.itineraries[1].segments.length;

    function book(flight: Flight) {
        if (!userData?.username) {
            return navigate("/login", {state: {prevURL: location.pathname + location.search}})
        }

        handleClose()
       /* let flights = [];
        flights.push({
            origin: flight.itineraries[0].segments[0].departure.iataCode,
            destination: flight.itineraries[flight.itineraries.length - 1]
                .segments[flight.itineraries[flight.itineraries.length - 1].segments.length - 1]
                .arrival.iataCode,
            departureDate: flight.itineraries[0].segments[0].departure.at,
            price: flight.price.total
        })
        axiosFlyNow.post("flight/book", flights).then(r => {
            if (r.status === 200) {
                handleClose();
            }

        });*/
    }

    return (
        <div className={className}>
            <div className={"w-full flex items-start justify-between font-bold text-white rounded-t-lg"}>
                <div className={"w-full p-2 gap-2 flex justify-between items-center sm:items-center"}>
                    <div className={"flex items-center sm:items-center gap-2"}>
                        <img
                            className={"relative top-0 left-0 size-12  sm:size-16 rounded-full"}
                            src={airlineInfo?.logo || "https://www.emme2servizi.it/wp-content/uploads/2020/12/no-image.jpg"}
                            alt={"image unavailable"}/>
                        <span
                            className={"w-3/4 sm:ps-2 sm:pt-0 text-sm sm:text-sm text-start overflow-auto"}>{dictionaries.carriers[flight.validatingAirlineCodes]} ({flight.validatingAirlineCodes})</span>
                    </div>
                    <div className={"w-1/3 p-2 px-5 flex h-full flex-col justify-end items-center sm:items-center"}>
                        <span className={'text-sm text-end'}>Flights: {totalFlights}</span>
                        <span
                            className={'text-sm text-end'}>Stops: {calculateStops(flight.itineraries[0].segments)}</span>
                    </div>
                </div>

            </div>
            <div className={"w-full flex justify-center"}>
                <hr className={"w-5/6 border-gray-500"}/>
            </div>
            <Disclosure as={"div"} className={"sm:px-8"} defaultOpen={false}>
                <DisclosureButton
                    className={"group relative flex w-full items-center justify-between hover:scale-y-105   transition-all duration-500"}>
                    <div className={"w-full flex flex-col items-center justify-start"}>
                        {flight.itineraries[0] &&
                            <div>
                                <div className={"flex justify-center"}>
                                        <span className={"text-lg"}>Outbound <span className={"text-blue-400"}>
                                                {flightDateToStringShort(outboundStart)}
                                            </span>
                                        </span>
                                </div>
                                <div className={"flex items-center justify-center text-xl gap-2"}>
                                    <span> {flightDateToStringTime(outboundStart)}</span>
                                    <img src={ArrowRight} className={"size-5"} alt={''}/>
                                    <span> {flightDateToStringTime(outboundEnd)}</span>
                                </div>
                            </div>}
                        {flight.itineraries[1] &&
                            <>
                                <div className={"flex justify-center"}>
                                             <span className={"text-lg"}>Return <span className={"text-blue-400"}>
                                                 {flightDateToStringShort(returnStart)}
                                                </span>
                                            </span>
                                </div>
                                <div className={"flex items-center justify-center text-xl gap-2"}>
                                    <span> {flightDateToStringTime(returnStart)}</span>
                                    <img src={ArrowRight} className={"size-5"} alt={''}/>
                                    <span> {flightDateToStringTime(returnEnd)}</span>
                                </div>
                            </>}
                    </div>
                    <FontAwesomeIcon icon={faLongArrowDown}
                                     className="absolute right-5 sm:right-0 size-7 hover:text-emerald-400 transition-colors duration-300 group-data-[open]:rotate-180"/>
                </DisclosureButton>
                <DisclosurePanel className="sm:px-1 overflow-auto text-sm">
                    <FlightScheduleTable className={"mt-5 animate-fadeIn flex flex-col gap-5 w-full"} flight={flight}
                                         dictionaries={dictionaries}/>
                </DisclosurePanel>
            </Disclosure>
            <div className={"flex justify-center items-center px-5 py-4"}>
                <button
                    className={"w-4/6 lg:w-5/6 xl:w-5/12 bg-flyNow-light outline-flyNow-light  outline px-1 py-1 rounded-xl"}
                    onClick={() => handleShow()}>Book
                    for <span className={"font-bold"}>{flight.price.total} {flight.price.currency}</span></button>
            </div>
            <Dialog open={show} onClose={handleClose} className={"relative z-20 text-white"}>
                <div
                    className={"fixed top-8 h-screen animate-fadeIn flex w-full items-center justify-center backdrop-blur-sm sm:backdrop-blur-md"}>
                    <DialogPanel
                        className={"sm:mt-6 py-5 sm:w-1/2 sm:px-12 h-5/6 bg-flyNow-component outline outline-2 outline-flyNow-light w-full  sm:rounded-xl flex flex-col justify-center items-start gap-5"}>
                        <DialogTitle className={"w-full text-center text-3xl"}>Booking Confirmation</DialogTitle>
                        <hr className={"w-full border-gray-500"}/>
                        <div
                            className={"sm:px-1 overflow-y-scroll w-full flex flex-col sm:flex-row items-start justify-between gap-5"}>
                            <FlightScheduleTable
                                className={"animate-fadeIn items-center flex flex-col gap-2 w-full sm:w-5/12"}
                                flight={flight}
                                dictionaries={dictionaries}/>
                            <div className={"px-5 flex flex-col gap-2 w-full sm:w-6/12"}>
                                <h1 className={"text-3xl"}>Traveler</h1>
                                <hr className={"border-gray-500 pt-5 "}/>
                                <div>
                                    <h1 className={"text-xl"}>Username: {userData?.username}</h1>
                                    <h1 className={"text-xl"}>//more info//</h1>
                                </div>
                            </div>
                        </div>
                        <div className={"w-full px-1 flex justify-center sm:justify-end gap-5"}>
                            <Button
                                className={"transition duration-500 w-4/12 text-lg sm:text-xl sm:w-1/6 bg-gray-500 sm:outline-gray-500  sm:outline-2  sm:outline px-2 py-2 rounded-lg"}
                                onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                className={"transition duration-500 w-7/12 text-lg sm:text-xl sm:w-1/4 bg-flyNow-light sm:outline-flyNow-light sm:outline-2 sm:outline px-5 sm:px-2 py-2 rounded-lg"}
                                onClick={() => book(flight)}>
                                Book for <span
                                className={"font-bold"}>{flight.price.total} {flight.price.currency}</span>
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};
