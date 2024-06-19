import {Dictionaries, Flight} from "./FlightCard";
import {flightDateToStringNoYear, flightDateToStringShort, getAirportByIATA} from "../utils/Utils";
import Flag from "react-flagkit";

interface FlightScheduleTableProps {
    flight: Flight,
    dictionaries: Dictionaries
    className?: string
}

export default function FlightScheduleTable({className, flight, dictionaries}: FlightScheduleTableProps) {
    const outboundStart = flight.itineraries[0]?.segments[0].departure.at;
    const returnStart = flight.itineraries[1]?.segments[0].departure.at;

    return (
        <>
            {flight.itineraries.map((itinerary: any, index: any) => {
                return <div className={className}>
                    {index === 0 ?
                        <h4 className={"text-center"}>Outbound <span
                            style={{color: "cornflowerblue"}}>{flightDateToStringShort(outboundStart)}</span>
                        </h4> :
                        <h4 className={"text-center"}>Return <span
                            style={{color: "cornflowerblue"}}>{flightDateToStringShort(returnStart)}</span>
                        </h4>}

                    <table key={index} className={"table-auto"}>
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
                            <td className={"p-1.5"}>
                                <Flag className={"size-8"}
                                      country={dictionaries.locations[segment.departure.iataCode].countryCode}/>{' '}
                                {getAirportByIATA(segment.departure.iataCode)?.city || ""}{', '}
                                {getAirportByIATA(segment.departure.iataCode)?.name || ""}{' '} ({segment.departure.iataCode})
                            </td>
                            <td className={"p-1.5"}>
                                {flightDateToStringNoYear(segment.departure.at)}
                            </td>
                            <td className={"p-1.5"}>
                                <Flag className={"size-8"}
                                      country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>{' '}
                                {getAirportByIATA(segment.arrival.iataCode)?.city || ""}{', '}
                                {getAirportByIATA(segment.arrival.iataCode)?.name || ""}{' '}({segment.arrival.iataCode})
                            </td>
                            <td className={"p-1.5"}>
                                {flightDateToStringNoYear(segment.arrival.at)}
                            </td>
                            <td className={"p-1.5"}>{segment.carrierCode}{segment.number}</td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            })}
        </>
    )
}