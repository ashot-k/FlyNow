import React, { useEffect, useState } from "react";
import { getAirportByIATA } from "../../utils/Utils";
import { activitiesInArea, activitiesInAreaDummy } from "../../services/AmadeusAPIService";
import LoadingAnimation from "../../utils/LoadingAnimation";
import "swiper/css";

import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperButtonNext } from "../SwiperBtnNext";
import { SwiperButtonPrev } from "../SwiperBtnPrev";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "swiper/modules";

interface DestinationActivitiesProps {
    dest: string;
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

export const DestinationActivities = ({ dest, className }: DestinationActivitiesProps) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if (dest?.length > 0) findActivities();
    }, [dest]);

    async function findActivities() {
        /*
             if ("geolocation" in navigator) {
                  setPending(true);
                  navigator.geolocation.getCurrentPosition((position) => {
                  //position.coords.latitude, position.coords.longitude
                  });
              }
              */
        let airport = getAirportByIATA(dest);
        setPending(true);
        let response;
        if (process.env.REACT_APP_DEV_MODE === "true")
            response = await activitiesInAreaDummy(airport.latitude, airport.longitude);
        else response = await activitiesInArea(airport.latitude, airport.longitude);
        let data = response.data.data;
        setActivities(data);
        setPending(false);
    }

    return (
        <div className={className}>
            {pending ? (
                <LoadingAnimation color={"#4AB5F2"} className={"size-32 w-full py-5"} />
            ) : (
                activities?.length > 0 && (
                    <>
                        <div className={"w-full p-5 text-start font-inter text-4xl"}>Experiences</div>
                        <Swiper
                            modules={[Pagination]}
                            loop={true}
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
                            className={"w-full items-end"}>
                            {activities.map((activity, idx) => (
                                <SwiperSlide
                                    key-={idx}
                                    className={"relative min-h-64 pt-3 duration-300 hover:scale-105"}>
                                    <img
                                        loading={"lazy"}
                                        className={"max-h-64 min-h-64 w-full"}
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
            )}
        </div>
    );
};
