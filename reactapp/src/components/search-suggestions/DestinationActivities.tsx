import React, { useEffect, useRef, useState } from "react";
import { devMode, getAirportByIATA } from "../../utils/Utils";
import { activitiesInArea } from "../../services/AmadeusAPIService";
import LoadingAnimation from "../loader/LoadingAnimation";
import "swiper/css";

import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperButtonNext } from "../swiper-extras/SwiperBtnNext";
import { SwiperButtonPrev } from "../swiper-extras/SwiperBtnPrev";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Autoplay, Pagination } from "swiper/modules";
import { activitiesInAreaDummy } from "../../services/DummyAmadeusService";

interface DestinationActivitiesProps {
    destinationIATA: string;
    className?: string;
}

interface Activity {
    name: string;
    description: string;
    rating: number;
    price: {
        amount: number;
        currencyCode: string;
    };
    pictures: string[];
    bookingLink: string;
}

export const DestinationActivities = ({ destinationIATA, className }: DestinationActivitiesProps) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [pending, setPending] = useState(false);
    useEffect(() => {
        async function findActivities() {
            let airport = getAirportByIATA(destinationIATA);
            setPending(true);
            let response;
            if (devMode()) {
                response = await activitiesInAreaDummy();
            } else {
                response = await activitiesInArea(airport.latitude, airport.longitude);
            }
            let data = response.data.data;
            setActivities(data);
            setPending(false);
        }
        if (destinationIATA?.length > 0) {
            findActivities();
        }
    }, [destinationIATA]);

    return (
        <div className={className}>
            {!pending ? (
                activities?.length > 0 && (
                    <>
                        <div className={"w-full p-3 text-start font-inter text-2xl sm:px-0 sm:py-2"}>Experiences</div>
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            loop={true}
                            autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            pagination={{ enabled: false }}
                            breakpoints={{
                                0: {
                                    pagination: {
                                        dynamicBullets: true,
                                        dynamicMainBullets: 2,
                                        enabled: true,
                                        type: "progressbar",
                                    },
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                    slidesPerGroup: 1,
                                    autoHeight: true,
                                },
                                640: {
                                    pagination: {
                                        dynamicBullets: true,
                                        dynamicMainBullets: 2,
                                        enabled: true,
                                    },
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                    slidesPerGroup: 2,
                                    autoHeight: true,
                                },
                                768: {
                                    pagination: {
                                        dynamicBullets: true,
                                        dynamicMainBullets: 2,
                                        enabled: true,
                                        type: "progressbar",
                                    },
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                    slidesPerGroup: 4,
                                    autoHeight: true,
                                },
                            }}
                            speed={400}
                            className={"w-full animate-fadeIn items-end"}>
                            {activities.map((activity, idx) => (
                                <SwiperSlide
                                    key={idx}
                                    className={"relative min-h-60 pt-3 duration-300 hover:scale-105"}>
                                    <img
                                        loading={"lazy"}
                                        className={"max-h-60 min-h-60 w-full"}
                                        src={activity.pictures[0]}
                                        alt={activity.name}
                                    />
                                    <a
                                        key={idx}
                                        href={activity.bookingLink}
                                        className={
                                            "absolute bottom-0 flex w-full flex-col items-center gap-2 bg-black bg-opacity-75 px-5 py-5"
                                        }>
                                        <div className={"flex w-full flex-col gap-1"}>
                                            <h2 className={"w-full text-lg text-white"}>{activity.name}</h2>
                                            {activity.price.amount && (
                                                <div>
                                                    <button
                                                        className={
                                                            "rounded-lg bg-flyNow-secondary px-3 py-1.5 text-sm"
                                                        }>
                                                        For{" "}
                                                        <span className={"font-bold"}>
                                                            {activity.price.amount} {activity.price.currencyCode}
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </a>
                                </SwiperSlide>
                            ))}
                            <div className={"hidden w-full justify-center gap-4 p-2 sm:flex"}>
                                <SwiperButtonPrev>
                                    <FontAwesomeIcon
                                        className={
                                            "rounded-lg bg-flyNow-component px-8 py-2 duration-500 hover:scale-110"
                                        }
                                        icon={faChevronLeft}
                                    />
                                </SwiperButtonPrev>
                                <SwiperButtonNext>
                                    <FontAwesomeIcon
                                        className={
                                            "rounded-lg bg-flyNow-component px-8 py-2 duration-500 hover:scale-110"
                                        }
                                        icon={faChevronRight}
                                    />
                                </SwiperButtonNext>
                            </div>
                            <div></div>
                        </Swiper>
                    </>
                )
            ) : (
                <LoadingAnimation color={"#4AB5F2"} className={"size-24 py-5"} />
            )}
        </div>
    );
};
