import {calculateStops, flightDateToStringShort, flightDateToStringTime,} from "../utils/Utils";
import React, {useContext, useState} from "react";
import {AuthContext} from "../context";
import {axiosFlyNow} from "../services/FlyNowServiceAPI";
import {useNavigate} from "react-router-dom";
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
import {faArrowDown} from '@fortawesome/free-solid-svg-icons'
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

    const airlineInfo = airlines.find(airline => airline.name.toLowerCase() === dictionaries?.carriers[flight.validatingAirlineCodes]?.toLowerCase());

    let totalFlights = flight.itineraries[0].segments.length
    if (flight.itineraries[1])
        totalFlights += flight.itineraries[1].segments.length;

    function bookConfirmModal() {
        handleShow();
        if (!userData?.username) {
            navigate("/login")
        }
    }

    function book(flight: Flight) {
        let flights = [];
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
        });
    }

    return (
        <div className={className}>
            <div className={"w-full flex items-start justify-between font-bold text-white rounded-t-lg"}>
                <div className={"w-2/3 p-2 gap-2 flex items-center sm:items-center"}>
                    <img
                        className={"relative top-0 left-0 size-12  sm:size-16 rounded-full"}
                        src={airlineInfo?.logo || "https://www.emme2servizi.it/wp-content/uploads/2020/12/no-image.jpg"}
                        alt={"image unavailable"}/>
                    <span
                        className={"w-3/4 sm:ps-2 sm:pt-0 text-sm sm:text-sm text-start overflow-auto"}>{dictionaries.carriers[flight.validatingAirlineCodes]} ({flight.validatingAirlineCodes})</span>
                </div>
                <div className={"w-1/3 p-2 px-5 my-auto flex flex-col justify-end"}>
                    <span className={'text-sm text-end'}>Flights: {totalFlights}</span>
                    <span
                        className={'text-sm text-end'}>Stops: {calculateStops(flight.itineraries[0].segments)}</span>
                </div>
            </div>
            <div className={"w-full flex justify-center"}>
                <hr className={"w-5/6 border-gray-500 "}/>
            </div>
            <Disclosure as={"div"} className={"px-10"} defaultOpen={false}>
                <DisclosureButton className={"flex w-full items-center justify-between"}>
                    <div className={"w-1/12"}></div>
                    <div className={"w-10/12 flex flex-col items-center justify-start"}>
                        {flight.itineraries[0] &&
                            <div className={'grid gap-1 items-start'}>
                                <div className={"flex justify-center"}>
                                        <span className={"text-xl"}>Outbound <span className={"text-blue-400"}>
                                                {flightDateToStringShort(outboundStart)}
                                            </span>
                                        </span>
                                </div>
                                <div className={"flex items-center justify-center text-lg gap-2"}>
                                    <span> {flightDateToStringTime(outboundStart)}</span>
                                    <img src={ArrowRight} className={"w-6"} alt={''}/>
                                    <span> {flightDateToStringTime(outboundEnd)}</span>
                                </div>
                            </div>}
                        {flight.itineraries[1] &&
                            <>
                                <hr className={"w-75 m-0"}/>
                                <div className={'grid gap-1 items-start'}>
                                    <div className={"flex justify-center"}>
                                             <span className={"text-xl"}>Outbound <span className={"text-blue-400"}>
                                                 {flightDateToStringShort(returnStart)}
                                                </span>
                                            </span>
                                    </div>
                                    <div className={"flex items-center justify-center text-lg gap-2"}>
                                        <span> {flightDateToStringTime(returnStart)}</span>
                                        <img src={ArrowRight} className={"w-6"} alt={''}/>
                                        <span> {flightDateToStringTime(returnEnd)}</span>
                                    </div>
                                </div>
                            </>}
                    </div>
                    <FontAwesomeIcon icon={faArrowDown} className="w-1/12 size-7 group-data-[open]:rotate-180"/>
                </DisclosureButton>
                <DisclosurePanel className="p-2 overflow-auto text-sm">
                    <FlightScheduleTable className={"animate-fadeIn"} flight={flight} dictionaries={dictionaries}/>
                    <div className={"h5"}>
                        Available Seats: {flight.numberOfBookableSeats}
                    </div>
                </DisclosurePanel>
            </Disclosure>
            <div className={"flex justify-center items-center px-5 py-4"}>
                <button
                    className={"w-4/6 lg:w-5/6 xl:w-5/12 bg-flyNow-light outline-flyNow-light  outline px-3 py-2 rounded-xl"}
                    onClick={() => bookConfirmModal()}>Book
                    for <span className={"font-bold"}>{flight.price.total} {flight.price.currency}</span></button>
            </div>
            <Dialog open={show} onClose={handleClose} className={"relative z-100 text-white"}>
                <div
                    className={"fixed inset-0 animate-fadeIn flex w-full items-center justify-center sm:p-4 backdrop-blur-sm sm:backdrop-blur-md"}>
                    <DialogPanel
                        className={"bg-flyNow-component outline outline-3 outline-flyNow-light w-full p-5 sm:w-1/2 sm:px-12 sm:py-8 sm:rounded-xl flex flex-col justify-center items-start gap-3"}>
                        <DialogTitle className={"text-3xl"}>Booking Confirmation</DialogTitle>
                        <div className={"w-full flex-col flex gap-5"}>
                            <hr className={"border-t-gray-500 pt-5"}/>
                            <div>
                                <FlightScheduleTable className={"w-full overflow-auto"} flight={flight}
                                                     dictionaries={dictionaries}/>
                                <div className={"h5"}>
                                    Available Seats: {flight.numberOfBookableSeats}
                                </div>
                            </div>
                            <div>
                                <h1 className={"text-3xl"}>Traveler </h1>
                                <hr className={"border-gray-500 pt-5 "}/>
                                <div>
                                    <h1 className={"text-xl"}>Username: {userData?.username}</h1>
                                    <h1 className={"text-xl"}>//more info//</h1>
                                </div>
                            </div>
                            <div className={"flex justify-evenly sm:justify-end gap-5"}>
                                <Button  className={"transition duration-500 w-4/12 text-lg sm:text-xl sm:w-1/6 bg-gray-500 sm:outline-gray-500  sm:outline-2  sm:outline px-2 py-2 rounded-xl"}
                                         onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button  className={"transition duration-500 w-7/12 text-lg sm:text-xl sm:w-1/4 bg-flyNow-light  sm:outline-flyNow-light sm:outline-2 sm:outline px-2 py-2 rounded-xl"}
                                         onClick={() => book(flight)}>
                                    Book for <span
                                    className={"font-bold"}>{flight.price.total} {flight.price.currency}</span>
                                </Button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>

            </Dialog>

            {/*
            <div className={"w-100 d-flex justify-content-center align-items-center gap-3"}>
                <button className={"btn"} onClick={() => bookConfirmModal()}>Book
                    for <span className={"fw-bold"}>{flight.price.total} {flight.price.currency}</span></button>
                <Modal show={show} onHide={handleClose} size={"lg"}  centered data-bs-theme="dark"
                       className={"text-white"}>
                    <Modal.Header closeButton>
                        <Modal.Title>Booking Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"d-flex flex-column gap-4"}>
                        <div className={"w-100 d-flex align-items-center"}>
                            <img className={"airline-logo rounded-circle"}
                                 src={airlineInfo?.logo || "https://www.emme2servizi.it/wp-content/uploads/2020/12/no-image.jpg"}
                                 alt={"image unavailable"}/>
                            <span
                                className={"w-75 ps-2 fs-5 fw-medium text-start overflow-auto"}>{dictionaries.carriers[flight.validatingAirlineCodes]} ({flight.validatingAirlineCodes})</span>
                        </div>
                        <FlightScheduleTable flight={flight} dictionaries={dictionaries}/>
                        <div>
                            <h3>Traveler </h3>
                            <h6>Username: {userData?.username}</h6>
                            <h6>//more info//</h6>
                        </div>
                        <DestinationActivities className={"w-100 col-lg-12"} dest={destination}/>
                    </Modal.Body>
                    <Modal.Footer className="gap-3 justify-content-center">
                        <Button size={"lg"} variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button size={"lg"} variant={"btn"} onClick={() => book(flight)}>
                            Book for <span className={"fw-bold"}>{flight.price.total} {flight.price.currency}</span>
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>*/}
        </div>
    );
};
