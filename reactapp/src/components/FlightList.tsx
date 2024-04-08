import FlightCard from "./FlightCard";
import React from "react";
import Flag from "react-flagkit";

export const FlightList = ({flightList, departureDate, dictionaries, destination, origin}: any) => {
    return (
        <div className={"flight-list w-100 d-flex flex-column flex-wrap gap-4 justify-content-center "}>
            <hr/>
            <div className={"display-6 w-100 d-flex justify-content-center align-items-end gap-2"}>
                From {origin.cityName[0].toUpperCase() + origin.cityName.slice(1).toLowerCase()} ({origin.iataCode}) <Flag size={42} country={origin.countryCode}/>
                to {destination.cityName} ({destination.iataCode}) <Flag size={42} country={destination.countryCode}/>
            </div>
            <div className={"display-6 w-100 d-flex justify-content-center align-items-center"}>
                Departure Date: {new Date(departureDate).toLocaleDateString("en-GB")}
            </div>
            <br/>
            <div className={"w-100 d-flex flex-column align-items-center gap-4"}>
                {flightList.map((flight: any, index: number) => {
                    return <FlightCard key={index} flight={flight} origin={origin} destination={destination}
                                       dictionaries={dictionaries}/>
                })}
            </div>
        </div>
    );
};
