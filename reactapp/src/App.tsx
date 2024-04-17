import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import Button from 'react-bootstrap/Button'
import pendingIcon from './static/bouncing-circles.svg'
import pendingSearchIcon from './static/infinite-spinner.svg'
import Select from "react-select";
import Flag from "react-flagkit";
import {NavBar} from "./components/NavBar";
import {FlightList} from "./components/FlightList";
import {getToken} from "./services/AmadeusAPIService";
import {citySearch, searchAvailableDestinations, searchFlightOffers} from "./services/AmadeusAPIService";
import {capitalize} from "./utils/Utils";

import airportData from './utils/airports.json';

function App() {
    const [token, setToken] = useState(null);
    const [tokenExpiration, setTokenExpiration] = useState<number | undefined>();
    const [pendingSearch, setPendingSearch] = useState(false);
    const [pendingDestSearch, setPendingDestSearch] = useState(false);
    const [flightList, setFlightList] = useState<any[]>();
    const [dictionaries, setDictionaries] = useState<any[]>();

    const [departureDate, setDepartureDate] = useState<string>();
    const [oneWay, setOneWay] = useState<boolean>(true)
    const [returnDate, setReturnDate] = useState<string | null>();
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [originOptions, setOriginOptions] = useState<any[]>();
    const [origin, setOrigin] = useState<any>();
    const [destinationOptions, setDestinationOptions] = useState<any[]>();
    const [destination, setDestination] = useState<any>();

    useEffect(() => {
        getToken().then(response => {
            setToken(response.data.token);
            setTokenExpiration(response.data.expiration);
            axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.token;
        }).catch((e) => console.log(e));
    }, []);



    useEffect(() => {
        destinationOptionsSearch()
    }, [departureDate, origin]);

    useEffect(() => {
        if (oneWay)
            setReturnDate(null);
    }, [oneWay]);

    useEffect(() => {
        console.log("origin ", origin, " destination ", destination)
        /*if (destination && origin && departureDate)
            searchFlights()*/
    }, [destination, origin, departureDate, returnDate]);

    useEffect(() => {
        if (flightList != null && flightList?.length > 0)
            console.log(flightList[0])
    }, [flightList]);

    const searchFlights = () => {
        setPendingSearch(true);
        searchFlightOffers(origin, destination, departureDate, returnDate, adults, children)
            .then((response => {
                setFlightList(response.data.data);
                setDictionaries(response.data.dictionaries)
                setPendingSearch(false);
                console.log(response.data)
            }));
    }

    const originOptionsSearch = (inputValue: string, token: any) => {
        var options: any[] = [];
        citySearch(inputValue).then((response: { data: { data: any[]; }; }) => {
            response.data.data.map((originInfo: any, index: number) => {
                options.push({
                    value: index,
                    label: capitalize(originInfo.address.cityName) + ", " + originInfo.name + " (" + originInfo.iataCode + "), " + capitalize(originInfo.address.countryName),
                    cityName: originInfo.address.cityName,
                    countryCode: originInfo.address.countryCode,
                    iataCode: originInfo.iataCode,
                    airport: originInfo.name
                });

                if (index === response.data.data.length - 1) {
                    setOriginOptions(options);
                }
            });
        })
    }
    const destinationOptionsSearch = () => {
        var options: any[] = [];
        if (origin && departureDate) {
            setPendingDestSearch(true)
            searchAvailableDestinations(origin, false, false, departureDate).then(availableDestinations => {
                availableDestinations.data.data.map((destinationInfo: any, index: number) => {
                    console.log(destinationInfo);
                    setTimeout(() => {
                        citySearch(destinationInfo.destination).then(response => {
                            response.data.data.map((destinationInfo: any, index: number) => {
                                options.push({
                                    value: index,
                                    label: capitalize(destinationInfo.address.cityName) + ", " + destinationInfo.name + " (" + destinationInfo.iataCode + "), " + capitalize(destinationInfo.address.countryName),
                                    cityName: destinationInfo.address.cityName,
                                    countryCode: destinationInfo.address.countryCode,
                                    iataCode: destinationInfo.iataCode,
                                    airport: destinationInfo.name
                                });
                                setDestinationOptions(options);
                            })
                        })
                            .catch(() => setPendingDestSearch(false))
                    }, 500 * index)
                    if (options.length === index - 1)
                        setPendingDestSearch(false);
                });

            });
        }
    }
    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            background: 'transparent',
            display: 'flex',
            flexWrap: 'nowrap',
            color: 'white',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#04D7FF'
            },
            borderColor: 'white'
        }),
        menu: (provided: any) => ({
            ...provided,
            paddingTop: '8px', /* Add top padding to create a gap */
            paddingBottom: '8px',
            background: '#36373A',
            color: 'white'
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'white'
        }),
        input: (provided: any) => ({
            ...provided,
            color: 'white'
        })
    };
    return (
        <div className="App d-flex flex-column gap-3 align-items-center">
            {tokenExpiration && <NavBar token={token} tokenExp={tokenExpiration}/>}
            <div className={"search gap-3 p-3 d-flex flex-column rounded-2"}>
                <div className={"d-flex flex-row align-items-start justify-content-evenly"}>
                    <div className={"date-select d-flex flex-column gap-2 align-items-center justify-content-start"}>
                        <div className={"d-flex flex-row gap-1"}>
                            <label>
                                <h5>Departure Date</h5>
                                <input className={"form-control bg-transparent text-white"} type={"date"}
                                       min={new Date().toISOString().substring(0, 10)}
                                       onChange={(e) => setDepartureDate(e.target.value)}/>
                            </label>
                            <label>
                                <h5>Return Date</h5>
                                <input className={"form-control bg-transparent text-white"} type={"date"} min={departureDate} disabled={oneWay}
                                       onChange={(e) => setReturnDate(e.target.value)}/>
                            </label>
                        </div>
                        <div>
                            <div className="form-check">
                                <input type={"radio"} className={"form-check-input bg-transparent text-white"} name={"oneWayCheck"}
                                       onChange={(e) => setOneWay(true)} checked={oneWay}/>
                                <label className={"form-check-label"}>One-Way</label>
                            </div>
                            <div className="form-check">
                                <input type={"radio"} className={"form-check-input bg-transparent text-white"} name={"oneWayCheck"}
                                       onChange={(e) => setOneWay(false)}/>
                                <label className={"form-check-label"}>Roundtrip</label>
                            </div>
                        </div>
                    </div>
                    <div className={"location-select d-flex flex-column gap-2 align-items-center justify-content-start"}>
                        <label><span className={"h5"}>Origin</span> {origin && <Flag country={origin.countryCode}/>}
                        </label>
                        <Select options={originOptions} className={"w-75"} onChange={(option) => setOrigin(option)}
                                styles={customStyles}
                                onInputChange={(inputValue) => {
                                    if (inputValue.length >= 3) {
                                        originOptionsSearch(inputValue, token);
                                    }
                                }}
                                components={{
                                    Option: ({innerProps, label, data}) => (
                                        <div className={"options"} {...innerProps}>
                                            <span className={""}>{label} <Flag country={data.countryCode}/></span>
                                        </div>)
                                }}
                        />
                        <label><span className={"h5"}>Destination</span> {destination &&
                            <Flag country={destination.countryCode}/>}</label>
                        {!pendingDestSearch ? destinationOptions && destinationOptions?.length > 0 ?
                                <Select options={destinationOptions} className={"w-75"}
                                        onChange={(option) => setDestination(option)} styles={customStyles}
                                        components={{
                                            Option: ({innerProps, label, data}) => (
                                                <div className={"options"} {...innerProps}>
                                                    <span>{label}</span> <Flag country={data.countryCode}/>
                                                </div>)
                                        }}
                                /> : <Select className={"w-75"} isDisabled={true} styles={customStyles}/> :
                            // <>No Available flights for selected origin</>
                            <img src={pendingSearchIcon} width={"30%"} height={"30%"} alt={""}/>}
                    </div>
                    <div className={"settings d-flex flex-column align-items-start justify-content-start"}>
                        <div className={"passenger-selection d-flex flex-column gap-2 w-25 align-items-center justify-content-start"}>
                            <label>
                                <h5>Max Price</h5>
                                <input className={"form-range range bg-transparent text-white"} type={"range"}/>
                            </label>
                            <label>
                                <h5>Adults</h5>
                                <input className={"form-control bg-transparent text-white"} type={"number"} defaultValue={1} min={1} max={9}
                                       onChange={(e) => setAdults(parseInt(e.target.value))}/>
                            </label>
                            <label>
                                <h5>Children</h5>
                                <input className={"form-control bg-transparent text-white"} type={"number"} defaultValue={0} min={0} max={9}
                                       onChange={(e) => setChildren(parseInt(e.target.value))}/>
                            </label>
                        </div>
                    </div>
                </div>
                <div className={"w-100 d-flex flex-row justify-content-center"}>
                {departureDate && destination && !pendingSearch ?
                    <Button variant="btn search-btn" className={"w-25"} onClick={searchFlights}>Search</Button> :
                    <Button variant="outline-secondary" className={"w-25"} disabled={true}>Search</Button>}
                </div>
            </div>
            <div className={"w-100 d-flex flex-row"}>
                <div className={"w-100 d-flex justify-content-center align-items-center"}>
                    {pendingSearch ? <img src={pendingSearchIcon} width={"50%"} height={"50%"}
                                          alt={""}/> : (flightList ? (flightList.length > 0 &&
                        <FlightList flightList={flightList} departureDate={departureDate} returnDate={returnDate}
                                    dictionaries={dictionaries}
                                    origin={origin}
                                    destination={destination}/>) : <></>)}
                </div>
            </div>
        </div>
    );
}

export default App;
