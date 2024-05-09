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
interface FlightSearchProps {
    onSearch: (searchData: FlightSearchData) => void;
}

interface FlightSearchData {
    departureDate: string;
    oneWay: boolean;
    returnDate: string;
    adults: number;
    children: number;
    origin: any;
    destination: any;
    maxPrice: number;
    flightList: any[];
    dictionaries: any[];
}
export const FlightSearch = ({onSearch}: FlightSearchProps) => {

    const [pendingFlightSearch, setPendingFlightSearch] = useState(false);
    const [pendingOriginSearch, setPendingOriginSearch] = useState(false);
    const [pendingDestSearch, setPendingDestSearch] = useState(false);
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
    const [flightList, setFlightList] = useState<any[]>([]);
    const [dictionaries, setDictionaries] = useState<any[]>([]);
    const handleSearch = () =>{
        onSearch({
            origin, destination, departureDate,  returnDate, oneWay, adults, children,  maxPrice, flightList, dictionaries
        })
    }
    useEffect(() => {
        if(origin && departureDate?.length > 0)
            destinationOptionsSearch();
    }, [origin, departureDate]);

    useEffect(() => {
        if(flightList.length > 0 && dictionaries) {
            handleSearch();
        }
    }, [flightList, dictionaries]);

    const originOptionsSearch = (inputValue: string) => {
        var options: any[] = [];
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
            setPendingOriginSearch(false);
        })
    }
    const destinationOptionsSearch = () => {
        var options: any[] = [];
        if (origin && departureDate) {
            setPendingDestSearch(true)
            searchAvailableDestinations(origin, false, false, departureDate).then(availableDestinations => {
                availableDestinations.data.data.map((destinationInfo: any, index: number) => {
                    let airport = getAirportByIATA(destinationInfo.destination);
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
    const searchFlights = () => {
        setPendingFlightSearch(true);
        searchFlightOffers(origin, destination, departureDate, returnDate, adults, children, maxPrice)
            .then((response => {
                setFlightList(response.data.data);
                setDictionaries(response.data.dictionaries)
                setPendingFlightSearch(false);
            }))
            .catch((e) => {
                console.error(e);
                setFlightList([]);
            });
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

    return (
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
                <div
                    className={"location-select p-2 gap-3 d-flex flex-column align-items-center justify-content-start"}>
                    <label>
                        Origin {origin && <Flag country={origin.countryCode}/>}
                    </label>
                    <Select options={originOptions} className={"w-50"} onChange={(option) => setOrigin(option)}
                            styles={customStyles}
                            onInputChange={(inputValue) => {
                                if (inputValue.length >= 3) {
                                    setOriginSearchTerm(inputValue);
                                    originOptionsSearch(inputValue);
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
                        className={"passenger-selection d-flex flex-column gap-2 align-items-center justify-content-start"}>
                        <label>
                            <h5>Max Price {maxPrice + '\u20AC'} </h5>
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
    );
}