import Flag from "react-flagkit";
import {Accordion, Modal, Table} from "react-bootstrap";
import {
    calculateStops,
    flightDateToStringNoYear,
    flightDateToStringShort,
    flightDateToStringTime,
    getAirportByIATA
} from "../utils/Utils";
import ArrowRight from '../static/arrow-right.svg'
import {useContext, useState} from "react";
import {AuthContext} from "../context";
import Button from "react-bootstrap/Button";
import {axiosFlyNow} from "../services/FlyNowServiceAPI";
import {useNavigate} from "react-router-dom";
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
    dictionaries: Dictionaries
}

const FlightCard = ({flight, dictionaries}: FlightCardProps) => {
    const userData = useContext(AuthContext);
    const navigate = useNavigate();
    const outboundStart = flight.itineraries[0]?.segments[0].departure.at;
    const outboundEnd = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.at;

    const returnStart = flight.itineraries[1]?.segments[0].arrival.at;
    const returnEnd = flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function bookConfirmModal(flight: Flight) {
        handleShow();
        if (!userData?.username) {
            navigate("/login")
        }
        let flights = [];

        flights.push({
            origin: flight.itineraries[0].segments[0].departure.iataCode,
            destination: flight.itineraries[flight.itineraries.length - 1]
                .segments[flight.itineraries[flight.itineraries.length - 1].segments.length - 1]
                .arrival.iataCode,
            departureDate: flight.itineraries[0].segments[0].departure.at,
            price: flight.price.total
        })
        axiosFlyNow.post("flight/book", flights).then(r=> {
            if(r.status === 200)
                handleClose();
        });
    }

    return (
        <div className={"flight-card component-box element-shadow rounded-2 p-3 d-flex flex-column gap-2"}>
            <div className={"d-flex flex-column w-100"}>
                <div className={"h5"}>
                    Airline: {dictionaries.carriers[flight.validatingAirlineCodes]}
                </div>
                <hr className={"w-100 mt-1 m-auto"}/>
            </div>
            <Accordion flush>
                <Accordion.Item eventKey="0" className={'bg-transparent'}>
                    <Accordion.Header className={'bg-transparent'}>
                        <div className={"d-flex flex-column gap-4 align-items-center justify-content-start w-100"}>
                            {flight.itineraries[0] &&
                                <div className={'d-grid gap-2 align-items-start w-100'}>
                                    <div className={"d-flex justify-content-between"}>
                                        <span className={"fs-5"}>Outbound
                                        <span style={{color: "cornflowerblue"}}
                                              className={'fs-5'}> {flightDateToStringShort(outboundStart)}  </span></span>
                                        <span className={'fs-6'}>
                                        Flights {flight.itineraries[0].segments.length} &
                                        Stops {calculateStops(flight.itineraries[0].segments)}</span>
                                    </div>
                                    <div className={"d-flex align-items-center justify-content-center gap-2"}>
                                        <span className={"fs-5"}> {flightDateToStringTime(outboundStart)}</span>
                                        <img src={ArrowRight} width={'24px'} alt={''}/>
                                        <span className={"fs-5"}> {flightDateToStringTime(outboundEnd)}</span>
                                    </div>
                                </div>}
                            {flight.itineraries[1] &&
                                <>
                                    <hr className={"w-100 m-0"}/>
                                    <div className={'d-grid gap-2 align-items-start w-100'}>
                                        <div className={"d-flex justify-content-between"}>
                                        <span className={"fs-5"}>Return
                                        <span style={{color: "cornflowerblue"}}
                                              className={'fs-5'}> {flightDateToStringShort(returnStart)}  </span></span>
                                            <span className={'fs-6'}>
                                        Flights {flight.itineraries[1].segments.length} &
                                        Stops {calculateStops(flight.itineraries[1].segments)}</span>
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
                        {flight.itineraries.map((itinerary: any, index: any) => {
                            return <>
                                {index === 0 ?
                                    <h4 className={"h5 text-center"}>Outbound {flightDateToStringShort(outboundStart)}</h4> :
                                    <h5 className={"h5 text-center"}>Return {flightDateToStringShort(returnStart)}</h5>}
                                <Table key={index} responsive
                                       size={"sm"} hover className={"table-transparent"}>
                                    <tbody>
                                    <tr>
                                        <th>Origin</th>
                                        <th>Departure</th>
                                        <th>Destination</th>
                                        <th>Arrival</th>
                                        <th>Code</th>
                                    </tr>
                                    {itinerary.segments.map((segment: any, index: any) => <tr
                                        key={index}>
                                        <td>
                                            <Flag
                                                country={dictionaries.locations[segment.departure.iataCode].countryCode}/>{' '}
                                            {getAirportByIATA(segment.departure.iataCode)?.city || ""}{', '}
                                            {getAirportByIATA(segment.departure.iataCode)?.name || ""}{' '} ({segment.departure.iataCode})
                                        </td>
                                        <td>
                                            {flightDateToStringNoYear(segment.departure.at)}
                                        </td>
                                        <td>
                                            <Flag
                                                country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>{' '}
                                            {getAirportByIATA(segment.arrival.iataCode)?.city || ""}{', '}
                                            {getAirportByIATA(segment.arrival.iataCode)?.name || ""}{' '}({segment.arrival.iataCode})
                                        </td>
                                        <td>
                                            {flightDateToStringNoYear(segment.arrival.at)}
                                        </td>
                                        <td>{segment.carrierCode}{segment.number}</td>
                                    </tr>)}
                                    </tbody>
                                </Table>
                            </>
                        })}
                        <div className={"h5"}>
                            Available Seats: {flight.numberOfBookableSeats}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <div className={"w-100 d-flex justify-content-center align-items-center gap-3"}>
                <button className={"btn book-btn"} onClick={() => bookConfirmModal(flight)}>Book
                    for <span className={"fw-bold"}>{flight.price.total} {flight.price.currency}</span></button>
                <Modal show={show} onHide={handleClose} size={"xl"} centered data-bs-theme="dark"
                       className={"text-white"}>
                    <Modal.Header closeButton>
                        <Modal.Title>Booking Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h3>Flight </h3>
                        <h5>Airline: {dictionaries.carriers[flight.validatingAirlineCodes]}</h5>
                        {flight.itineraries.map((itinerary: any, index: any) => {
                            return <>
                                {index === 0 ?
                                    <h4 className={"h5 text-center"}>Outbound <span
                                        style={{color: "cornflowerblue"}}>{flightDateToStringShort(outboundStart)}</span>
                                    </h4> :
                                    <h4 className={"h5 text-center"}>Return <span
                                        style={{color: "cornflowerblue"}}>{flightDateToStringShort(returnStart)}</span>
                                    </h4>}
                                <table key={index}
                                       className={"table table-sm table-transparent overflow-auto table-hover table-responsive-sm"}>
                                    <tbody>
                                    <tr>
                                        <th>Origin</th>
                                        <th>Departure</th>
                                        <th>Destination</th>
                                        <th>Arrival</th>
                                        <th>Code</th>
                                    </tr>
                                    {itinerary.segments.map((segment: any, index: any) => <tr
                                        key={index}>
                                        <td>
                                            <Flag
                                                country={dictionaries.locations[segment.departure.iataCode].countryCode}/>{' '}
                                            {getAirportByIATA(segment.departure.iataCode)?.city || ""}{', '}
                                            {getAirportByIATA(segment.departure.iataCode)?.name || ""}{' '} ({segment.departure.iataCode})
                                        </td>
                                        <td>
                                            {flightDateToStringNoYear(segment.departure.at)}
                                        </td>
                                        <td>
                                            <Flag
                                                country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>{' '}
                                            {getAirportByIATA(segment.arrival.iataCode)?.city || ""}{', '}
                                            {getAirportByIATA(segment.arrival.iataCode)?.name || ""}{' '}({segment.arrival.iataCode})
                                        </td>
                                        <td>
                                            {flightDateToStringNoYear(segment.arrival.at)}
                                        </td>
                                        <td>{segment.carrierCode}{segment.number}</td>
                                    </tr>)}
                                    </tbody>
                                </table>
                            </>
                        })}
                        <div>
                            <h3>Traveler </h3>
                            <h6>Username: {userData?.username}</h6>
                            <h6>//more info//</h6>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="gap-3 justify-content-center">
                        <Button size={"lg"} variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button size={"lg"} variant={"btn app-btn"}>
                            Book for <span className={"fw-bold"}>{flight.price.total} {flight.price.currency}</span>
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default FlightCard;
