import FlightCard from "./FlightCard";
import React from "react";
import Flag from "react-flagkit";
import {capitalize} from "../utils/Utils";
import Button from "react-bootstrap/Button";

export const FlightList = ({flightList, departureDate, returnDate, dictionaries, destination, origin}: any) => {
    const scroll = () => {
        const navBar = document.querySelector( '#navBar' );
        if(navBar)
            navBar.scrollIntoView( { behavior: 'smooth', block: 'start' } );
    };
    return (
        <div className={"flight-list w-100 d-flex flex-column flex-wrap gap-3 justify-content-start align-items-center"}>
            <hr/>
            <div className={"search-info d-flex flex-column justify-content-center align-items-center p-3 w-100"}>
                <a onClick={scroll} href={'#'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white"
                         className="bi bi-chevron-double-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                              d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708z"/>
                        <path fill-rule="evenodd"
                              d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                    </svg>
                </a>
                <span className={"fs-5 d-flex justify-content-center align-items-center gap-1"}>
                    <Flag size={42} country={origin.countryCode}/> {capitalize(origin.cityName)} ({origin.iataCode})
                    {' '}-{' '}
                    <Flag size={42}
                          country={destination.countryCode}/> {capitalize(destination.cityName)} ({destination.iataCode})
                </span>
                <div className={"fs-5 d-flex flex-column justify-content-center align-items-center"}>
                    {departureDate && <span>Outbound {new Date(departureDate).toLocaleDateString("en-GB")}</span>}
                    {returnDate && <span>Return {new Date(returnDate).toLocaleDateString("en-GB")}</span>}
                </div>
            </div>
            <div className={"w-100 d-flex flex-column align-items-center justify-content-center gap-4 mt-3"}>
                {flightList.map((flight: any, index: number) => {
                    return <FlightCard key={index} flight={flight} origin={origin} destination={destination}
                                       dictionaries={dictionaries}/>
                })}
            </div>
        </div>
    );
};
