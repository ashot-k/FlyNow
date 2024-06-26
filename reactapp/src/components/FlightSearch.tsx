import Flag from "react-flagkit";
import Select from "react-select";
import {capitalize, customStyles, getAirportByIATA} from "../utils/Utils";
import pendingSearchIcon from "../static/infinite-spinner.svg";
import {Alert} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import {
    searchAirport,
    inspirationSearch,
    searchAvailableDestinations,
    searchFlightOffers
} from "../services/AmadeusAPIService";
import countryCodes from "../utils/countryCodes.json";
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
export interface preloadedSearchInfo{
    originiataCode: string;
    destinationiataCode: string;
}

export default function FlightSearch({onSearch, originiataCode, destinationiataCode}: FlightSearchProps & preloadedSearchInfo) {

    const [pendingFlightSearch, setPendingFlightSearch] = useState<boolean>(false);
    const [pendingOriginSearch, setPendingOriginSearch] = useState<boolean>(false);
    const [pendingDestSearch, setPendingDestSearch] = useState<boolean>(false);
    const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [oneWay, setOneWay] = useState<boolean>(true)
    const [returnDate, setReturnDate] = useState<string>('');
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [originOptions, setOriginOptions] = useState<any[]>();
    const [destinationOptions, setDestinationOptions] = useState<any[]>([]);
    const [origin, setOrigin] = useState<Route | undefined>(undefined);
    const [destination, setDestination] = useState<Route | undefined>(undefined);
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
        if (origin && departureDate?.length > 0 && !destination)
            destinationOptionsSearch();
    }, [origin]);

    useEffect(() =>{
        if(destinationOptions?.length > 0){
            setDestination(destinationOptions[0])
        }
    }, [destinationOptions])
    useEffect(() => {
        if (flightList.length > 0 && dictionaries) {
            returnSearchResults();
        }
    }, [flightList, dictionaries]);

    useEffect(() => {
        if(originiataCode?.length > 0){
            loadOriginOption(originiataCode)
        }
        console.log(originiataCode)
    }, [originiataCode]);
    useEffect(() => {
        if(destinationiataCode?.length > 0){
            loadDestinationOption(destinationiataCode)
        }
    }, [destinationiataCode]);

    const originOptionsSearch = (inputValue: string) => {
        let options: Route[] = [];
        setPendingOriginSearch(true);
        searchAirport(inputValue).then((response: { data: { data: any[]; }; }) => {
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
        }).catch((e) => console.log(e)).finally(() => setPendingOriginSearch(false))
    }
    const loadOriginOption = (iata: string) => {
        let airport = getAirportByIATA(iata);
        if(!airport) return;
        const option = {
            value: 0,
            label: capitalize(airport.city) + ", " + airport.name + " (" + iata + "), " + capitalize(airport.country),
            cityName: airport.city,
            countryCode: countryCodes.find(row => row.iata === iata)?.iso || "",
            iataCode: iata,
            airport: airport.name
        };
        setOriginOptions([option]);
        setOrigin(option);
    }
    const destinationOptionsSearch = () => {
        let options: Route[] = [];
        if (origin && departureDate) {
            setPendingDestSearch(true)
            searchAvailableDestinations(origin, false, false, departureDate).then(availableDestinations => {
                availableDestinations.data.data.map((destinationInfo: any, index: number) => {
                    let airport = getAirportByIATA(destinationInfo.destination);
                    options.push({
                        value: index,
                        label: capitalize(airport.city) + ", " + airport.name + " (" + destinationInfo.destination + "), " + capitalize(airport.country),
                        cityName: airport.city,
                        countryCode: countryCodes.find(row => row.iata === destinationInfo.destination)?.iso || "",
                        iataCode: destinationInfo.destination,
                        airport: airport.name
                    });
                });
                setDestinationOptions(options);
            }).catch((e) => {
                console.log(e);
                setDestinationOptions([]);
                setDestination(undefined);
            }).finally(() => setPendingDestSearch(false))
        }
    }
    const loadDestinationOption = (iata: string) => {
        let airport = getAirportByIATA(iata);
        if(!airport) return;
        const option = {
            value: 0,
            label: capitalize(airport.city) + ", " + airport.name + " (" + iata + "), " + capitalize(airport.country),
            cityName: airport.city,
            countryCode: countryCodes.find(row => row.iata === iata)?.iso || "",
            iataCode: iata,
            airport: airport.name
        };
        setDestinationOptions([option]);
        setDestination(option);
    }
    const searchFlights = () => {
        setPendingFlightSearch(true);
        if (origin && destination && departureDate) {
            logSearchTerms(origin?.iataCode, destination?.iataCode)
            searchFlightOffers({origin, destination, departureDate, returnDate, adults, children, maxPrice, oneWay})
                .then((response => {
                    setFlightList(response.data.data);
                    setDictionaries(response.data.dictionaries)
                }))
                .catch((e) => {
                    console.error(e);
                    setFlightList([]);
                }).finally(() => {
                setPendingFlightSearch(false)
            });
        }
    }
    const searchFlightsBackup = () => {
        let originAirport = getAirportByIATA("MAD");
        setOriginOptions([{
            value: 0,
            label: capitalize(originAirport.city) + ", " + originAirport.name + " (" + originAirport.iata + "), " + capitalize(originAirport.country),
            cityName: originAirport.city,
            countryCode: countryCodes.find(row => row.iata === originAirport.iata)?.iso || "",
            iataCode: originAirport.iata,
            airport: originAirport.name
        }]);
        /*
        let destinationAirport = getAirportByIATA("OPO");
        setDestinationOptions([{
            value: 0,
            label: capitalize(destinationAirport.city) + ", " + destinationAirport.name + " (" + destinationAirport.iata + "), " + capitalize(destinationAirport.country),
            cityName: destinationAirport.city,
            countryCode: countryCodes.find(row => row.iata === destinationAirport.iata)?.iso || "",
            iataCode: destinationAirport.iata,
            airport: destinationAirport.name
        }])
        let departureDate ="2024-06-12";
        setDepartureDate(departureDate);
        searchFlightOffers({iataCode: "MAD"}, {iataCode: "OPO"}, departureDate, "", 1, 0, 500)
            .then((response => {
                setFlightList(response.data.data);
                setDictionaries(response.data.dictionaries)
                setPendingFlightSearch(false);
            }))
            .catch((e) => {
                console.error(e);
                setFlightList([]);
            });
            */
    }

    /*const getInspirationLocationCodes = (origin: { iataCode: string; }) => {
        if(!origin) return;
        console.log(origin);
        inspirationSearch(origin, oneWay)
            .then(r => {
                setDestRecos(r.data.data.slice(0,3));
                console.log(r.data.data);
            })
            .catch((e) => {
                console.error(e);
                setDestRecos([]);
            });
    }*/

    function checkIfSearchInfoEntered() {
        return (origin && destination && departureDate)
    }

    return (
        <div className={"search gap-3 p-3 d-flex flex-column rounded-2"}>
            <div className={"d-flex flex-row align-items-start justify-content-evenly"}>
                <div className={"date-select p-2 d-flex flex-column gap-2 align-items-center justify-content-start"}>
                    <div className={"d-flex flex-row justify-content-center flex-wrap gap-2"}>
                        <label>
                            <h5>Departure</h5>
                            <input className={"form-control form-control-sm"}
                                   type={"date"}
                                   min={new Date().toISOString().substring(0, 10)}
                                   defaultValue={new Date().toISOString().substring(0, 10)}
                                   onChange={(e) => {setDepartureDate(e.target.value)}}/>
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
                    <Select options={originOptions} className={"w-50"} onChange={(option) => setOrigin(option)}
                            styles={customStyles} value={originOptions ? originOptions[0] : undefined}
                            onInputChange={(inputValue) => {
                                if (inputValue.length >= 3) {
                                    setOriginSearchTerm(inputValue);
                                    originOptionsSearch(inputValue);
                                    setDestinationOptions([]); setDestination(undefined);
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
                            <Select options={destinationOptions} className={"w-50"} onChange={(option) => setDestination(option)}
                                    styles={customStyles} value={destinationOptions.length >= 1 ? destinationOptions[0] : undefined}
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
                {origin && departureDate && destination && pendingFlightSearch ?
                    <img src={pendingSearchIcon} width={"35%"} height={"50%"}
                         alt={""}/> :
                    <Button variant={!checkIfSearchInfoEntered() ? "outline-secondary" : "btn search-btn"}
                            className={"w-25"} disabled={!checkIfSearchInfoEntered()}
                            onClick={searchFlights}>Search</Button>}
                {!pendingFlightSearch &&
                    <Button variant={"btn search-btn"} className={"w-25 mt-2"} onClick={searchFlightsBackup}>Backup
                        Search</Button>}
                {/*<Button onClick={() => loadOriginOption("MAD")}>load</Button>
                <Button onClick={() => loadDestionationOption("OPO")}>load</Button>*/}
            </div>
        </div>
    );
}