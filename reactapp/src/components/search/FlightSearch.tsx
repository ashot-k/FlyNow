import { SingleValue } from "react-select";
import React, { useEffect, useRef, useState } from "react";
import { SearchSuggestion } from "../search-suggestions/SearchSuggestions";
import useSearchDestinationOptions from "../../hooks/useSearchDestinationOptions";
import useSearchOriginOptions from "../../hooks/useSearchOriginOptions";
import { Button, Input } from "@headlessui/react";
import SearchErrorMessage from "./SearchErrorMessage";
import { useSearchParams } from "react-router-dom";
import UserSearchSuggestionsList from "../search-suggestions/UserSearchSuggestionsList";
import DateSelect from "./DateSelect";
import OriginSelect from "./OriginSelect";
import DestinationSelect from "./DestinationSelect";
import PassengerInput from "./PassengerInput";
import MultiDatePicker from "./MultiDatePicker";
import SingleDatePicker from "./SingleDatePicker";

interface FlightSearchProps {
    onSearch: (searchOptions: SearchParams) => void;
    className?: string;
    id?: string;
}

export interface RouteInfo {
    value: number;
    label: string;
    cityName: string;
    countryCode: string;
    iataCode: string;
    airport: string;
}

export interface SearchParams {
    departureDate: string;
    returnDate: string;
    adults: number;
    children: number;
    origin: string;
    destination: string;
    maxPrice: number;
}

interface preloadedSearchInfo {
    preloadedOriginIATA?: string;
    preloadedDestinationIATA?: string;
}

