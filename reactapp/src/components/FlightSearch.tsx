import Select, {components, ControlProps, OptionProps, SingleValueProps} from "react-select";
import {locationSelectStyles} from "../utils/Utils";
import React, {useEffect, useState} from "react";
import {Dictionaries, Flight} from "./FlightCard";
import AsyncSelect from "react-select/async";
import {SearchSuggestion} from "./search-suggestions/SearchSuggestions";
import useSearchDestinationOptions from "../hooks/useSearchDestinationOptions";
import useSearchOriginOptions from "../hooks/useSearchOriginOptions";
import UserSearchSuggestion from "./search-suggestions/UserSearchSuggestion";
import useUserSearchSuggestions from "../hooks/useUserSearchSuggestions";
import useSearchFlights from "../hooks/useSearchFlights";
import {Button, Input} from "@headlessui/react";
import Flag from "react-flagkit";
import pendingSearchIcon from '../static/assets/infinite-spinner.svg'
import calendarIcon from '../static/assets/calendar-color-icon.svg'
import ErrorMessage from "./ErrorMessage";

interface FlightSearchProps {
    onSearch: (searchData: FlightSearchData) => void;
    className?: string;
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
    originIATA: string;
    destinationIATA: string;
}


const option = ({innerProps, label, data}: OptionProps<Route, false>) => (<div
        className={"flex gap-2 py-2 px-2 even:bg-flyNow-even-option odd:bg-flyNow-odd-option hover:bg-flyNow-light cursor-pointer"} {...innerProps}>
        <Flag className={"size-6"} country={data.countryCode}/>
        <span className={"text-lg"}>
                {label}
            </span>
    </div>
)
const originControl = ({children, ...props}: ControlProps<Route>) => {
    return (
        <components.Control {...props}>
            <h3 className={"absolute px-3 -top-4 left-6 bg-flyNow-component"}>Origin</h3>
            {children}
        </components.Control>
    )
};
const destinationControl = ({children, ...props}: ControlProps<Route>) => {
    return (
        <components.Control{...props}>
            <label htmlFor={"destination-selection"}
                   className={"absolute px-3 -top-4 left-6 bg-flyNow-component"}>Destination</label>
            {children}
        </components.Control>
    )
};
const singleValue = ({data, children, ...props}: SingleValueProps<Route>) => {
    return (
        <components.SingleValue data={data}
                                className={"flex gap-2 items-center bg-transparent cursor-pointer"}  {...props}>
            <Flag className={"size-6"} country={data.countryCode}/>
            <span className={"text-lg"}>{data.label}</span>
        </components.SingleValue>
    )
}

