import Flag from "react-flagkit";
import axios from "axios";
import {Accordion} from "react-bootstrap";
import {
    calculateStops,
    flightDateToStringNoYear,
    flightDateToStringShort,
    flightDateToStringTime,
    getAirportByIATA
} from "../utils/Utils";
import ArrowRight from '../static/arrow-right.svg'
import {logSearchTerms} from "../services/FlyNowServiceAPI";
import {useContext} from "react";
import {AuthContext} from "../context";

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

    const outboundStart = flight.itineraries[0]?.segments[0].departure.at;
    const outboundEnd = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.at;

    const returnStart = flight.itineraries[1]?.segments[0].arrival.at;
    const returnEnd = flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at;

    function priceConfirm() {
        if (!userData?.username){
            window.location.href="/login"
        }
      //  logSearchTerms(flight.itineraries[0]?.segments[0].departure.iataCode, flight.itineraries[flight.itineraries.length - 1]?.segments[flight.itineraries[flight.itineraries.length - 1].segments.length - 1].arrival.iataCode)
       /* axios.post("https://test.api.amadeus.com/v1/shopping/flight-offers/pricing", flight, {
            headers: {
                'X-HTTP-Method-Override': 'GET'
            }
        }).then(r => console.log(r))*/
    }


    return (
        <div className={"flight-card element-shadow rounded-2 p-3 d-flex flex-column gap-2"}>
            <div className={"d-flex justify-content-between w-100"}>
                <div className={"h5"}>
                    Airline: {dictionaries.carriers[flight.validatingAirlineCodes]}
                </div>
            </div>
            <hr/>
            <Accordion flush>
                <Accordion.Item eventKey="0" className={'bg-transparent'}>
                    <Accordion.Header className={'bg-transparent'}>
                        <div className={"d-flex flex-column gap-2 align-items-center justify-content-start w-100"}>
                            {flight.itineraries[0] &&
                                <div className={'d-grid gap-2 align-items-start justify-content-center w-75'}>
                                    <span className={'fs-6'}>Outbound <span
                                        style={{color: "cornflowerblue"}}>{flightDateToStringShort(outboundStart)}</span></span>
                                    <div className={"d-flex align-items-center gap-2"}>
                                        <span className={"fs-4"}>{flightDateToStringTime(outboundStart)}</span>
                                        <img src={ArrowRight} width={'36px'} alt={''}/>
                                        <span className={"fs-4"}>{flightDateToStringTime(outboundEnd)},</span>
                                        <span
                                            className={"fs-4"}>{flight.itineraries[0].segments.length} flight(s) and {calculateStops(flight.itineraries[0].segments)} stop(s)</span>
                                    </div>
                                </div>}
                            {flight.itineraries[1] &&
                                <div className={'d-grid gap-2 align-items-center justify-content-center w-75'}>
                                    <span className={'fs-6'}>Return <span
                                        style={{color: "cornflowerblue"}}>{flightDateToStringShort(returnStart)}</span></span>
                                    <div className={"d-flex align-items-center gap-2"}>
                                        <span className={"fs-4"}>{flightDateToStringTime(returnStart)}</span>
                                        <img src={ArrowRight} width={'36px'} alt={''}/>
                                        <span className={"fs-4"}>{flightDateToStringTime(returnEnd)}</span>
                                        <span
                                            className={"fs-4"}>{flight.itineraries[1].segments.length} flight(s) and {calculateStops(flight.itineraries[1].segments)} stop(s)</span>
                                    </div>
                                </div>}
                        </div>
                    </Accordion.Header>

                    <Accordion.Body className={"mt-5"}>
                        {flight.itineraries.map((itinerarie: any, index: any) => {
                            return <>
                                {index === 0 ?
                                    <h4 className={"h5 text-center"}>Outbound {flightDateToStringShort(outboundStart)}</h4> :
                                    <h5 className={"h5 text-center"}>Return {flightDateToStringShort(returnStart)}</h5>}
                                <table
                                    className={"table table-sm table-transparent overflow-auto table-hover table-responsive-sm"}>
                                    <tbody>
                                    <tr>
                                        <th>Origin</th>
                                        <th>Departure</th>
                                        <th>Destination</th>
                                        <th>Arrival</th>
                                        <th>Code</th>
                                    </tr>
                                    {itinerarie.segments.map((segment: any, index: any) => <tr
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
                        <div className={"h5"}>
                            Available Seats: {flight.numberOfBookableSeats}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <div className={"w-100 d-flex justify-content-center align-items-center gap-3"}>
                <button className={"btn book-btn"} onClick={priceConfirm}>Book
                    for <span className={"price"}>{flight.price.total} {flight.price.currency}</span></button>
            </div>
        </div>
    );
};

export default FlightCard;
