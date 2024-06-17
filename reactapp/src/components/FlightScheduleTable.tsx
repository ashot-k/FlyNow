import {Dictionaries, Flight} from "./FlightCard";
import {flightDateToStringNoYear, flightDateToStringShort, getAirportByIATA} from "../utils/Utils";
import Flag from "react-flagkit";

interface FlightScheduleTableProps {
    flight: Flight,
    dictionaries: Dictionaries
}

export default function FlightScheduleTable({flight, dictionaries}: FlightScheduleTableProps) {
    const outboundStart = flight.itineraries[0]?.segments[0].departure.at;
    const returnStart = flight.itineraries[1]?.segments[0].departure.at;

    return (
        <>
            {flight.itineraries.map((itinerary: any, index: any) => {
                return <div>
                    {index === 0 ?
                        <h4 className={"h5 text-center"}>Outbound <span
                            style={{color: "cornflowerblue"}}>{flightDateToStringShort(outboundStart)}</span>
                        </h4> :
                        <h4 className={"h5 text-center"}>Return <span
                            style={{color: "cornflowerblue"}}>{flightDateToStringShort(returnStart)}</span>
                        </h4>}
                    <table key={index} className={"table-transparent  small"}>
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
                </div>
            })}
        </>
    )
}