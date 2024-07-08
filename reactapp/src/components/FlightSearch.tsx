import Select from "react-select";
import { destinationControl, locationSelectStyles, option, originControl, singleValue } from "./SelectProps";
import React, { useEffect, useRef, useState } from "react";
import { Dictionaries, Flight } from "./FlightCard";
import AsyncSelect from "react-select/async";
import { SearchSuggestion } from "./search-suggestions/SearchSuggestions";
import useSearchDestinationOptions from "../hooks/useSearchDestinationOptions";
import useSearchOriginOptions from "../hooks/useSearchOriginOptions";
import UserSearchSuggestion from "./search-suggestions/UserSearchSuggestion";
import useUserSearchSuggestions from "../hooks/useUserSearchSuggestions";
import useSearchFlights from "../hooks/useSearchFlights";
import { Button, Input } from "@headlessui/react";
import calendarIcon from "../static/assets/calendar-color-icon.svg";
import SearchErrorMessage from "./SearchErrorMessage";
import { useSearchParams } from "react-router-dom";
import LoadingAnimation from "../utils/LoadingAnimation";

interface FlightSearchProps {
    onSearch: (searchData: FlightSearchData) => void;
    className?: string;
    id?: string;
}

export interface Route {
    value: number;
    label: string;
    cityName: string;
    countryCode: string;
    iataCode: string;
    airport: string;
}

