import Flag from "react-flagkit";
import Select from "react-select";
import {customStyles} from "../utils/Utils";
import pendingSearchIcon from "../static/infinite-spinner.svg";
import {Alert} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import {Dictionaries, Flight} from "./FlightCard";
import "../static/Search.css"
import AsyncSelect from "react-select/async";
import {SearchSuggestion} from "./search-suggestions/SearchSuggestions";
import useSearchDestinationOptions from "../hooks/useSearchDestinationOptions";
import useSearchOriginOptions from "../hooks/useSearchOriginOptions";
import UserSearchSuggestion from "./search-suggestions/UserSearchSuggestion";
import useUserSearchSuggestions from "../hooks/useUserSearchSuggestions";
import useSearchFlights from "../hooks/useSearchFlights";
import "../static/SearchSuggestions.css"

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

 interface SearchInfo {
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
    pending: boolean;
    flightList: Flight[];
    dictionaries: Dictionaries;
}

interface preloadedSearchInfo {
    originiataCode: string;
    destinationiataCode: string;
}

export default function FlightSearch({
                                         onSearch,
                                         originiataCode,
                                         destinationiataCode
                                     }: FlightSearchProps & preloadedSearchInfo) {

    const [preloadedOriginIATA, setPreloadedOriginIATA] = useState<string>(originiataCode);
    const [preloadedDestinationIATA, setPreloadedDestinationIATA] = useState<string>(destinationiataCode);

    const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [oneWay, setOneWay] = useState<boolean>(true)
    const [returnDate, setReturnDate] = useState<string>('');
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [originSearchTerm, setOriginSearchTerm] = useState<string>('');

    const [noResultsAlert, setNoResultsAlert] = useState<boolean>(false);
    const {userSearchSuggestions, pendingUserSearchSuggestions} = useUserSearchSuggestions();

    const {
        pendingOriginSearch,
        searchOriginOptions, origin, setOrigin,
        originOptions, setOriginOptions
    } = useSearchOriginOptions();

    const {
        pendingDestSearch, searchDestinationOptions,
        destination, setDestination,
        destinationOptions, setDestinationOptions,
        loadDestinationOption
    } = useSearchDestinationOptions(departureDate, origin?.iataCode);

    const {
        searchFlights,
        pendingFlightSearch,
        flightList,
        setFlightList,
        dictionaries,
        setDictionaries,
        noResults
    } = useSearchFlights();

    function triggerFlightSearch() {
        if (origin && destination && departureDate)
            searchFlights(origin?.iataCode, destination?.iataCode, departureDate, oneWay, returnDate, adults, children, maxPrice);
    }

    function onSuggestionSelect(suggestion: SearchSuggestion) {
        setPreloadedOriginIATA(suggestion.originIATA);
        setPreloadedDestinationIATA(suggestion.destinationIATA);
    }

    const returnSearchResults = () => {
        if (origin && destination)
            onSearch({
                searchInfo: {
                    origin: origin,
                    destination: destination,
                    departureDate, returnDate, oneWay, adults, children, maxPrice
                },
                flightList,
                dictionaries,
                pending: pendingFlightSearch
            });
    }

    useEffect(() => {
        returnSearchResults();
    }, [flightList, dictionaries]);

    useEffect(() => {
        setPreloadedDestinationIATA(destinationiataCode);
        if(!(originiataCode === preloadedOriginIATA)){
            setPreloadedOriginIATA(originiataCode)
        }
    }, [destinationiataCode]);

    useEffect(() => {
        if (preloadedOriginIATA?.length > 0) {
          searchOriginOptions(preloadedOriginIATA).then(()=> searchDestinationOptions(preloadedOriginIATA));
        }
    }, [preloadedOriginIATA]);

    useEffect(() => {
        if (preloadedDestinationIATA?.length > 0 && destinationOptions?.length > 0) {
            loadDestinationOption(preloadedDestinationIATA)
        }
    }, [preloadedDestinationIATA, destinationOptions]);

    function checkIfSearchInfoEntered() {
        return (origin && destination && departureDate)
    }

    return (
        <div className={"search gap-4 component-box p-3 d-flex flex-column rounded-1 fs-5 fw-normal"}>
            <div className={"row search-options justify-content-center"}>
                <div className={"col-sm date-select d-flex flex-column align-items-center justify-content-center"}>
                    <div className={"row w-100 gap-2"}>
                        <label className={"col-sm"}>
                            <h5>Departure</h5>
                            <input className={"form-control form-control-lg fw-light"}
                                   type={"date"}
                                   min={new Date().toISOString().substring(0, 10)}
                                   defaultValue={new Date().toISOString().substring(0, 10)}
                                   onChange={(e) => {
                                       setDepartureDate(e.target.value)
                                   }}/>
                            <div className="form-check mt-2">
                                <input type={"radio"} className={"form-check-input"}
                                       name={"oneWayCheck"}
                                       onChange={(e) => setOneWay(true)} checked={oneWay}/>
                                <label className={"form-check-label"}>One-Way</label>
                            </div>
                        </label>
                        <label className={"col-sm"}>
                            <h5>Return</h5>
                            <input className={"form-control form-control-lg fw-light"}
                                   type={"date"}
                                   min={departureDate} disabled={oneWay}
                                   onChange={(e) => setReturnDate(e.target.value)}/>
                            <div className="form-check mt-2">
                                <input type={"radio"} className={"form-check-input"}
                                       name={"oneWayCheck"}
                                       onChange={(e) => {
                                           setOneWay(false);
                                           setReturnDate('');
                                       }}/>
                                <label className={"form-check-label"}>Roundtrip</label>
                            </div>
                        </label>
                    </div>
                </div>
                <div
                    className={"col-sm location-select d-flex flex-column align-items-center justify-content-center gap-3"}>
                    <label>
                        Origin {origin && <Flag country={origin.countryCode}/>}
                    </label>
                    <AsyncSelect className={"w-100"} isLoading={pendingOriginSearch} defaultOptions={originOptions}
                                 loadOptions={(inputValue) => {
                                     if (inputValue.length >= 3) {
                                         setOriginSearchTerm(inputValue);
                                         setDestinationOptions([]);
                                         setDestination(undefined);
                                         return searchOriginOptions(inputValue);
                                     }
                                 }}
                                 onChange={(option) => {
                                     if (option) {
                                         setOrigin(option)
                                         searchDestinationOptions(option.iataCode)
                                     }
                                 }}
                                 styles={customStyles}
                                 value={origin ? origin : (originOptions && originOptions?.length > 0) ? originOptions[0] : undefined}
                                 components={{
                                     Option: ({innerProps, label, data}) => (
                                         <div className={"options"} {...innerProps}>
                                             <span><Flag country={data.countryCode}/> {label}</span>
                                         </div>)
                                 }}
                    />
                    <label>Destination {destination &&
                        <Flag country={destination.countryCode}/>}</label>
                    {!pendingDestSearch ?
                            <Select options={destinationOptions} className={"w-100"}
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
                                    isDisabled={pendingDestSearch || !destinationOptions || destinationOptions?.length <= 0}
                            /> : <img src={pendingSearchIcon} width={"30%"} height={"30%"} alt={""}/>}
                </div>
                <div className={"col-sm settings d-flex flex-column align-items-center justify-content-center gap-4"}>
                    <div className={"d-flex justify-content-center align-items-center gap-4 w-100 flex-wrap"}>
                        <label className={"w-25 position-relative"}>
                            <input className={"form-control form-control-lg"} type={"number"} id={"adults"}
                                   defaultValue={1} min={1} max={9}
                                   onChange={(e) => setAdults(parseInt(e.target.value))}/>
                            <label htmlFor={"adults"} className={"form-label"}>Adults</label>
                        </label>
                        <label className={"w-25 position-relative"}>
                            <input className={"form-control form-control-lg"} type={"number"} id={"children"}
                                   defaultValue={0} min={0} max={9}
                                   onChange={(e) => setChildren(parseInt(e.target.value))}/>
                            <label htmlFor={"children"} className={"form-label"}>Children</label>
                        </label>
                        <label className={"w-50"}>
                            <h5>Max Price {maxPrice + '\u20AC'} </h5>
                            <input className={"form-range"} type={"range"} min={5} max={1000} value={maxPrice}
                                   onChange={(e) => setMaxPrice(parseInt(e.target.value))}/>
                        </label>
                    </div>
                </div>
            </div>
            <div className={"w-100 d-flex flex-column justify-content-center align-items-center gap-3"}>
                {userSearchSuggestions?.length > 0 &&
                    <div className={"d-flex search-suggestion-container flex-column justify-content-start align-items-center gap-2"}>
                        <label className={"fw-lighter fs-6"}>Search Again</label>
                        <div className="search-suggestion-list w-75 d-flex flex-wrap overflow-y-auto gap-1">
                            {userSearchSuggestions.map((suggestion, index) => (
                                <UserSearchSuggestion key={index} selectSuggestion={onSuggestionSelect}
                                                      suggestion={suggestion}/>
                            ))}
                        </div>
                    </div>}
                <Alert variant={"danger"}
                       show={originSearchTerm.length > 0 && !originOptions?.length && !pendingOriginSearch}>No
                    available origin</Alert>
                <Alert variant={"danger"}
                       show={origin != null && departureDate.length > 0 && !(destinationOptions?.length > 0) && !pendingDestSearch}>No
                    available destinations</Alert>
                <Alert variant={"danger"}
                       show={!pendingFlightSearch && flightList.length <= 0 && noResultsAlert}>No
                    available flights</Alert>
                <div className={"w-50 d-flex justify-content-center align-items-center "}>
                    <Button variant={!checkIfSearchInfoEntered() ? "outline-secondary" : "btn"}
                            className={"search-btn rounded-5"} disabled={!checkIfSearchInfoEntered() || pendingFlightSearch}
                            onClick={triggerFlightSearch}>Search</Button>
                    {/*<Button variant={"btn search-btn"} className={"w-25"}>Trip Planner</Button>*/}
                </div>
            </div>
        </div>
    );
}