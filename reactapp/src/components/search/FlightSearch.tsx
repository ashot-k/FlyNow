import { SingleValue } from "react-select";
import React, { useEffect, useRef, useState } from "react";
import { Dictionaries, Flight } from "../flight/FlightCard";
import { SearchSuggestion } from "../search-suggestions/SearchSuggestions";
import useSearchDestinationOptions from "../../hooks/useSearchDestinationOptions";
import useSearchOriginOptions from "../../hooks/useSearchOriginOptions";
import useSearchFlights from "../../hooks/useSearchFlights";
import { Button, Input } from "@headlessui/react";
import SearchErrorMessage from "./SearchErrorMessage";
import { useSearchParams } from "react-router-dom";
import UserSearchSuggestionsList from "../search-suggestions/UserSearchSuggestionsList";
import DatePicker from "./DatePicker";
import OriginSelect from "./OriginSelect";
import DestinationSelect from "./DestinationSelect";
import PassengerInput from "./PassengerInput";

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
    preloadedOriginIATA: string;
    preloadedDestinationIATA: string;
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

    const { searchFlights, pendingFlightSearch, flightList, dictionaries, noResults } = useSearchFlights();

    function triggerFlightSearch() {
        if (origin && destination && departureDate) {
            searchFlights(
                origin.iataCode,
                destination.iataCode,
                departureDate,
                returnDate ? returnDate : "",
                adults ? Number(adults) : 1,
                children ? Number(children) : undefined,
                maxPrice ? Number(maxPrice) : 1000,
            );
        }
    }

    function onSuggestionSelect(suggestion: SearchSuggestion) {
        loadRoute(suggestion.originIATA).then((options) =>
            setDestination(options.filter((option: Route) => option.iataCode === suggestion.destinationIATA)[0]),
        );
    }

    const startup = useRef(true);

    useEffect(() => {
        const originParam = searchParams.get("origin");
        const destParam = searchParams.get("dest");
        const departureDateParam = searchParams.get("depDate");
        if (!originParam || !destParam || !departureDateParam) {
            return;
        }
        if (origin && destination && departureDate) {
            if (startup.current) {
                startup.current = false;
                triggerFlightSearch();
            }
        }
    }, [origin, destination, departureDate]);

    useEffect(() => {
        const originParam = searchParams.get("origin");
        const destParam = searchParams.get("dest");
        const updateDestination = (options: Route[]) => {
            if (destParam) {
                setDestination(options.find((option: Route) => option.iataCode === destParam));
            }
        };
        if (origin?.iataCode !== originParam) {
            if (preloadedOriginIATA && preloadedOriginIATA.length > 0 && !originParam) {
                loadRoute(preloadedOriginIATA);
            } else if (originParam) {
                loadRoute(originParam).then(updateDestination);
            }
        } else if (destination?.iataCode !== destParam) {
            if (destinationOptions.length > 0) {
                updateDestination(destinationOptions);
            } else {
                if (originParam) searchDestinationOptions(originParam).then(updateDestination);
            }
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
        if (origin && destination && departureDate)
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
            if (options) setDestinationOptions(options);
            return options;
        });
    }

    function checkIfSearchInfoEntered() {
        return origin && destination && departureDate;
    }

    const onDepartureDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReturnDate("");
        setDepartureDate(e.target.value);
    };
    const onReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReturnDate(e.target.value);
    };
    const onOriginSelectChange = (option: SingleValue<Route> | undefined) => {
        if (option) {
            setOrigin(option);
            searchDestinationOptions(option.iataCode).then((options) => {
                if (options) {
                    setDestinationOptions(options);
                }
            });
        }
    };
    const onDestinationSelectChange = (option: SingleValue<Route> | undefined) => {
        if (option) {
            setDestination(option);
        }
    };
    const onChildPassengerInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0 || parseInt(e.target.value) < 0 || parseInt(e.target.value) > 9) setChildren(0);
    };
    const onAdultPassengerInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0 || parseInt(e.target.value) <= 0 || parseInt(e.target.value) > 9) setAdults(1);
    };

    return (
        <div className={className + " relative"} id={id}>
            <div className={"flex w-full flex-col justify-center gap-6 sm:flex sm:flex-row sm:gap-2"}>
                <div className={"flex flex-col items-center justify-start gap-0 py-1 sm:w-1/4 sm:gap-12 sm:py-3"}>
                    <DatePicker
                        label={"Departure"}
                        type={"departure"}
                        name={"departure-date"}
                        value={departureDate}
                        min={new Date().toISOString().substring(0, 10)}
                        onChange={onDepartureDateChange}
                    />
                    <DatePicker
                        type={"return"}
                        label={"Return"}
                        name={"return-date"}
                        value={returnDate}
                        min={departureDate}
                        onChange={onReturnDateChange}
                    />
                </div>
                <div className={"flex flex-col items-center justify-start gap-0 py-1 sm:w-2/4 sm:gap-8 sm:py-3"}>
                    <OriginSelect
                        isLoading={pendingOriginSearch}
                        loadOptions={loadOriginOptions}
                        value={origin ? origin : originOptions?.length > 0 ? originOptions[0] : undefined}
                        options={originOptions}
                        onChange={onOriginSelectChange}
                    />
                    <DestinationSelect
                        isLoading={pendingDestSearch}
                        options={destinationOptions}
                        value={destination}
                        onChange={onDestinationSelectChange}
                    />
                </div>
                <div className={"flex flex-col items-center justify-start gap-0 py-1 sm:w-1/4 sm:gap-8 sm:py-3"}>
                    <div className={"flex w-full justify-center gap-2"}>
                        <PassengerInput
                            label={"Adults"}
                            name={"adults"}
                            value={adults ? adults : 1}
                            onChange={(e) => setAdults(parseInt(e.target.value))}
                            onBlur={onAdultPassengerInputBlur}
                        />
                        <PassengerInput
                            label={"Children"}
                            name={"children"}
                            value={children ? children : 0}
                            onChange={(e) => setChildren(parseInt(e.target.value))}
                            onBlur={onChildPassengerInputBlur}
                        />
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
                <SearchErrorMessage
                    className={"flex w-full animate-fadeIn justify-center gap-2"}
                    message={"No available flights."}
                    show={!pendingFlightSearch && flightList.length <= 0 && noResults}
                />
            </>
            <div className={"flex w-full flex-row items-start justify-center gap-5 py-3 sm:flex-row"}>
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
                    }>
                    Trip Planner
                </Button>
            </div>
        </div>
    );
}
