import FlightCard from "./FlightCard";
import React from "react";
import Flag from "react-flagkit";
import {capitalize} from "../utils/Utils";

export const FlightList = ({flightList, departureDate, returnDate, dictionaries, destination, origin}: any) => {
    return (
        <div className={"flight-list w-100 d-flex flex-column flex-wrap gap-3 justify-content-start align-items-center"}>
            <hr/>
            <div className={"search-info p-4 rounded-2 w-100"}>
                <span className={"fs-3 d-flex justify-content-center align-items-end gap-1"}>
                    {capitalize(origin.cityName)} ({origin.iataCode}) <Flag size={42}
                                                                            country={origin.countryCode}/>-{capitalize(destination.cityName)} ({destination.iataCode})<Flag
                    size={42} country={destination.countryCode}/>
                </span>
                <div className={"fs-4 d-flex justify-content-center align-items-end gap-1"}>
                    {departureDate && <span>Departure: {new Date(departureDate).toLocaleDateString("en-GB")}</span>}
                    {returnDate && <span>Return: {new Date(returnDate).toLocaleDateString("en-GB")}</span>}
                </div>
            </div>
            <br/>
            <div className={"w-100 d-flex flex-column align-items-center gap-3"}>
                {flightList.map((flight: any, index: number) => {
                    return <FlightCard key={index} flight={flight} origin={origin} destination={destination}
                                       dictionaries={dictionaries}/>
                })}
            </div>
        </div>
    );
};
