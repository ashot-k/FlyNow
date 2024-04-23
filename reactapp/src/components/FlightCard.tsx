import Flag from "react-flagkit";
import axios from "axios";
import {Accordion} from "react-bootstrap";
import {
    calculateStops,
    flightDateToStringFull, flightDateToStringNoYear,
    flightDateToStringShort,
    flightDateToStringTime,
    getAirport
} from "../utils/Utils";
import ArrowRight from '../static/arrow-right.svg'

const FlightCard = ({flight, destination, origin, dictionaries}: any) => {
    let cityCodeToName = new Intl.DisplayNames(['en'], {type: 'region'})

    const outboundStart = flight.itineraries[0].segments[0].departure.at;
    const outboundEnd = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at;

    const returnStart = flight.itineraries[1]?.segments[0].arrival.at;
    const returnEnd = flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at;

    function priceConfirm() {
        axios.post("https://test.api.amadeus.com/v1/shopping/flight-offers/pricing", flight, {
            headers: {
                'X-HTTP-Method-Override': 'GET'
            }
        }).then(r => console.log(r))
    }

    return (
        <div className={"flight-card rounded-2 p-4 d-flex flex-column gap-2 align-items-center"}>
            <div className={"d-flex justify-content-between w-100"}>
                <div className={"h3"}>
                    Airline: {dictionaries.carriers[flight.validatingAirlineCodes]}
                </div>
                <div className={"h5"}>
                    Available Seats: {flight.numberOfBookableSeats}
                </div>
            </div>
            <Accordion flush>
                <Accordion.Item eventKey="0" className={'bg-transparent'}>
                    <Accordion.Header className={'bg-transparent'}>
                        <div className={"d-flex flex-column gap-2 align-items-center justify-content-start w-100"}>
                            {flight.itineraries[0] &&
                                <div className={'d-grid gap-2 align-items-start justify-content-center w-75'}>
                                    <span className={'fs-6'}>Outbound {flightDateToStringShort(outboundStart)}</span>
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
                                    <span className={'fs-6'}>Return {flightDateToStringShort(returnStart)}</span>
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
                    <Accordion.Body>
                        {flight.itineraries[0] &&
                            <h4 className={"h5 text-center"}>Outbound {flightDateToStringShort(outboundStart)}</h4>}
                        {flight.itineraries[0] &&
                            <table className={"table table-transparent table-hover table-responsive-sm"}>
                                <tbody>
                                <tr>
                                    <th>Origin</th>
                                    <th>Departure</th>
                                    <th>Destination</th>
                                    <th>Arrival</th>
                                    <th>Code</th>
                                </tr>
                                {flight.itineraries[0].segments.map((segment: any, index: any) => <tr key={index}>
                                    <td>
                                        <Flag
                                            country={dictionaries.locations[segment.departure.iataCode].countryCode}/>{' '}
                                        {getAirport(segment.departure.iataCode)?.city || ""}{', '}
                                        {getAirport(segment.departure.iataCode)?.name || ""}{' '} ({segment.departure.iataCode})
                                    </td>
                                    <td>
                                        {flightDateToStringNoYear(segment.departure.at)}
                                    </td>
                                    <td>
                                        <Flag
                                            country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>{' '}
                                        {getAirport(segment.arrival.iataCode)?.city || ""}{', '}
                                        {getAirport(segment.arrival.iataCode)?.name || ""}{' '}({segment.arrival.iataCode})
                                    </td>
                                    <td>
                                        {flightDateToStringNoYear(segment.arrival.at)}
                                    </td>
                                    <td>{segment.carrierCode}{segment.number}</td>
                                </tr>)}
                                </tbody>
                            </table>}
                        {flight.itineraries[1] &&
                            <h5 className={"h4 text-center"}>Return {flightDateToStringShort(returnStart)}</h5>}
                        {flight.itineraries[1] &&
                            <table className={"table table-transparent table-hover table-responsive-sm"}>
                                <tbody>
                                <tr>
                                    <th>Origin</th>
                                    <th>Departure</th>
                                    <th>Destination</th>
                                    <th>Arrival</th>
                                    <th>Code</th>
                                </tr>
                                {flight.itineraries[1].segments.map((segment: any, index: any) => <tr key={index}>
                                    <td>
                                        <Flag
                                            country={dictionaries.locations[segment.departure.iataCode].countryCode}/>{' '}
                                        {getAirport(segment.departure.iataCode)?.city || ""}{', '}
                                        {getAirport(segment.departure.iataCode)?.name || ""}{' '} ({segment.departure.iataCode})
                                    </td>
                                    <td>
                                        {flightDateToStringNoYear(segment.departure.at)}
                                    </td>
                                    <td>
                                        <Flag
                                            country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>{' '}
                                        {getAirport(segment.arrival.iataCode)?.city || ""}{', '}
                                        {getAirport(segment.arrival.iataCode)?.name || ""}{' '}({segment.arrival.iataCode})
                                    </td>
                                    <td>
                                        {flightDateToStringNoYear(segment.arrival.at)}
                                    </td>
                                    <td>{segment.carrierCode}{segment.number}</td>
                                </tr>)}
                                </tbody>
                            </table>}
                        <div className={"h5"}>
                            Available Seats: {flight.numberOfBookableSeats}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {/*
              const [show, setShow] = useState(false);
              const handleClose = () => setShow(false);
              const handleShow = () => setShow(true);
            <Modal show={show} onHide={handleClose} size={'lg'} contentClassName={'p-3'} data-bs-theme={'dark'} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className={"d-flex justify-content-between w-100"}>
                            <div className={"h3"}>
                                Airline: {dictionaries.carriers[flight.validatingAirlineCodes]}
                            </div>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {flight.itineraries[0] &&
                        <h4 className={"h5 text-center"}>Outbound {flightDateToStringShort(flight.itineraries[0].segments[0].departure.at)}</h4>}
                    {flight.itineraries[0] &&
                        <table className={"table table-transparent table-hover table-responsive-sm"}>
                            <tbody>
                            <tr>
                                <th>Origin</th>
                                <th>Departure</th>
                                <th>Destination</th>
                                <th>Arrival</th>
                                <th>Date</th>
                                <th>Code</th>
                            </tr>
                            {flight.itineraries[0].segments.map((segment: any, index: any) => <tr key={index}>
                                <td>
                                    <Flag
                                        country={dictionaries.locations[segment.departure.iataCode].countryCode}/>{' '}
                                    {getAirport(segment.departure.iataCode)?.city || ""}{', '}
                                    {getAirport(segment.departure.iataCode)?.name || ""}{' '} ({segment.departure.iataCode})
                                </td>
                                <td>
                                    {segment.departure.at.split('T')[1]}
                                </td>
                                <td>
                                    <Flag
                                        country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>{' '}
                                    {getAirport(segment.arrival.iataCode)?.city || ""}{', '}
                                    {getAirport(segment.arrival.iataCode)?.name || ""}{' '}({segment.arrival.iataCode})
                                </td>
                                <td>
                                    {flightDateToStringFull(segment.arrival.at)}
                                </td>
                                <td>{segment.departure.at.split('T')[0]}</td>
                                <td>{segment.carrierCode}{segment.number}</td>
                            </tr>)}
                            </tbody>
                        </table>}
                    {flight.itineraries[1] && <h5 className={"h4 text-center"}>Return</h5>}
                    {flight.itineraries[1] &&
                        <table className={"table table-transparent table-hover table-responsive-sm"}>
                            <tbody>
                            <tr>
                                <th>Origin</th>
                                <th>Departure</th>
                                <th>Destination</th>
                                <th>Arrival</th>
                                <th>Date</th>
                                <th>Code</th>
                            </tr>
                            {flight.itineraries[1].segments.map((segment: any, index: any) => <tr key={index}>
                                <td>
                                    <Flag
                                        country={dictionaries.locations[segment.departure.iataCode].countryCode}/>{' '}
                                    {getAirport(segment.departure.iataCode)?.city || ""}{', '}
                                    {getAirport(segment.departure.iataCode)?.name || ""}{' '}({segment.departure.iataCode})
                                </td>
                                <td>
                                    {segment.departure.at.split('T')[1]}
                                </td>
                                <td>
                                    <Flag
                                        country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>{' '}
                                    {getAirport(segment.arrival.iataCode)?.city || ""}{', '}
                                    {getAirport(segment.arrival.iataCode)?.name || ""}{' '}({segment.arrival.iataCode})
                                </td>
                                <td>
                                    {segment.arrival.at.split('T')[1]}
                                </td>
                                <td>{segment.departure.at.split('T')[0]}</td>
                                <td>{segment.carrierCode}{segment.number}</td>
                            </tr>)}
                            </tbody>
                        </table>}
                    <div className={"h5"}>
                        Available Seats: {flight.numberOfBookableSeats}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className={"w-50 btn book-btn"} onClick={priceConfirm}>Book
                        for {flight.price.total} {flight.price.currency}</button>
                </Modal.Footer>
            </Modal>*/}
            <div className={"w-100 d-flex justify-content-center gap-3"}>
                <button className={"btn book-btn"} onClick={priceConfirm}>Book
                    for {flight.price.total} {flight.price.currency}</button>
            </div>
        </div>
    );
};

export default FlightCard;