interface SearchInfo {
    departureDate: string;
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

export default function FlightSearch({
    onSearch,
    className,
    id,
    originIATA,
    destinationIATA,
}: FlightSearchProps & preloadedSearchInfo) {
    const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [returnDate, setReturnDate] = useState<string>("");
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [searchParams, setSearchParams] = useSearchParams();
    const originSearchTerm = useRef<string>("");
    const { userSearchSuggestions, pendingUserSearchSuggestions } = useUserSearchSuggestions();

    const { pendingOriginSearch, searchOriginOptions, origin, setOrigin, originOptions, setOriginOptions } =
        useSearchOriginOptions();

    const {
        pendingDestSearch,
        searchDestinationOptions,
        destination,
        setDestination,
        destinationOptions,
        setDestinationOptions,
    } = useSearchDestinationOptions();

    const { pendingFlightSearch, flightList, dictionaries, noResults } = useSearchFlights();

    function triggerFlightSearch() {
        if (origin && destination) {
            searchParams.set("origin", origin.iataCode);
            searchParams.set("dest", destination.iataCode);
            searchParams.set("depDate", departureDate);
            searchParams.set("returnDate", returnDate);
            searchParams.set("adults", String(adults));
            searchParams.set("children", String(children));
            searchParams.set("max_price", String(maxPrice));
            setSearchParams(searchParams);
        }
    }

    function onSuggestionSelect(suggestion: SearchSuggestion) {
        loadRoute(suggestion.originIATA).then((options) =>
            setDestination(options.filter((option: any) => option.iataCode === suggestion.destinationIATA)[0]),
        );
    }

    useEffect(() => {
        const originParam = searchParams.get("origin");
        const destParam = searchParams.get("dest");
        const updateDestination = (options: Route[]) => {
            if (destParam) {
                setDestination(options.find((option: Route) => option.iataCode === destParam));
            }
        };

        if (origin?.iataCode !== originParam) {
            if (originIATA && originIATA.length > 0 && !originParam) {
                loadRoute(originIATA);
            } else if (originParam) {
                loadRoute(originParam).then(updateDestination);
            }
        } else if (destination?.iataCode !== destParam) {
            if (destinationOptions.length > 0) updateDestination(destinationOptions);
            else searchDestinationOptions(originParam).then(updateDestination);
        }

        const departureDate = searchParams.get("depDate");
        const returnDate = searchParams.get("returnDate");
        const adults = searchParams.get("adults");
        const children = searchParams.get("children");
        const maxPrice = searchParams.get("max_price");
        if (departureDate) setDepartureDate(departureDate);
        setMaxPrice(maxPrice ? Number(maxPrice) : 1000);
        setAdults(adults ? Number(adults) : 1);
        setChildren(children ? Number(children) : 0);
        setReturnDate(returnDate ? returnDate : "");
    }, [searchParams]);

    useEffect(() => {
        if (origin && destination)
            onSearch({
                searchInfo: {
                    origin: origin,
                    destination: destination,
                    departureDate,
                    returnDate,
                    adults,
                    children,
                    maxPrice,
                },
                flightList,
                dictionaries,
                pending: pendingFlightSearch,
            });
    }, [flightList, dictionaries]);

    function loadOriginOptions(inputValue: string) {
        if (inputValue.length >= 3) {
            originSearchTerm.current = inputValue;
            setDestinationOptions([]);
            setDestination(undefined);
            setOrigin(undefined);
            return searchOriginOptions(inputValue).then((options) => {
                if (options) setOriginOptions(options);
                return options;
            });
        }
    }

    async function loadRoute(originIATA: string) {
        const options = await searchOriginOptions(originIATA);
        if (options) {
            setOriginOptions([options[0]]);
            setOrigin(options.filter((option) => option.iataCode === originIATA)[0]);
        }
        return searchDestinationOptions(originIATA).then((options) => {
            if (options) setDestinationOptions(options);
            return options;
        });
    }

    function checkIfSearchInfoEntered() {
        return origin && destination && departureDate;
    }

    return (
        <div className={className + " relative"} id={id}>
            <div className={"flex w-full flex-col justify-center gap-4 sm:flex sm:flex-row sm:gap-2"}>
                <div className={"flex flex-col items-center justify-start gap-0 py-1 sm:w-1/4 sm:gap-12 sm:py-3"}>
                    <div className={"relative w-full"}>
                        <label htmlFor={"departure-date"}>
                            <h5
                                className={
                                    "absolute -top-4 left-6 flex w-fit items-center gap-2 bg-flyNow-component px-2 text-lg"
                                }>
                                Departure
                                <img className={"size-4 sm:hidden"} src={calendarIcon} alt={""} />
                            </h5>
                        </label>
                        <Input
                            name={"departure-date"}
                            className={
                                "w-full rounded-md bg-transparent px-5 py-3 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:rounded-xl sm:py-2"
                            }
                            type={"date"}
                            min={new Date().toISOString().substring(0, 10)}
                            defaultValue={new Date().toISOString().substring(0, 10)}
                            onChange={(e) => {
                                setReturnDate("");
                                setDepartureDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className={"relative w-full"}>
                        <label htmlFor={"return-date"}>
                            <h5
                                className={
                                    "absolute -top-4 right-6 flex w-fit items-center gap-2 bg-flyNow-component px-2 text-lg"
                                }>
                                Return <img className={"size-4 sm:hidden"} src={calendarIcon} alt={""} />
                            </h5>
                        </label>
                        <Input
                            name={"return-date"}
                            radioGroup={"one-way-check"}
                            placeholder={"dd/mm/yyyy"}
                            className={
                                "w-full rounded-md bg-transparent px-5 py-3 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:rounded-xl sm:py-2"
                            }
                            type={"date"}
                            min={departureDate}
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                        />
                    </div>
                </div>
                <hr className={"my-1 border-gray-700 sm:hidden"} />
                <div className={"flex flex-col items-center justify-start gap-0 py-1 sm:w-2/4 sm:gap-8 sm:py-3"}>
                    <AsyncSelect
                        placeholder={"Choose origin"}
                        name={"origin-selection"}
                        className={"w-full text-lg sm:w-10/12"}
                        isLoading={pendingOriginSearch}
                        defaultOptions={originOptions}
                        loadOptions={loadOriginOptions}
                        value={
                            origin ? origin : originOptions && originOptions?.length > 0 ? originOptions[0] : undefined
                        }
                        onChange={(option) => {
                            if (option) {
                                setOrigin(option);
                                searchDestinationOptions(option.iataCode).then((options) => {
                                    if (options) setDestinationOptions(options);
                                });
                            }
                        }}
                        styles={locationSelectStyles}
                        components={{
                            Control: originControl,
                            Option: option,
                            SingleValue: singleValue,
                        }}
                    />
                    {!pendingDestSearch ? (
                        <Select
                            placeholder={"Choose destination"}
                            name={"destination-selection"}
                            className={"w-full text-lg sm:w-10/12"}
                            options={destinationOptions}
                            value={destination}
                            onChange={(option) => {
                                if (option) setDestination(option);
                            }}
                            styles={locationSelectStyles}
                            components={{
                                Control: destinationControl,
                                Option: option,
                                SingleValue: singleValue,
                            }}
                        />
                    ) : (
                        <LoadingAnimation className={"h-12 w-10/12"} />
                    )}
                </div>
                <div
                    className={
                        "flex flex-col items-center justify-start gap-8 py-1 sm:w-1/4 sm:justify-center sm:py-3"
                    }>
                    <div className={"flex w-full flex-wrap items-center justify-center gap-2 sm:gap-6"}>
                        <div className={"flex w-full justify-center gap-2"}>
                            <div className={"relative flex w-3/12 flex-col gap-2 sm:w-1/2"}>
                                <Input
                                    className={
                                        "w-full rounded-xl bg-transparent px-5 py-1.5 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light"
                                    }
                                    type={"text"}
                                    name={"adults"}
                                    inputMode={"numeric"}
                                    pattern={"[0-9]*"}
                                    value={adults ? adults : ""}
                                    defaultValue={1}
                                    max={9}
                                    onBlur={(e) => {
                                        if (
                                            e.target.value.length === 0 ||
                                            parseInt(e.target.value) <= 0 ||
                                            parseInt(e.target.value) > 9
                                        )
                                            setAdults(1);
                                    }}
                                    onChange={(e) => {
                                        setAdults(parseInt(e.target.value));
                                    }}
                                />
                                <label htmlFor={"adults"}>
                                    <h5 className={"absolute -top-3 left-6 w-fit bg-flyNow-component px-3 text-sm"}>
                                        Adults
                                    </h5>
                                </label>
                            </div>
                            <div className={"relative flex w-3/12 flex-col gap-2 sm:w-1/2"}>
                                <Input
                                    className={
                                        "w-full rounded-xl bg-transparent px-5 py-1.5 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light"
                                    }
                                    type={"text"}
                                    name={"children"}
                                    inputMode={"numeric"}
                                    pattern={"[0-9]*"}
                                    value={children ? children : 0}
                                    defaultValue={0}
                                    min={0}
                                    max={9}
                                    onBlur={(e) => {
                                        if (
                                            e.target.value.length === 0 ||
                                            parseInt(e.target.value) < 0 ||
                                            parseInt(e.target.value) > 9
                                        )
                                            setChildren(0);
                                    }}
                                    onChange={(e) => {
                                        setChildren(parseInt(e.target.value));
                                    }}
                                />
                                <label htmlFor={"children"}>
                                    <h5 className={"absolute -top-3 left-2 w-fit bg-flyNow-component px-3 text-sm"}>
                                        Children
                                    </h5>
                                </label>
                            </div>
                        </div>
                        <div className={"w-full px-3"}>
                            <label htmlFor={"max-price"}>
                                <h5>
                                    Maximum price <span className={"font-bold"}>{maxPrice + "\u20AC"}</span>
                                </h5>
                            </label>
                            <Input
                                name={"max-price"}
                                className={"w-full accent-flyNow-light-secondary"}
                                type={"range"}
                                min={5}
                                max={1000}
                                defaultValue={maxPrice}
                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {userSearchSuggestions?.length > 0 && (
                <div className={"flex w-full flex-col items-center justify-start gap-2 sm:w-3/4"}>
                    <label className={"text-lg font-light"}>Search Again</label>
                    <div
                        className={
                            "flex max-h-32 w-full justify-start gap-2 overflow-x-scroll border-t-2 border-t-flyNow-secondary p-4 sm:max-h-20 sm:w-3/4 sm:flex-wrap sm:justify-center sm:overflow-x-auto sm:overflow-y-auto"
                        }>
                        {!pendingUserSearchSuggestions ? (
                            userSearchSuggestions.map((suggestion, index) => (
                                <UserSearchSuggestion
                                    key={index}
                                    selectSuggestion={onSuggestionSelect}
                                    suggestion={suggestion}
                                />
                            ))
                        ) : (
                            <LoadingAnimation className={"size-2"} width={"25%"} height={"0.2rem"} />
                        )}
                    </div>
                </div>
            )}
            <SearchErrorMessage
                className={"flex w-full animate-fadeIn justify-center gap-2"}
                message={"No available origins."}
                show={originSearchTerm.current.length >= 3 && originOptions?.length <= 0 && !pendingOriginSearch}
            />
            <SearchErrorMessage
                className={"flex w-full animate-fadeIn justify-center gap-2"}
                message={"No available destinations."}
                show={
                    origin != null &&
                    originOptions?.length > 0 &&
                    departureDate.length > 0 &&
                    destinationOptions?.length <= 0 &&
                    !pendingDestSearch
                }
            />
            <SearchErrorMessage
                className={"flex w-full animate-fadeIn justify-center gap-2"}
                message={"No available flights."}
                show={!pendingFlightSearch && flightList.length <= 0 && noResults}
            />
            <div className={"flex w-full flex-row items-center justify-center gap-5 py-3 sm:flex-row"}>
                <Button
                    className={
                        "sm:xl w-7/12 rounded-xl bg-flyNow-light px-5 py-2 text-lg transition-all duration-500 disabled:bg-gray-600 disabled:text-gray-500 disabled:outline-0 disabled:hover:bg-gray-600 sm:w-1/4 sm:bg-transparent sm:outline sm:outline-2 sm:outline-flyNow-light sm:hover:bg-flyNow-light"
                    }
                    disabled={!checkIfSearchInfoEntered() || pendingFlightSearch}
                    onClick={triggerFlightSearch}>
                    Search
                </Button>
                <Button
                    className={
                        "sm:xl w-5/12 rounded-xl bg-flyNow-secondary px-3 py-2 text-lg transition-all duration-500 disabled:bg-gray-600 disabled:text-gray-500 disabled:outline-0 disabled:hover:bg-gray-600 sm:w-1/6 sm:hover:bg-flyNow-light"
                    }
                    //   disabled={!checkIfSearchInfoEntered() || pendingFlightSearch}
                >
                    Trip Planner
                </Button>
            </div>
        </div>
    );
}
