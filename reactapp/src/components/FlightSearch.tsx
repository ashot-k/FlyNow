import Flag from "react-flagkit";
import Select from "react-select";
import {capitalize, customStyles, getAirportByIATA} from "../utils/Utils";
import pendingSearchIcon from "../static/infinite-spinner.svg";
import {Alert} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import {
    searchAirport,
    searchAvailableDestinations,
    searchFlightOffers
} from "../services/AmadeusAPIService";
import {Dictionaries, Flight} from "./FlightCard";
import {logSearchTerms} from "../services/FlyNowServiceAPI";

interface FlightSearchProps {
    onSearch: (searchData: FlightSearchData) => void;
}

export interface Route {
    value: number,
    label: string,
    cityName: string,
    countryCode: string,
    iataCode: string,
    airport: string
}

export interface SearchInfo {
    departureDate: string;
    oneWay: boolean;
    returnDate: string;
    adults: number;
    children: number;
    origin: Route;
    destination: Route;
    maxPrice: number;
}

export interface FlightSearchData {
    searchInfo: SearchInfo;
    flightList: Flight[];
    dictionaries: Dictionaries;
}

export interface preloadedSearchInfo {
    originiataCode: string;
    destinationiataCode: string;
}

export default function FlightSearch({
                                         onSearch,
                                         originiataCode,
                                         destinationiataCode
                                     }: FlightSearchProps & preloadedSearchInfo) {

    const [pendingFlightSearch, setPendingFlightSearch] = useState<boolean>(false);
    const [pendingOriginSearch, setPendingOriginSearch] = useState<boolean>(false);
    const [pendingDestSearch, setPendingDestSearch] = useState<boolean>(false);
    const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [oneWay, setOneWay] = useState<boolean>(true)
    const [returnDate, setReturnDate] = useState<string>('');
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [originOptions, setOriginOptions] = useState<Route[]>([]);
    const [destinationOptions, setDestinationOptions] = useState<Route[]>([]);
    const [origin, setOrigin] = useState<Route>();
    const [destination, setDestination] = useState<Route>();
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [originSearchTerm, setOriginSearchTerm] = useState<string>('');
    const [flightList, setFlightList] = useState<any[]>([]);
    const [dictionaries, setDictionaries] = useState<any>();

    const returnSearchResults = () => {
        if (origin && destination)
            onSearch({
                searchInfo: {origin, destination, departureDate, returnDate, oneWay, adults, children, maxPrice},
                flightList,
                dictionaries
            });
    }

    useEffect(() => {
        if (origin && departureDate) {
            destinationOptionsSearch(origin)
        }
    }, [origin, departureDate])
    useEffect(() => {
        if (flightList.length > 0 && dictionaries) {
            returnSearchResults();
        }
    }, [flightList, dictionaries]);
    useEffect(() => {
        if (originiataCode?.length > 0) {
            originOptionsSearch(originiataCode)
        }
    }, [originiataCode]);
    useEffect(() => {
        if (destinationiataCode?.length > 0 && destinationOptions?.length > 0) {
            loadDestinationOption(destinationiataCode)
        }
    }, [destinationiataCode, destinationOptions]);

    const originOptionsSearch = (inputValue: string) => {
        let options: Route[] = [];
        setPendingOriginSearch(true);
        searchAirport(inputValue).then((response: any) => {
            console.log(response.data)
            response.data.data.map((originInfo: any, index: number) => {
                options.push({
                    value: index,
                    // label: capitalize(originInfo.address.cityName) + ", " + capitalize(originInfo.name) + " (" + originInfo.iataCode + "), " + capitalize(originInfo.address.countryName),
                    label: capitalize(originInfo.name) + " (" + originInfo.iataCode + "), " + capitalize(originInfo.address.countryName),
                    cityName: originInfo.address.cityName,
                    countryCode: originInfo.address.countryCode,
                    iataCode: originInfo.iataCode,
                    airport: originInfo.name
                })
            });
            setOriginOptions(options);
            if (options.length > 0)
                setOrigin(options[0])
        }).catch((e) => console.log(e)).finally(() => setPendingOriginSearch(false))
    }
    const destinationOptionsSearch = (origin: Route) => {
        let options: Route[] = [];
        setPendingDestSearch(true)
        if (departureDate)
            searchAvailableDestinations(origin).then(availableDestinations => {
                availableDestinations.data.data.map((destination: any, index: number) => {
                    options.push({
                        value: index,
                        label: capitalize(destination.name) + " (" + destination.iataCode + "), " + capitalize(destination.address.countryName),
                        cityName: destination.name,
                        countryCode: destination.address.countryCode,
                        iataCode: destination.iataCode,
                        airport: destination.name
                    });
                });
                setDestinationOptions(options);
                setDestination(options[0])
            }).catch((e) => {
                console.log(e);
                setDestinationOptions([]);
                setDestination(undefined);
            }).finally(() => setPendingDestSearch(false))

    }
    const loadDestinationOption = (iata: string) => {
        for (const destinationOption of destinationOptions) {
            if (destinationOption.iataCode === iata) {
                setDestination(destinationOption);
                destinationOptions.splice(destinationOptions.indexOf(destinationOption), 1);
                destinationOptions.unshift(destinationOption)
                setDestinationOptions(destinationOptions);
                return;
            }
        }
    }
    const searchFlights = () => {
        setPendingFlightSearch(true);
        if (origin && destination && departureDate) {
            logSearchTerms(origin?.iataCode, destination?.iataCode);
            searchFlightOffers({origin, destination, departureDate, returnDate, adults, children, maxPrice, oneWay})
                .then((response => {
                    setFlightList(response.data.data);
                    setDictionaries(response.data.dictionaries);
                }))
                .catch((e) => {
                    console.error(e);
                    setFlightList([]);
                }).finally(() => {
                setPendingFlightSearch(false);
            });
        }
    }

    function checkIfSearchInfoEntered() {
        return (origin && destination && departureDate)
    }

    return (
        <div className={"search gap-3 p-3 d-flex flex-column rounded-2"}>
            <div className={"d-flex search-options "}>
                <div className={"date-select p-2 d-flex flex-column gap-2 align-items-center justify-content-start"}>
                    <div className={"d-flex flex-row justify-content-center flex-wrap gap-2"}>
                        <label>
                            <h5>Departure</h5>
                            <input className={"form-control form-control-sm"}
                                   type={"date"}
                                   min={new Date().toISOString().substring(0, 10)}
                                   defaultValue={new Date().toISOString().substring(0, 10)}
                                   onChange={(e) => {
                                       setDepartureDate(e.target.value)
                                   }}/>
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
                <div
                    className={"location-select p-2 gap-3 d-flex flex-column align-items-center justify-content-start"}>
                    <label>
                        Origin {origin && <Flag country={origin.countryCode}/>}
                    </label>
                    <Select options={originOptions} className={"w-50"}
                            onChange={(option) => {
                                if (option) {
                                    setOrigin(option)
                                    destinationOptionsSearch(option)
                                }
                            }}
                            styles={customStyles}
                            value={origin ? origin : (originOptions && originOptions?.length > 0) ? originOptions[0] : undefined}
                            onInputChange={(inputValue) => {
                                if (inputValue.length >= 3) {
                                    setOriginSearchTerm(inputValue);
                                    originOptionsSearch(inputValue);
                                    setDestinationOptions([]);
                                    setDestination(undefined);
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
                                    onChange={(option) => {
                                        if (option) setDestination(option)
                                    }}
                                    styles={customStyles}
                                    value={destination ? destination : destinationOptions?.length > 0 ? destinationOptions[0] : undefined}
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
                        className={"passenger-selection d-flex flex-column gap-2 align-items-center justify-content-start"}>
                        <label>
                            <h5>Max Price {maxPrice + '\u20AC'} </h5>
                            <input className={"form-range"} type={"range"} min={5} max={1000} value={maxPrice}
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
                <Alert variant={"danger"}
                       show={!pendingFlightSearch && flightList.length <= 0}>No
                    available flights</Alert>
                <div className={"w-100 d-flex justify-content-center align-items-center gap-3"}>
                    {origin && departureDate && destination && pendingFlightSearch ?
                        <img src={pendingSearchIcon} width={"35%"} height={"50%"}
                             alt={""}/> :
                        <Button variant={!checkIfSearchInfoEntered() ? "outline-secondary" : "btn search-btn"}
                                className={"w-25"} disabled={!checkIfSearchInfoEntered()}
                                onClick={searchFlights}>Search</Button>}
                    {/*<Button variant={"btn search-btn"} className={"w-25"}>Trip Planner</Button>*/}
                </div>
            </div>
        </div>
    );
}