export default function FlightSearch({
    onSearch,
    className,
    id,
    preloadedOriginIATA,
    preloadedDestinationIATA,
}: FlightSearchProps & preloadedSearchInfo) {
    const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [returnDate, setReturnDate] = useState<string>("");
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [searchParams, setSearchParams] = useSearchParams();
    const [oneWay, setOneWay] = useState(true);
    const originSearchTerm = useRef<string>("");

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

    function onSuggestionSelect(suggestion: SearchSuggestion) {
        loadRoute(suggestion.originIATA).then((options) =>
            setDestination(options.filter((option: RouteInfo) => option.iataCode === suggestion.destinationIATA)[0]),
        );
    }

    function triggerOnSearch() {
        if (origin && destination) {
            onSearch({
                origin: origin.iataCode,
                destination: destination.iataCode,
                departureDate,
                returnDate,
                adults,
                children,
                maxPrice,
            });
        }
    }

    const loading = useRef(true);
    useEffect(() => {
        if (searchParams.size > 0) {
            loading.current = true;
        }
    }, [searchParams]);

    useEffect(() => {
        if (origin && destination) {
            localStorage.setItem("originCity", origin.cityName);
            localStorage.setItem("destinationCity", destination.cityName);
        }
    }, [origin, destination]);
    useEffect(() => {
        setReturnDate("");
        setDepartureDate("");
    }, [oneWay]);

    useEffect(() => {
        const originParam = searchParams.get("origin");
        const destParam = searchParams.get("dest");
        const departureDateParam = searchParams.get("depDate");
        const returnDate = searchParams.get("returnDate");
        const adults = searchParams.get("adults");
        const children = searchParams.get("children");
        const maxPrice = searchParams.get("maxPrice");
        if (originParam && destParam && departureDateParam && loading.current) {
            loading.current = false;
            const updateDestination = (options: RouteInfo[]) => {
                if (destParam) {
                    setDestination(options.find((option) => option.iataCode === destParam));
                }
            };
            if (origin?.iataCode !== originParam) {
                loadRoute(originParam).then(updateDestination);
            } else if (destination?.iataCode !== destParam) {
                if (destinationOptions.length > 0) {
                    updateDestination(destinationOptions);
                } else {
                    searchDestinationOptions(originParam).then(updateDestination);
                }
            }
            setDepartureDate(departureDateParam);
            setMaxPrice(maxPrice ? Number(maxPrice) : 1000);
            setAdults(adults ? Number(adults) : 1);
            setChildren(children ? Number(children) : 0);
            setReturnDate(returnDate ? returnDate : "");
        } else if (preloadedOriginIATA && loading.current) {
            loading.current = false;
            loadRoute(preloadedOriginIATA);
        }
    }, [searchParams, origin, destination]);

    function loadOriginOptions(inputValue: string) {
        if (inputValue.length >= 3) {
            originSearchTerm.current = inputValue;
            setDestinationOptions([]);
            setDestination(undefined);
            setOrigin(undefined);
            return searchOriginOptions(inputValue).then((options) => {
                if (options) {
                    setOriginOptions(options);
                }
                return options;
            });
        }
    }

    async function loadRoute(originIATA: string) {
        if (originIATA !== origin?.iataCode) {
            const options = await searchOriginOptions(originIATA);
            if (options) {
                setOriginOptions([options[0]]);
                setOrigin(options.filter((option) => option.iataCode === originIATA)[0]);
            }
        }
        return searchDestinationOptions(originIATA).then((options) => {
            if (options) {
                setDestinationOptions(options);
            }
            return options;
        });
    }

    function checkIfSearchInfoEntered() {
        return !!(origin && destination && departureDate);
    }
    const onOriginSelectChange = (option: SingleValue<RouteInfo> | undefined) => {
        if (option) {
            setOrigin(option);
            searchDestinationOptions(option.iataCode).then((options) => {
                if (options) {
                    setDestinationOptions(options);
                }
            });
        }
    };
    const onDestinationSelectChange = (option: SingleValue<RouteInfo> | undefined) => {
        if (option) {
            setDestination(option);
        }
    };
    const onChildPassengerInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0 || parseInt(e.target.value) < 0 || parseInt(e.target.value) > 9) {
            setChildren(0);
        }
    };
    const onAdultPassengerInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0 || parseInt(e.target.value) <= 0 || parseInt(e.target.value) > 9) {
            setAdults(1);
        }
    };
    const onMultiDatesChange = (dates: [Date | null, Date | null]) => {
        if (dates[0]) {
            const localISODate = new Date(dates[0].getTime() - dates[0].getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 10);
            setDepartureDate(localISODate);
        }
        if (dates[1]) {
            const localISODate = new Date(dates[1].getTime() - dates[1].getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 10);
            setReturnDate(localISODate);
        } else {
            setReturnDate("");
        }
    };
    const onSingleDateChange = (date: Date | null) => {
        if (date) {
            const localISODate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
            setDepartureDate(localISODate);
            setReturnDate("");
        }
    };

    return (
        <div className={className + " relative"} id={id}>
            <div className={"flex w-full flex-col justify-center gap-6 sm:flex sm:flex-row sm:gap-2"}>
                <div className={"flex flex-col items-center justify-between gap-2 text-base sm:w-1/4 sm:justify-start"}>
                    {/*  <DateSelect
                        className={"relative w-1/2 sm:w-full"}
                        label={"Departure"}
                        type={"departure"}
                        name={"departure-date"}
                        value={departureDate}
                        min={new Date().toISOString().substring(0, 10)}
                        onChange={onDepartureDateChange}
                    />
                    <DateSelect
                        className={"relative w-1/2 sm:w-full"}
                        type={"return"}
                        label={"Return"}
                        name={"return-date"}
                        value={returnDate}
                        min={departureDate}
                        onChange={onReturnDateChange}
                    />*/}
                    {oneWay && (
                        <SingleDatePicker
                            origin={origin?.iataCode}
                            destination={destination?.iataCode}
                            className={"relative w-full animate-fadeIn sm:w-fit sm:min-w-64"}
                            value={onSingleDateChange}
                        />
                    )}
                    {!oneWay && (
                        <MultiDatePicker
                            className={"relative w-full animate-fadeIn sm:w-fit sm:min-w-64"}
                            values={onMultiDatesChange}
                        />
                    )}
                    <div className={"flex w-full justify-center gap-0.5 text-sm"}>
                        <button
                            className={
                                "w-1/2 rounded-sm bg-opacity-90 py-2 transition-colors duration-300 hover:bg-flyNow-secondary " +
                                (oneWay ? "bg-flyNow-light" : "bg-gray-700")
                            }
                            onClick={() => setOneWay(true)}>
                            One way
                        </button>
                        <button
                            className={
                                "w-1/2 rounded-sm bg-opacity-90 py-2 transition-colors duration-300 hover:bg-flyNow-secondary " +
                                (!oneWay ? "bg-flyNow-light" : "bg-gray-700")
                            }
                            onClick={() => setOneWay(false)}>
                            Round-trip
                        </button>
                    </div>
                </div>
                <div className={"flex flex-col items-center justify-between text-sm sm:w-1/2 sm:gap-6 sm:text-base"}>
                    <OriginSelect
                        className={"w-full sm:w-5/6"}
                        isLoading={pendingOriginSearch}
                        loadOptions={loadOriginOptions}
                        defaultOptions={originOptions}
                        value={origin ? origin : originOptions?.length > 0 ? originOptions[0] : undefined}
                        onChange={onOriginSelectChange}
                    />
                    <DestinationSelect
                        className={"w-full sm:w-5/6"}
                        isLoading={pendingDestSearch}
                        options={destinationOptions}
                        value={destination}
                        onChange={onDestinationSelectChange}
                    />
                </div>
                <div className={"flex flex-col items-center justify-between sm:w-1/4 sm:gap-0"}>
                    <div className={"flex w-full justify-center gap-2 text-sm"}>
                        <PassengerInput
                            className={"relative flex w-1/4 flex-col gap-2 sm:w-1/2"}
                            label={"Adults"}
                            name={"adults"}
                            value={adults ? adults : 1}
                            onChange={(e) => setAdults(parseInt(e.target.value))}
                            onBlur={onAdultPassengerInputBlur}
                        />
                        <PassengerInput
                            className={"relative flex w-3/12 flex-col gap-2 sm:w-1/2"}
                            label={"Children"}
                            name={"children"}
                            value={children ? children : 0}
                            onChange={(e) => setChildren(parseInt(e.target.value))}
                            onBlur={onChildPassengerInputBlur}
                        />
                    </div>
                    <div className={"w-full px-3 text-sm"}>
                        <label htmlFor={"max-price"}>
                            <h5>
                                Maximum price <span className={"font-bold"}>{maxPrice + "\u20AC"}</span>
                            </h5>
                        </label>
                        <Input
                            name={"max-price"}
                            className={"w-full py-1 accent-flyNow-light-secondary"}
                            type={"range"}
                            min={5}
                            max={1000}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <UserSearchSuggestionsList
                className={"flex w-full flex-col items-center justify-start gap-2 sm:w-3/4"}
                onSuggestionSelect={onSuggestionSelect}
            />
            <>
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
            </>
            <div
                className={
                    "flex w-full flex-row items-start justify-center gap-3 py-3 text-sm sm:flex-row sm:text-base"
                }>
                <Button
                    className={
                        "w-fit rounded-xl bg-flyNow-light px-20 py-2 transition-all duration-500 disabled:bg-gray-600 disabled:text-gray-500 disabled:outline-0 disabled:hover:bg-gray-600 sm:bg-transparent sm:outline sm:outline-2 sm:outline-flyNow-light sm:hover:bg-flyNow-light"
                    }
                    disabled={!checkIfSearchInfoEntered()}
                    onClick={triggerOnSearch}>
                    Search
                </Button>
                <Button
                    className={
                        "w-fit rounded-xl bg-flyNow-secondary px-5 py-2 transition-all duration-500 disabled:bg-gray-600 disabled:text-gray-500 disabled:outline-0 disabled:hover:bg-gray-600 sm:hover:bg-flyNow-light"
                    }>
                    Trip Planner
                </Button>
            </div>
        </div>
    );
}
