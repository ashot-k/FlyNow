import {
    calculateStops,
    flightDateToStringShort,
    flightDateToStringTime,
    timeDiffToHoursAndMins,
} from "../utils/Utils";
import React, { useContext, useMemo, useState } from "react";
import { AuthContext, DictionariesContext } from "../context";
import { useLocation, useNavigate } from "react-router-dom";
import airlines from "../utils/airlines.json";
import ArrowRight from "../static/assets/arrow-right.svg";
import {
    Button,
    Dialog,
    DialogPanel,
    DialogTitle,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/free-solid-svg-icons";
import FlightScheduleTable from "./FlightScheduleTable";
import UserDetails from "./UserDetails";

export interface Flight {
    itineraries: {
        segments: {
            departure: {
                at: string;
                iataCode: string;
            };
            arrival: {
                at: string;
                iataCode: string;
            };
        }[];
    }[];
    validatingAirlineCodes: string;
    numberOfBookableSeats: number;
    price: {
        total: number;
        currency: string;
    };
}

export interface Dictionaries {
    carriers: {
        [code: string]: string;
    };
    locations: {
        [code: string]: {
            cityCode: string;
            countryCode: string;
        };
    };
    aircraft: {
        [code: string]: string;
    };
}

interface FlightCardProps {
    flight: Flight;
    className?: string;
}

export default function FlightCard({ flight, className }: FlightCardProps) {
    const dictionaries = useContext(DictionariesContext);

    const userData = useContext(AuthContext);
    const navigate = useNavigate();
    let location = useLocation();

    const outboundStart = useMemo(() => flight.itineraries[0]?.segments[0].departure.at, [flight.itineraries]);
    const outboundEnd = useMemo(
        () => flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.at,
        [flight.itineraries],
    );

    const destination = useMemo(
        () => flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1].arrival.iataCode,
        [flight.itineraries],
    );
    const returnStart = useMemo(() => flight.itineraries[1]?.segments[0].departure.at, [flight.itineraries]);
    const returnEnd = useMemo(
        () => flight.itineraries[1]?.segments[flight.itineraries[1].segments.length - 1].arrival.at,
        [flight.itineraries],
    );

    const [show, setShow] = useState(false);

    function handleClose() {
        const modal = document.getElementById("booking-modal");
        if (!modal) return;
        modal.classList.add("animate-fadeOut");
        modal.parentElement?.classList.remove("sm:backdrop-blur-md");
        modal.addEventListener("animationend", function removeElement() {
            modal.remove();
            setShow(false);
        });
    }

    const handleShow = () => setShow(true);

    const airlineInfo = useMemo(
        () =>
            airlines.find(
                (airline) =>
                    airline.name.toLowerCase() === dictionaries?.carriers[flight.validatingAirlineCodes]?.toLowerCase(),
            ),
        [dictionaries?.carriers, flight.validatingAirlineCodes],
    );

    const totalFlights = useMemo(() => {
        let count = flight.itineraries[0].segments.length;
        if (flight.itineraries[1]) count += flight.itineraries[1].segments.length;
        return count;
    }, [flight.itineraries]);

    function book(flight: Flight) {
        if (!userData?.username) {
            return navigate("/login", {
                state: { prevURL: location.pathname + location.search },
            });
        }
        /* let flights = [];
            flights.push({
                origin: flight.itineraries[0].segments[0].departure.iataCode,
                destination: flight.itineraries[flight.itineraries.length - 1]
                    .segments[flight.itineraries[flight.itineraries.length - 1].segments.length - 1]
                    .arrival.iataCode,
                departureDate: flight.itineraries[0].segments[0].departure.at,
                price: flight.price.total
            })
            axiosFlyNow.post("flight/book", flights).then(r => {
                if (r.status === 200) {
                    handleClose();
                }
    
            });*/
    }

    return (
        <div className={className}>
            <div className={"flex w-full items-start justify-between font-bold text-white"}>
                <div className={"flex w-full items-center justify-between gap-2 p-2 sm:items-center"}>
                    <div className={"flex items-center gap-2 sm:items-center"}>
                        <img
                            loading={"lazy"}
                            className={"relative left-0 top-0 size-12 rounded-full sm:size-16"}
                            src={
                                airlineInfo?.logo ||
                                "https://www.emme2servizi.it/wp-content/uploads/2020/12/no-image.jpg"
                            }
                            alt={"image unavailable"}
                        />
                        <span className={"w-3/4 overflow-auto text-start text-sm sm:ps-2 sm:pt-0"}>
                            {dictionaries?.carriers[flight.validatingAirlineCodes]} ({flight.validatingAirlineCodes})
                        </span>
                    </div>
                    <div className={"flex h-full w-1/3 flex-col items-end justify-end py-2 pe-2 ps-5"}>
                        <span className={"text-end text-sm"}>Flights {totalFlights}</span>
                        <span className={"text-end text-sm"}>
                            Stops {calculateStops(flight.itineraries[0].segments)}
                        </span>
                    </div>
                </div>
            </div>
            <Disclosure as={"div"} className={"sm:px-8"} defaultOpen={false}>
                <DisclosureButton
                    className={
                        "group relative flex w-full items-center justify-between transition-all duration-500 hover:scale-95"
                    }>
                    <div className={"flex w-full flex-col items-center justify-start gap-2"}>
                        {flight.itineraries[0] && (
                            <div className={"flex w-2/3 flex-col gap-1"}>
                                <div className={"flex justify-center"}>
                                    <span className={"w-full text-center text-lg"}>
                                        Outbound{" "}
                                        <span className={"text-blue-400"}>
                                            {flightDateToStringShort(outboundStart)}
                                        </span>
                                    </span>
                                </div>
                                <div className={"flex items-center justify-center gap-2 text-xl"}>
                                    <span> {flightDateToStringTime(outboundStart)}</span>
                                    <img src={ArrowRight} className={"size-5"} alt={""} />
                                    <span> {flightDateToStringTime(outboundEnd)}</span>
                                </div>
                                <div className={"w-full text-end text-sm"}>
                                    Duration{" "}
                                    <span className={"text-rose-500"}>
                                        {timeDiffToHoursAndMins(outboundStart, outboundEnd)}
                                    </span>
                                </div>
                            </div>
                        )}
                        {flight.itineraries[1] && (
                            <div className={"flex w-2/3 flex-col gap-1"}>
                                <div className={"flex justify-center"}>
                                    <span className={"w-full text-center text-lg"}>
                                        Return{" "}
                                        <span className={"text-blue-400"}>{flightDateToStringShort(returnStart)}</span>
                                    </span>
                                </div>
                                <div className={"flex items-center justify-center gap-2 text-xl"}>
                                    <span> {flightDateToStringTime(returnStart)}</span>
                                    <img src={ArrowRight} className={"size-5"} alt={""} />
                                    <span> {flightDateToStringTime(returnEnd)}</span>
                                </div>
                                <div className={"w-full text-end text-sm"}>
                                    Duration{" "}
                                    <span className={"text-rose-500"}>
                                        {timeDiffToHoursAndMins(returnStart, returnEnd)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <FontAwesomeIcon
                        icon={faLongArrowDown}
                        className="absolute right-5 size-7 transition-colors duration-300 hover:text-emerald-400 group-data-[open]:rotate-180 sm:right-0"
                    />
                </DisclosureButton>
                <DisclosurePanel className="mt-3 overflow-auto text-sm sm:px-1">
                    <FlightScheduleTable className={"mt-5 flex w-full animate-fadeIn flex-col gap-5"} flight={flight} />
                </DisclosurePanel>
            </Disclosure>
            <div className={"flex items-center justify-center px-5 py-4"}>
                <button
                    className={
                        "w-2/3 rounded-xl bg-flyNow-light px-2 py-2 transition duration-500 hover:bg-flyNow-secondary lg:w-5/6 xl:w-5/12"
                    }
                    onClick={() => handleShow()}>
                    Book for{" "}
                    <span className={"font-bold"}>
                        {flight.price.total} {flight.price.currency}
                    </span>
                </button>
            </div>
            {show && (
                <Dialog open={show} onClose={handleClose} className={"relative z-50 text-white"}>
                    <div
                        className={
                            "fixed inset-0 flex w-full animate-fadeIn items-center justify-center sm:backdrop-blur-sm"
                        }>
                        <DialogPanel
                            id={"booking-modal"}
                            className={
                                "flex h-full w-full flex-col items-center justify-start gap-6 bg-flyNow-component pb-6 shadow-md shadow-black sm:h-5/6 sm:w-1/2 sm:rounded-xl sm:px-12" +
                                (show ? "" : "")
                            }>
                            <DialogTitle
                                className={
                                    "flex w-full flex-col items-center bg-flyNow-secondary py-3 text-center text-3xl sm:bg-transparent"
                                }>
                                Booking Confirmation
                                <hr className={"mt-2 hidden w-1/2 border-gray-500 sm:block"} />
                            </DialogTitle>
                            <div
                                className={
                                    "flex w-full flex-col items-start gap-6 overflow-y-auto sm:flex-row sm:justify-between sm:px-1"
                                }>
                                <div className={"flex h-2/3 w-full flex-col gap-2 px-1 sm:h-full sm:w-7/12"}>
                                    <h1 className={"px-2 text-2xl"}>Complete Schedule</h1>
                                    <FlightScheduleTable
                                        className={
                                            "flex h-full w-full animate-fadeIn flex-col items-center gap-5 overflow-y-auto border-y-2 border-y-flyNow-secondary px-2 py-5 pt-5 sm:px-3"
                                        }
                                        flight={flight}
                                    />
                                </div>
                                <div className={"flex w-full flex-col gap-2 px-5 sm:w-5/12"}>
                                    <h1 className={"text-2xl"}>Traveler</h1>
                                    <hr className={"border-gray-500 pt-5"} />
                                    <UserDetails className={"flex w-full flex-col items-center gap-3.5"} />
                                </div>
                            </div>
                            <div className={"px-2 text-lg"}>Available Seats: {flight.numberOfBookableSeats}</div>
                            <div className={"flex w-full justify-center gap-5 px-2 sm:justify-end"}>
                                <Button
                                    className={
                                        "w-4/12 rounded-lg bg-gray-500 px-2 py-2 text-lg transition duration-500 hover:bg-gray-400 sm:w-1/6 sm:text-xl"
                                    }
                                    onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className={
                                        "w-7/12 rounded-lg bg-flyNow-light px-5 py-2 text-lg transition duration-500 hover:bg-flyNow-secondary sm:w-1/4 sm:px-2 sm:text-xl"
                                    }
                                    onClick={() => book(flight)}>
                                    Book for{" "}
                                    <span className={"font-bold"}>
                                        {flight.price.total} {flight.price.currency}
                                    </span>
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </div>
    );
}
