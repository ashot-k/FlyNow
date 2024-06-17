import Flag from "react-flagkit";
import {capitalize} from "../utils/Utils";
import React from "react";
import {Route} from "./FlightSearch";
import arrowRight from '../static/assets/arrow-right.svg';
interface SearchInfoHeaderProps {
    departureDate: string;
    oneWay: boolean;
    returnDate: string;
    adults: number;
    children: number;
    origin: Route;
    destination: Route;
    maxPrice: number;
}

export default function SearchInfoHeader({...searchInfo}: SearchInfoHeaderProps) {

    const scroll = () => {
        window.scrollTo({top: 0, behavior: "auto"});
    };
    let origin = searchInfo.origin;
    let destination = searchInfo.destination;
    let departureDate = searchInfo.departureDate;
    let returnDate = searchInfo.returnDate;

    return (
        <div className={"w-full fixed bottom-0 z-10 py-2 bg-flyNow-component flex flex-col justify-center items-center shadow-black shadow-md"}>
            <a onClick={scroll} href={'#'} >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white"
                     className="bi bi-chevron-double-up" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708z"/>
                    <path fillRule="evenodd"
                          d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                </svg>
            </a>
            <span className={"text-lg sm:text-2xl w-full flex justify-center items-center gap-2"}>
                    <Flag className={"w-6 h-6 sm:w-8 sm:h-8"} country={origin.countryCode}/> {capitalize(origin.cityName)} ({origin.iataCode})
                <img src={arrowRight} width={'w-8'} alt={''}/>
                <Flag className={"w-6 h-6 sm:w-8 sm:h-8"}
                      country={destination.countryCode}/> {capitalize(destination.cityName)} ({destination.iataCode})
                </span>
            <div className={"text-lg flex flex-col justify-center items-center"}>
                {departureDate &&
                    <span>Outbound: {new Date(departureDate).toLocaleDateString("en-GB")}</span>}
                {returnDate && <span>Return: {new Date(returnDate).toLocaleDateString("en-GB")}</span>}
            </div>
        </div>
    )

}

