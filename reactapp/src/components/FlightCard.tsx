import Flag from "react-flagkit";
import axios from "axios";

import airportData from '../utils/airports.json';
import airportData2 from '../utils/airports2.json';

const FlightCard = ({flight, destination, origin, dictionaries}: any) => {
    let cityCodeToName = new Intl.DisplayNames(['en'], {type: 'region'})

    function priceConfirm(){
        axios.post("https://test.api.amadeus.com/v1/shopping/flight-offers/pricing", flight,{
            headers:{
                'X-HTTP-Method-Override': 'GET'
            }
        }).then(r => console.log(r))
    }
    function getAirport(iataCode: string){
        console.log(iataCode);
        let airport = airportData.filter((airport)=> airport.iata === iataCode)[0]
        if(airport){
            return airport
        }
        else{
            return airportData2.filter((airport)=> airport.iata_code === iataCode)[0]
        }
    }


    return (
        <div className={"flight-card rounded-2 p-4 d-flex flex-column gap-1 align-items-start"}>
            <div className={"card-head d-flex justify-content-between w-100"}>
                <div className={"h4"}>
                    Airline: {dictionaries.carriers[flight.validatingAirlineCodes]}
                </div>
                <div className={"h5"}>
                    Available Seats: {flight.numberOfBookableSeats}
                </div>
            </div>
            <div className={"w-100 d-flex flex-column "}>
                <h4 className={"h5 text-center"}>Departure</h4>
                <table className={"table table-transparent table-hover table-responsive-sm"}>
                    <tbody>
                    <tr>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Code</th>
                    </tr>
                    {flight.itineraries[0].segments.map((segment: any, index: any) => <tr key={index}>
                        <td>
                            {getAirport(segment.departure.iataCode)?.city || ""}{', '}
                            {getAirport(segment.departure.iataCode)?.name || ""}{' '}
                            ({segment.departure.iataCode}){' '} <Flag country={dictionaries.locations[segment.departure.iataCode].countryCode}/>
                        </td>
                        <td>
                            {getAirport(segment.arrival.iataCode)?.city || ""}{', '}
                            {getAirport(segment.arrival.iataCode)?.name || ""}{' '}
                            ({segment.arrival.iataCode}){' '} <Flag country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>
                        </td>
                        <td>{segment.departure.at.split('T')[0]}</td>
                        <td>{segment.departure.at.split('T')[1]}</td>
                        <td>{segment.carrierCode}{segment.number}</td>
                    </tr>)}
                    </tbody>
                </table>
                {flight.itineraries[1] && <h5 className={"h4 text-center"}>Return</h5>}
                {flight.itineraries[1] && <table className={"table table-transparent table-hover table-responsive-sm"}>
                    <tbody>
                    <tr>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Code</th>
                    </tr>
                    {flight.itineraries[1].segments.map((segment: any, index: any) => <tr key={index}>
                        <td>
                            {getAirport(segment.departure.iataCode)?.city || ""}{', '}
                            {getAirport(segment.departure.iataCode)?.name || ""}{' '}
                            ({segment.departure.iataCode}){' '} <Flag country={dictionaries.locations[segment.departure.iataCode].countryCode}/>
                        </td>
                        <td>
                            {getAirport(segment.arrival.iataCode)?.city || ""}{', '}
                            {getAirport(segment.arrival.iataCode)?.name || ""}{' '}
                            ({segment.arrival.iataCode}){' '} <Flag country={dictionaries.locations[segment.arrival.iataCode].countryCode}/>
                        </td>
                        <td>{segment.departure.at.split('T')[0]}</td>
                        <td>{segment.departure.at.split('T')[1]}</td>
                        <td>{segment.carrierCode}{segment.number}</td>
                    </tr>)}
                    </tbody>
                </table>}
            </div>
            <div className={"w-100 d-flex justify-content-center"}>
                <button className={"w-25 btn book-btn"} onClick={priceConfirm}>Book
                    for {flight.price.total} {flight.price.currency}</button>
            </div>
        </div>
    );
};

export default FlightCard;
