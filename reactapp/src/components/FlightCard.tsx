import React from 'react';
import countries from "countries-list";
import Flag from "react-flagkit";

const FlightCard = ({flight, destination, origin, dictionaries}: any) => {
    const countries = require('countries-list');

    return (
        <div className={"card rounded-2 w-50 p-4 d-flex flex-column align-items-start"}>
            <div className={"d-flex justify-content-between w-100 p-1"}>
                <div className={"display-6"}>
                    Airline: {dictionaries.carriers[flight.validatingAirlineCodes]}
                </div>
                <div className={"h4"}>
                    Available Seats: {flight.numberOfBookableSeats}
                </div>
            </div>
            <hr className={"w-100"}/>
            <div className={"w-100 d-flex flex-column "}>
                <div className={"h4"}>
                    Detailed Route
                </div>
                <ul className={"list-group"}>
                    <h4 className={"h4 text-center"}>Departure:</h4>
                    {flight.itineraries[0].segments.map((segment: any, index: any) => <li key={index} className={"h4 list-group-item"}>
                        From {countries.countries[dictionaries.locations[segment.departure.iataCode].countryCode].name} ({segment.departure.iataCode})
                        to {countries.countries[dictionaries.locations[segment.arrival.iataCode].countryCode].name} ({segment.arrival.iataCode})
                        Departing on: {segment.departure.at.split('T')[0]} {segment.departure.at.split('T')[1]}<br/>
                    </li>)}
                    {flight.itineraries[1] && <h4 className={"h4 text-center"}>Return:</h4>
                     && flight.itineraries[1].segments.map((segment: any, index: any) => <li key={index} className={"h4 list-group-item"}>
                        From {countries.countries[dictionaries.locations[segment.departure.iataCode].countryCode].name} ({segment.departure.iataCode})
                        to {countries.countries[dictionaries.locations[segment.arrival.iataCode].countryCode].name} ({segment.arrival.iataCode})
                        Departing on: {segment.departure.at.split('T')[0]} {segment.departure.at.split('T')[1]}<br/>
                    </li>)}
                </ul>
            </div>
            <hr className={"w-100"}/>
            <div className={"w-100 d-flex justify-content-center"}>
                <button className={"w-25 btn btn-primary "}>Book
                    for {flight.price.total} {flight.price.currency}</button>
            </div>
        </div>
    );
};

export default FlightCard;
