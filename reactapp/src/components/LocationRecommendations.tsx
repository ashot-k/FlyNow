import {activitiesInArea} from "../services/AmadeusAPIService";
import React, {useEffect, useState} from "react";
import {Carousel} from "react-bootstrap";
import pendingSearchIcon from "../static/infinite-spinner.svg";
import {wait} from "@testing-library/user-event/dist/utils";

export const LocationRecommendations = () => {
    const [recos, setRecos] = useState<any[]>([]);
    const [position, setPosition] = useState<any>();
    const [pending, setPending] = useState(false);
    useEffect(() => {
        checkLocation();
    }, []);

    function checkLocation() {
        let locations: any[] = [];
        if ("geolocation" in navigator) {
            setPending(true);
            navigator.geolocation.getCurrentPosition((position) => {
                activitiesInArea(position.coords.latitude, position.coords.longitude).then(r => {
                    setPosition(position.coords);
                    console.log(position.coords.latitude, position.coords.longitude);
                    console.log(r.data.data)
                    locations.push(r.data.data);
                    //setPending(false)
                }).then(() => {
                    setTimeout(() => {
                    activitiesInArea(41.4, 2.16).then(r => {
                        locations.push(r.data.data);
                        setPending(false);
                        setRecos(locations);
                    }) }, 3000);
                })
            });
        } else {
            /* geolocation IS NOT available */
        }

    }

    return (
        <>
            {pending ? <img src={pendingSearchIcon} width={"25%"} height={"25%"}
                            alt={""}/> : (recos?.length > 0 && <div className={'w-75 p-2'}>
                <h2 className={''}>In your Area</h2>
                <div className={'w-auto d-flex gap-3 justify-content-center shadow-sm'}>
                    {recos.map(reco => (
                        <Carousel fade={true} slide={false} className={'element-shadow'}>
                            {reco.map((activity: any) => (
                                <Carousel.Item>
                                    <a href={activity.bookingLink}><img className={"carousel-img"}
                                                                        src={activity.pictures[0]}/></a>
                                    <Carousel.Caption className={'text-white rounded-1 bg-body-tertiary bg-opacity-50'}>
                                        {activity.name}
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ))}
                </div>
            </div>)}
        </>
    );
};