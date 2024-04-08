import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import Button from 'react-bootstrap/Button'
import pendingIcon from './static/bouncing-circles.svg'
import pendingSearchIcon from './static/infinite-spinner.svg'
import Select from "react-select";
import Flag from "react-flagkit";
import FlightCard from "./components/FlightCard";
import {NavBar} from "./components/NavBar";
import {FlightList} from "./components/FlightList";
import countries from "countries-list";


function App() {
    const lodash = require('lodash');
    const [token, setToken] = useState(null);
    const [pendingSearch, setPendingSearch] = useState(false);
    const [pendingDestSearch, setPendingDestSearch] = useState(false);
    const [flightList, setFlightList] = useState<any[]>();
    const [dictionaries, setDictionaries] = useState<any[]>();

    const [departureDate, setDepartureDate] = useState<string>();
    const [oneWay, setOneWay] = useState<boolean>(false)
    const [returnDate, setReturnDate] = useState<string | null>();
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [originOptions, setOriginOptions] = useState<any[]>();
    const [origin, setOrigin] = useState<any>();
    const [destinationOptions, setDestinationOptions] = useState<any[]>();
    const [destination, setDestination] = useState<any>();

    useEffect(() => {
        axios.get("http://192.168.1.64:8080/amadeus/token").then(response => {
            setToken(response.data);
            axios.defaults.headers.common['Authorization'] = "Bearer " + response.data;
            console.log("Auth Token " + response.data)
        });
    }, []);

    useEffect(() => {
        destinationOptionsSearch()
    }, [departureDate, origin]);

    useEffect(() => {
        if(!oneWay)
            setReturnDate(null);
    }, [oneWay]);
    useEffect(() => {
        console.log("origin ", origin, " destination ", destination)
    }, [origin, destination]);

    useEffect(() => {
        if (destination && origin && departureDate)
            searchFlightOffers()
    }, [destination, origin, adults, children]);
    const searchFlightOffers = () => {
        setPendingSearch(true);
        axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers",
            {
                params: {
                    originLocationCode: origin.iataCode,
                    destinationLocationCode: destination.iataCode,
                    departureDate: departureDate,
                    returnDate: returnDate,
                    adults: adults,
                    children: children
                }
            }).then((response => {
            setFlightList(response.data.data);
            setDictionaries(response.data.dictionaries)
            setPendingSearch(false);
            console.log(response.data)
        }));
    }

    const airportData = require('airport-data-js');
    const countries = require('countries-list');
    const pendingImg = <img src={pendingIcon} width={"42px"} height={"42px"} alt={""}/>;

    const originOptionsSearch = lodash.debounce((inputValue: string, token: string) => {
        var options: any[] = [];
        axios.get("https://test.api.amadeus.com/v1/reference-data/locations", {
            params: {
                subType: "CITY",
                keyword: inputValue
            }
        }).then(response => {
            response.data.data.map((originInfo: any, index: number) => {
                airportData.getAirportByIata(originInfo.iataCode).then((r: any) => {
                    const responseData = r[0];
                    let countryName: string;
                    if (countries.countries[responseData.country_code])
                        countryName = countries.countries[responseData.country_code].name;
                    else
                        countryName = responseData.country_code
                    options.push(
                        {
                            value: index,
                            label: responseData.city.toUpperCase() + " (" + responseData.iata + "), " + countryName.toUpperCase(),
                            cityName: responseData.city,
                            countryCode: responseData.country_code,
                            iataCode: responseData.iata,
                            airport: responseData.airport
                        });
                })
            });
            setOriginOptions(options)
        });
    }, 200);

    const destinationOptionsSearch = () => {
        var options: any[] = [];
        if (origin && departureDate) {
            setPendingDestSearch(true)
            axios.get("https://test.api.amadeus.com/v1/shopping/flight-destinations", {
                params: {
                    origin: origin.iataCode,
                    oneWay: false,
                    nonStop: false,
                    departureDate: departureDate
                }
            }).then(response => {
                response.data.data.map((destinationInfo: any, index: number) => {
                    airportData.getAirportByIata(destinationInfo.destination).then((r: any) => {
                        const responseData = r[0];
                        let countryName: string;
                        if (countries.countries[responseData.country_code])
                            countryName = countries.countries[responseData.country_code].name;
                        else
                            countryName = responseData.country_code
                        options.push(
                            {
                                value: index,
                                label: responseData.city.toUpperCase() + " (" + responseData.iata + "), " + countryName.toUpperCase(),
                                cityName: responseData.city,
                                countryCode: responseData.country_code,
                                iataCode: responseData.iata,
                                airport: responseData.airport
                            });
                    })
                });
            }).then(() => setPendingDestSearch(false))
                .catch(() => setPendingDestSearch(false))
        }
        setDestinationOptions(options)
    }

    return (
        <div className="App d-flex flex-column gap-3 align-items-center">
            <NavBar/>
            <div className={"w-100 d-flex flex-column gap-3 align-items-center"}>
                <div className={"search h5 d-flex flex-column align-items-center gap-3"}>
                    <label>Departure Date
                        <input className={"form-control"} type={"date"} min={new Date().toISOString().substring(0, 10)}
                               onChange={(e) => setDepartureDate(e.target.value)}/>
                    </label>
                    <div className={"w-100"}>
                        <div className="form-check">
                            <input type={"radio"} className={"form-check-input"} name={"oneWayCheck"}
                                   onChange={(e) => setOneWay(false)}/>
                            <label className={"form-check-label"}>One-Way Flights </label>
                        </div>
                        <div className="form-check">
                            <input type={"radio"} className={"form-check-input"} name={"oneWayCheck"}
                                   onChange={(e) => setOneWay(true)}/>
                            <label className={"form-check-label"}>2-Way Flights</label>
                        </div>
                    </div>
                    {oneWay && departureDate &&
                        <label>Return Date
                            <input className={"form-control"} type={"date"} min={departureDate}
                                   onChange={(e) => setReturnDate(e.target.value)}/>
                        </label>}
                    <label>Adults:
                        <input className={"form-control"} type={"number"} defaultValue={1} min={1} max={9}
                               onChange={(e) => setAdults(parseInt(e.target.value))}/>
                    </label>
                    <label>Children:
                        <input className={"form-control"} type={"number"} defaultValue={0} min={0} max={9}
                               onChange={(e) => setChildren(parseInt(e.target.value))}/>
                    </label>
                    <div className={"w-100"}>
                        <label className={"p-2"}>Origin</label>
                        <Select options={originOptions} className={"w-100"}
                                onChange={(option) => setOrigin(option)}
                                onInputChange={(inputValue) => {
                                    if (inputValue.length >= 3) {
                                        originOptionsSearch(inputValue, token);
                                    }
                                }}
                                components={{
                                    Option: ({innerProps, label, data}) => (
                                        <div className={"options"} {...innerProps}>
                                            <span>{label}</span> <Flag country={data.countryCode}/>
                                        </div>
                                    ),
                                }}
                        />
                        <label className={"p-2"}>Destination</label>
                        {!pendingDestSearch ? destinationOptions && destinationOptions?.length > 0 ?
                            <Select options={destinationOptions} className={"w-100"}
                                    onChange={(option) => setDestination(option)}
                                    onInputChange={(inputValue) => {
                                        if (inputValue.length >= 3) {

                                        }
                                    }}
                                    components={{
                                        Option: ({innerProps, label, data}) => (
                                            <div className={"options"} {...innerProps}>
                                                <span>{label}</span> <Flag country={data.countryCode}/>
                                            </div>)
                                    }}
                            /> : <>No Available flights for selected origin</> : pendingImg}
                    </div>
                </div>
                {departureDate && destination && !pendingSearch ?
                    <Button variant="primary" onClick={searchFlightOffers}>Search</Button> : <></>}
            </div>
            <div className={"w-100 d-flex justify-content-center"}>
                {pendingSearch ?
                    <img src={pendingSearchIcon} width={"250px"} height={"250px"}
                         alt={""}/> : (flightList ? (flightList.length > 0 &&
                        <FlightList flightList={flightList} departureDate={departureDate} dictionaries={dictionaries}
                                    origin={origin}
                                    destination={destination}/>) : <></>)}
            </div>
        </div>
    );
}

export default App;
