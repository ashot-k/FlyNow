import React, {useEffect, useState} from 'react';
import './static/App.css';
import './static/NavBar.css'
import axios from "axios";
import Button from 'react-bootstrap/Button'
import pendingSearchIcon from './static/infinite-spinner.svg'
import Select from "react-select";
import Flag from "react-flagkit";
import {NavBar} from "./components/NavBar";
import {FlightList} from "./components/FlightList";
import {activitiesInArea, getToken, inspirationSearch} from "./services/AmadeusAPIService";
import {airportSearch, searchAvailableDestinations, searchFlightOffers} from "./services/AmadeusAPIService";
import {capitalize, getAirport} from "./utils/Utils";
import countryCodes from './utils/countryCodes.json';
import {Alert} from "react-bootstrap";
import {FlightDestinationRecommendations} from "./components/FlightDestinationRecommendations";
import {LocationRecommendations} from "./components/LocationRecommendations";

function App() {
    const [token, setToken] = useState(undefined);
    const [tokenExpiration, setTokenExpiration] = useState<number>();
    const [pendingFlightSearch, setPendingFlightSearch] = useState(false);
    const [pendingOriginSearch, setPendingOriginSearch] = useState(false);
    const [pendingDestSearch, setPendingDestSearch] = useState(false);
    const [flightList, setFlightList] = useState<any[]>();
    const [recommendations, setRecommendations] = useState<any[]>();
    const [dictionaries, setDictionaries] = useState<any[]>();

    const [departureDate, setDepartureDate] = useState<string>('');
    const [oneWay, setOneWay] = useState<boolean>(true)
    const [returnDate, setReturnDate] = useState<string>('');
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [originOptions, setOriginOptions] = useState<any[]>();
    const [origin, setOrigin] = useState<any>(undefined);
    const [destinationOptions, setDestinationOptions] = useState<any[]>([]);
    const [destination, setDestination] = useState<any>();
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [originSearchTerm, setOriginSearchTerm] = useState<string>('');

    useEffect(() => {
        if (!token)
            getToken().then(response => {
                setToken(response.data.token);
                setTokenExpiration(response.data.expiration);
                axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.token;
            }).catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        setDestination('');
        setDestinationOptions([]);
        destinationOptionsSearch()
    }, [departureDate, origin]);
    useEffect(() => {
        if (origin) {
            getRecommendations(origin);
        }
    }, [origin]);

    const originOptionsSearch = (inputValue: string, token: any) => {
        var options: any[] = [];
        setPendingOriginSearch(true);
        airportSearch(inputValue).then((response: { data: { data: any[]; }; }) => {
            response.data.data.map((originInfo: any, index: number) => {
                options.push({
                    value: index,
                    label: capitalize(originInfo.address.cityName) + ", " + originInfo.name + " (" + originInfo.iataCode + "), " + capitalize(originInfo.address.countryName),
                    cityName: originInfo.address.cityName,
                    countryCode: originInfo.address.countryCode,
                    iataCode: originInfo.iataCode,
                    airport: originInfo.name
                })
            });
            setOriginOptions(options);
            setPendingOriginSearch(false);
        })


    }
    const destinationOptionsSearch = () => {
        var options: any[] = [];
        if (origin && departureDate) {
            setPendingDestSearch(true)
            searchAvailableDestinations(origin, false, false, departureDate).then(availableDestinations => {
                availableDestinations.data.data.map((destinationInfo: any, index: number) => {
                    let airport = getAirport(destinationInfo.destination);
                    options.push({
                        value: index,
                        label: capitalize(airport.city) + ", " + airport.name + " (" + destinationInfo.destination + "), " + capitalize(airport.country),
                        cityName: airport.city,
                        countryCode: countryCodes.find(row => row.iata === destinationInfo.destination)?.iso,
                        iataCode: destinationInfo.destination,
                        airport: airport.name
                    });
                });
                setDestinationOptions(options);
                setPendingDestSearch(false);
            }).catch((e) => {
                console.log(e);
                setPendingDestSearch(false)
                setDestinationOptions([]);
                setDestination('');
            })
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
    const searchFlights = () => {
        setPendingFlightSearch(true);
        searchFlightOffers(origin, destination, departureDate, returnDate, adults, children, maxPrice)
            .then((response => {
                setFlightList(response.data.data);
                setDictionaries(response.data.dictionaries)
                setPendingFlightSearch(false);
                console.log(response.data)
            }))
            .catch((e) => {
                console.error(e);
                setFlightList([]);
            });
    }

    const getRecommendations = (origin: { iataCode: string; }) => {
        console.log(origin);
        inspirationSearch(origin, oneWay)
            .then(r => {
                setRecommendations(r.data.data);
                console.log(r)
            })
            .catch((e) => {
                console.error(e);
                setRecommendations([]);
            });
    }





    return (
        <div className="App d-flex flex-column gap-3 align-items-center" data-bs-theme="dark">
            <NavBar id={'navBar'} token={token} tokenExp={tokenExpiration}/>

            <LocationRecommendations/>
            <div className={"search gap-3 p-3 d-flex flex-column rounded-2"}>
                <div className={"d-flex flex-row align-items-start justify-content-evenly"}>
                    <div className={"date-select p-2 d-flex flex-column gap-2 align-items-center justify-content-start"}>
                        <div className={"d-flex flex-row flex-wrap gap-1"}>
                            <label>
                                <h5>Departure</h5>
                                <input className={"form-control form-control-sm"}
                                       type={"date"}
                                       min={new Date().toISOString().substring(0, 10)}
                                       onChange={(e) => setDepartureDate(e.target.value)}/>
                            </label>
                            <label>
                                <h5>Return</h5>
                                <input className={"form-control form-control-sm"}
                                       type={"date"}
                                       min={departureDate} disabled={oneWay}
                                       onChange={(e) => setReturnDate(e.target.value)}/>
                            </label>
                        </div>
                        <div>
                            <div className="form-check">
                                <input type={"radio"} className={"form-check-input"}
                                       name={"oneWayCheck"}
                                       onChange={(e) => setOneWay(true)} checked={oneWay}/>
                                <label className={"form-check-label"}>One-Way</label>
                            </div>
                            <div className="form-check">
                                <input type={"radio"} className={"form-check-input"}
                                       name={"oneWayCheck"}
                                       onChange={(e) => {
                                           setOneWay(false);
                                           setReturnDate('');
                                       }}/>
                                <label className={"form-check-label"}>Roundtrip</label>
                            </div>
                        </div>
                    </div>
                    <div className={"location-select p-2 gap-2 d-flex flex-column align-items-center justify-content-start"}>
                        <label>
                            Origin {origin && <Flag country={origin.countryCode}/>}
                        </label>
                        <Select options={originOptions} className={"w-50"} onChange={(option) => setOrigin(option)}
                                styles={customStyles}
                                onInputChange={(inputValue) => {
                                    if (inputValue.length >= 3) {
                                        setOriginSearchTerm(inputValue);
                                        originOptionsSearch(inputValue, token);
                                    }
                                }}
                                components={{
                                    Option: ({innerProps, label, data}) => (
                                        <div className={"options"} {...innerProps}>
                                            <span><Flag country={data.countryCode}/> {label}</span>
                                        </div>)
                                }}
                        />
                        <label>Destination {destination && <Flag country={destination.countryCode}/>}</label>
                        {!pendingDestSearch ? destinationOptions && destinationOptions?.length > 0 ?
                                <Select options={destinationOptions} className={"w-50"}
                                        onChange={(option) => setDestination(option)} styles={customStyles}
                                        components={{
                                            Option: ({innerProps, label, data}) => (
                                                <div className={"options"} {...innerProps}>
                                                    <span><Flag country={data.countryCode}/> {label}</span>
                                                </div>)
                                        }}
                                /> : <Select className={"w-50"} isDisabled={true} styles={customStyles}/> :
                            <img src={pendingSearchIcon} width={"30%"} height={"30%"} alt={""}/>}
                    </div>
                    <div className={"settings p-2 d-flex flex-column align-items-start justify-content-start"}>
                        <div
                            className={"passenger-selection d-flex flex-column gap-2 w-50 align-items-center justify-content-start"}>
                            <label>
                                <h5>Max Price {maxPrice}</h5>
                                <input className={"form-range"} type={"range"} min={5} max={1000}
                                       onChange={(e) => setMaxPrice(parseInt(e.target.value))}/>
                            </label>
                            <label>
                                <h5>Adults</h5>
                                <input className={"form-control"} type={"number"}
                                       defaultValue={1} min={1} max={9}
                                       onChange={(e) => setAdults(parseInt(e.target.value))}/>
                            </label>
                            <label>
                                <h5>Children</h5>
                                <input className={"form-control"} type={"number"}
                                       defaultValue={0} min={0} max={9}
                                       onChange={(e) => setChildren(parseInt(e.target.value))}/>
                            </label>
                        </div>
                    </div>
                </div>
                <div className={"w-100 d-flex flex-column justify-content-center align-items-center"}>
                    <Alert variant={"danger"}
                           show={originSearchTerm.length > 0 && !originOptions?.length && !pendingOriginSearch}>No
                        available origin</Alert>
                    <Alert variant={"danger"}
                           show={origin != null && departureDate.length > 0 && !(destinationOptions?.length > 0) && !pendingDestSearch}>No
                        available destinations</Alert>

                    {departureDate && destination && !pendingFlightSearch ?
                        <Button variant="btn search-btn" className={"w-25"} onClick={searchFlights}>Search</Button> :
                        <Button variant="outline-secondary" className={"w-25"} disabled={true}>Search</Button>}
                </div>
            </div>
            <div className={"w-100 d-flex flex-row"}>
                <div className={"w-100 d-flex justify-content-center align-items-center"}>
                    {/*{recommendations && recommendations.length > 0 && <FlightDestinationRecommendations flights={recommendations}/>}*/}
                    {pendingFlightSearch ? <img src={pendingSearchIcon} width={"50%"} height={"50%"}
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