export default function FlightSearch({
                                         onSearch, className,
                                         originIATA,
                                         destinationIATA
                                     }: FlightSearchProps & preloadedSearchInfo) {

    const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [oneWay, setOneWay] = useState<boolean>(true)
    const [returnDate, setReturnDate] = useState<string>('');
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [originSearchTerm, setOriginSearchTerm] = useState<string>('');
    const [preloadedOriginIATA, setPreloadedOriginIATA] = useState<string | undefined>(originIATA);
    const [preloadedDestinationIATA, setPreloadedDestinationIATA] = useState<string | undefined>(destinationIATA);

    const {userSearchSuggestions, pendingUserSearchSuggestions} = useUserSearchSuggestions();

    const {
        pendingOriginSearch,
        searchOriginOptions,
        origin, setOrigin,
        originOptions
    } = useSearchOriginOptions(preloadedOriginIATA);

    const {
        pendingDestSearch, searchDestinationOptions,
        destination, setDestination,
        destinationOptions, setDestinationOptions,
        loadDestinationOption
    } = useSearchDestinationOptions(departureDate, preloadedDestinationIATA);

    const {
        searchFlights,
        pendingFlightSearch,
        flightList,
        dictionaries,
        noResults
    } = useSearchFlights();

    function triggerFlightSearch() {
        if (origin && destination && departureDate)
            searchFlights(origin?.iataCode, destination?.iataCode, departureDate, oneWay, returnDate, adults, children, maxPrice);
    }

    function onSuggestionSelect(suggestion: SearchSuggestion) {
        setPreloadedOriginIATA(suggestion.originIATA)
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
        if (preloadedDestinationIATA && preloadedDestinationIATA?.length > 0 && destinationOptions?.length > 0) {
            loadDestinationOption(preloadedDestinationIATA)
        }
    }, [preloadedDestinationIATA, destinationOptions]);

    useEffect(() => {
        if (preloadedOriginIATA && preloadedOriginIATA.length > 0) {
            searchOriginOptions(preloadedOriginIATA).then(() => searchDestinationOptions(preloadedOriginIATA));
        }
    }, [preloadedOriginIATA]);

    useEffect(() => {
        setPreloadedDestinationIATA(destinationIATA);
        if (!(originIATA === preloadedOriginIATA)) {
            setPreloadedOriginIATA(originIATA)
        }
    }, [destinationIATA]);


    function checkIfSearchInfoEntered() {
        return (origin && destination && departureDate)
    }

    function loadOriginOptions(inputValue: string) {
        if (inputValue.length >= 3) {
            setOriginSearchTerm(inputValue);
            setDestinationOptions([]);
            setDestination(undefined);
            return searchOriginOptions(inputValue);
        }
    }

    return (
        <div
            className={className}>
            <div className={"flex flex-col sm:flex sm:flex-row gap-4 sm:gap-2 justify-center"}>
                <div className={"sm:w-1/4 py-1 sm:py-3 flex flex-col items-center justify-start sm:gap-8"}>
                    <div className={"relative w-full"}>
                        <label htmlFor={"departure-date"}>
                            <h5 className={"absolute -top-4 px-3 w-fit left-6 text-lg bg-flyNow-component flex items-center gap-2"}>Departure<img
                                className={"size-4 sm:hidden"} src={calendarIcon} alt={""}/></h5>
                        </label>
                        <Input name={"departure-date"}
                               className={"w-full rounded-xl sm:rounded-3xl bg-transparent outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light py-3 sm:py-2 px-5 text-white"}
                               type={"date"}
                               min={new Date().toISOString().substring(0, 10)}
                               defaultValue={new Date().toISOString().substring(0, 10)}
                               onChange={(e) => {
                                   setReturnDate('');
                                   setDepartureDate(e.target.value);
                               }}/>
                    </div>
                    <div className={"relative w-full"}>
                        <label htmlFor={"return-date"}>
                            <h5 className={"absolute -top-4 px-2 w-fit right-6 text-lg bg-flyNow-component flex items-center gap-2"}>
                                Return <img className={"size-4 sm:hidden"} src={calendarIcon} alt={""}/></h5>
                        </label>
                        <Input name={"return-date"} radioGroup={"one-way-check"} placeholder={"dd/mm/yyyy"}
                               className={"w-full rounded-xl sm:rounded-3xl bg-transparent outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light py-3 sm:py-2 px-5 text-white"}
                               type={"date"}
                               min={departureDate} value={returnDate}
                               onChange={(e) => setReturnDate(e.target.value)}/>
                    </div>
                </div>
                <hr className={"my-1 border-gray-700 sm:hidden"}/>
                <div className={"sm:w-2/4 py-1 sm:py-3 flex flex-col items-center justify-start gap-8"}>
                    <AsyncSelect placeholder={"Choose origin location"} name={"origin-selection"}
                                 className={"w-full sm:w-10/12 text-lg"} isLoading={pendingOriginSearch}
                                 defaultOptions={originOptions}
                                 loadOptions={loadOriginOptions}
                                 value={origin ? origin : (originOptions && originOptions?.length > 0) ? originOptions[0] : undefined}
                                 onChange={(option) => {
                                     if (option) {
                                         setOrigin(option);
                                         searchDestinationOptions(option.iataCode);
                                     }
                                 }}
                                 styles={locationSelectStyles}
                                 components={{
                                     Control: originControl,
                                     Option: option,
                                     SingleValue: singleValue
                                 }}
                    />
                    {!pendingDestSearch ?
                        <Select placeholder={"Choose destination location"} name={"destination-selection"}
                                className={"w-full sm:w-10/12 text-lg"}
                                options={destinationOptions}
                                value={destination ? destination : destinationOptions?.length > 0 ? destinationOptions[0] : undefined}
                                onChange={(option) => {
                                    if (option)
                                        setDestination(option)
                                }}
                                styles={locationSelectStyles}
                                components={{
                                    Control: destinationControl,
                                    Option: option,
                                    SingleValue: singleValue
                                }}
                            //isDisabled={pendingDestSearch || !destinationOptions || destinationOptions?.length <= 0}
                        /> : <img src={pendingSearchIcon} className={"size-36"} alt={""}/>}
                </div>
                <hr className={"my-2 border-gray-700 sm:hidden"}/>
                <div className={"sm:w-1/4 py-1 sm:py-3 flex flex-col items-center justify-start gap-8"}>
                    <div className={"w-full flex flex-wrap justify-center items-center"}>
                        <div className={"flex w-full gap-2 justify-evenly"}>
                            <div className={"relative w-1/2 flex flex-col gap-2"}>
                                <Input
                                    className={"w-full rounded-3xl bg-transparent outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light py-2 px-5 text-white"}
                                    type={"number"} name={"adults"}
                                    defaultValue={1} min={1} max={9}
                                    onChange={(e) => setAdults(parseInt(e.target.value))}/>
                                <label htmlFor={"adults"}>
                                    <h5 className={"absolute -top-4 px-3 w-fit left-6 text-sm bg-flyNow-component"}>Adults</h5>
                                </label>
                            </div>
                            <div className={"relative w-1/2 flex flex-col gap-2"}>
                                <Input
                                    className={"w-full rounded-3xl bg-transparent outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light py-2 px-5 text-white"}
                                    type={"number"} name={"children"}
                                    defaultValue={0} min={0} max={9}
                                    onChange={(e) => setChildren(parseInt(e.target.value))}/>
                                <label htmlFor={"children"}>
                                    <h5 className={"absolute -top-3 px-3 w-fit left-2 text-sm bg-flyNow-component"}>Children</h5>
                                </label>
                            </div>
                        </div>
                        <div className={"w-full p-6 mt-2"}>
                            <label htmlFor={"max-price"}>
                                <h5>Maximum price <span className={"font-bold"}>{maxPrice + '\u20AC'}</span></h5>
                            </label>
                            <Input name={"max-price"} className={"accent-flyNow-light-secondary w-full"} type={"range"}
                                   min={5}
                                   max={1000} value={maxPrice}
                                   onChange={(e) => setMaxPrice(parseInt(e.target.value))}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"w-full flex flex-col justify-center items-center gap-5"}>
                {userSearchSuggestions?.length > 0 &&
                    <div
                        className={"flex w-full sm:w-3/4 flex-col justify-start items-center gap-2"}>
                        <label className={"font-light text-lg"}>Search Again</label>
                        <div
                            className={"w-full flex justify-start sm:w-3/4 max-h-32 sm:max-h-20 p-4 border-t-flyNow-secondary border-t-2 gap-2 overflow-x-scroll sm:overflow-x-auto sm:flex-wrap sm:overflow-y-auto"}>
                            {userSearchSuggestions.map((suggestion, index) => (
                                <UserSearchSuggestion key={index} selectSuggestion={onSuggestionSelect}
                                                      suggestion={suggestion}/>
                            ))}
                        </div>
                    </div>}
                <ErrorMessage className={"w-full flex justify-center gap-2 animate-fadeIn"}
                              message={"No available origins."}
                              show={originSearchTerm.length >= 3 && originOptions?.length <= 0 && !pendingOriginSearch}/>
                <ErrorMessage className={"w-full flex justify-center gap-2 animate-fadeIn"}
                              message={"No available destinations."}
                              show={origin != null && originOptions?.length > 0 && departureDate.length > 0 && destinationOptions?.length <= 0 && !pendingDestSearch}/>
                <ErrorMessage className={"w-full flex justify-center gap-2 animate-fadeIn"}
                              message={"No available flights."}
                              show={!pendingFlightSearch && flightList.length <= 0 && noResults}/>
                <div className={"w-full flex flex-row sm:flex-row gap-5 justify-center items-center"}>
                    <Button
                        className={"transition-all duration-500 w-7/12 text-lg sm:xl sm:w-1/4 bg-flyNow-light sm:bg-transparent sm:hover:bg-flyNow-light sm:outline-flyNow-light  sm:outline-2  sm:outline px-5 py-2 rounded-xl"}
                        disabled={!checkIfSearchInfoEntered() || pendingFlightSearch}
                        onClick={triggerFlightSearch}>Search
                    </Button>
                    <Button
                        className={"transition-all duration-500 w-5/12 text-lg sm:xl sm:w-1/6 bg-flyNow-secondary sm:hover:bg-flyNow-light px-3 py-2 rounded-xl"}
                        disabled={!checkIfSearchInfoEntered() || pendingFlightSearch}>Trip Planner
                    </Button>
                </div>
            </div>
        </div>
    );
}