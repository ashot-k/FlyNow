import {calculateStops, flightDateToStringShort, flightDateToStringTime,} from "../utils/Utils";
import React, {useContext, useState} from "react";
import {AuthContext} from "../context";
import {axiosFlyNow} from "../services/FlyNowServiceAPI";
import {useNavigate} from "react-router-dom";
import airlines from '../utils/airlines.json';
import ArrowRight from '../static/assets/arrow-right.svg'

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
            <div className={"w-full flex items-start justify-between"}>
                <div className={"w-3/4 p-2 flex items-start sm:items-center"}>
                    <img
                        className={"relative top-0 left-0 w-9 h-9 sm:w-12 sm:h-12 rounded-full "}
                        src={airlineInfo?.logo || "https://www.emme2servizi.it/wp-content/uploads/2020/12/no-image.jpg"}
                        alt={"image unavailable"}/>
                    <span
                        className={"w-3/4 pt-2 ps-2 sm:ps-2 sm:pt-0 text-xs sm:text-sm font-normal text-start overflow-auto"}>{dictionaries.carriers[flight.validatingAirlineCodes]} ({flight.validatingAirlineCodes})</span>
                </div>
                <div className={"w-1/4 flex flex-col justify-end px-3 pt-3"}>
                    <span className={'text-sm text-end'}>Flights: {totalFlights}</span>
                    <span
                        className={'text-sm text-end'}>Stops: {calculateStops(flight.itineraries[0].segments)}</span>
                </div>
            </div>
            <hr className={"border-gray-500 sm:hidden"}/>
            <div className={"w-full flex flex-col items-center justify-start"}>
                {flight.itineraries[0] &&
                    <div className={'grid gap-1 items-start'}>
                        <div className={"flex justify-center"}>
                                        <span className={"fs-5"}>Outbound
                                            <span style={{color: "cornflowerblue"}}
                                                  className={'fs-5'}> {flightDateToStringShort(outboundStart)}
                                            </span>
                                        </span>
                        </div>
                        <div className={"flex items-center justify-center gap-2"}>
                            <span className={"text-lg "}> {flightDateToStringTime(outboundStart)}</span>
                            <img src={ArrowRight} width={'24px'} alt={''}/>
                            <span className={"text-lg"}> {flightDateToStringTime(outboundEnd)}</span>
                        </div>
                    </div>}
                {flight.itineraries[1] &&
                    <>
                        <hr className={"w-75 m-0"}/>
                        <div className={'d-grid gap-1 align-items-start'}>
                            <div className={"d-flex justify-content-between"}>
                                            <span className={"fs-5"}>Return
                                                <span style={{color: "cornflowerblue"}}
                                                      className={'fs-5'}> {flightDateToStringShort(returnStart)}
                                                </span>
                                            </span>
                            </div>
                            <div className={"d-flex align-items-center justify-content-center gap-2"}>
                                <span className={"fs-5"}> {flightDateToStringTime(returnStart)}</span>
                                <img src={ArrowRight} width={'24px'} alt={''}/>
                                <span className={"fs-5"}> {flightDateToStringTime(returnEnd)}</span>
                            </div>
                        </div>
                    </>}
            </div>
            <div className={"flex justify-center items-center p-5"}>
                <button className={"w-3/4 lg:w-5/6 xl:w-1/2 bg-cyan-700 outline-cyan-700 outline px-3 py-1.5 rounded-xl"}
                        onClick={() => bookConfirmModal()}>Book
                    for <span className={"font-bold"}>{flight.price.total} {flight.price.currency}</span></button>
            </div>


            {/*<Accordion flush>
                <Accordion.Item eventKey="0" className={'bg-transparent'}>
                    <Accordion.Header className={'bg-transparent according-header'}>
                        <div className={"d-flex flex-column align-items-center justify-content-start w-100"}>
                            {flight.itineraries[0] &&
                                <div className={'d-grid gap-1 align-items-start'}>
                                    <div className={"d-flex justify-content-center"}>
                                        <span className={"fs-5"}>Outbound
                                            <span style={{color: "cornflowerblue"}}
                                                  className={'fs-5'}> {flightDateToStringShort(outboundStart)}
                                            </span>
                                        </span>
                                    </div>
                                    <div className={"d-flex align-items-center justify-content-center gap-2"}>
                                        <span className={"fs-5"}> {flightDateToStringTime(outboundStart)}</span>
                                        <img src={ArrowRight} width={'24px'} alt={''}/>
                                        <span className={"fs-5"}> {flightDateToStringTime(outboundEnd)}</span>
                                    </div>
                                </div>}
                            {flight.itineraries[1] &&
                                <>
                                    <hr className={"w-75 m-0"}/>
                                    <div className={'d-grid gap-1 align-items-start'}>
                                        <div className={"d-flex justify-content-between"}>
                                            <span className={"fs-5"}>Return
                                                <span style={{color: "cornflowerblue"}}
                                                      className={'fs-5'}> {flightDateToStringShort(returnStart)}
                                                </span>
                                            </span>
                                        </div>
                                        <div className={"d-flex align-items-center justify-content-center gap-2"}>
                                            <span className={"fs-5"}> {flightDateToStringTime(returnStart)}</span>
                                            <img src={ArrowRight} width={'24px'} alt={''}/>
                                            <span className={"fs-5"}> {flightDateToStringTime(returnEnd)}</span>
                                        </div>
                                    </div>
                                </>}
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className={"mt-3"}>
                        <FlightScheduleTable flight={flight} dictionaries={dictionaries}/>
                        <div className={"h5"}>
                            Available Seats: {flight.numberOfBookableSeats}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
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
