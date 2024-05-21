import {activitiesInArea} from "../services/AmadeusAPIService";
import React, {useEffect, useState} from "react";
import {Carousel} from "react-bootstrap";
import pendingSearchIcon from "../static/infinite-spinner.svg";
import axios from "axios";
import {getAirportByIATA, getUserLocation} from "../utils/Utils";

interface Destination {
    dest: string
}

interface Activity {
    name: string,
    description: string,
    rating: number,
    price: {
        amount: number,
        currencyCode: "EUR"
    },
    pictures: string[],
    bookingLink: string
}


export const DestinationActivities = ({dest}: Destination) => {

    const [recos, setRecos] = useState<Activity[]>([]);
    const [position, setPosition] = useState<any>();
    const [pending, setPending] = useState(false);
    useEffect(() => {
        if (dest?.length > 0)
            findActivities();
    }, []);

    function findActivities() {
        setPending(true);
        let airport = getAirportByIATA(dest);
        console.log(getAirportByIATA(dest).latitude)
        console.log(getAirportByIATA(dest).longitude)
        /* if ("geolocation" in navigator) {
              setPending(true);
              navigator.geolocation.getCurrentPosition((position) => {
                  activitiesInArea(position.coords.latitude, position.coords.longitude).then(r => {
                      setPosition(position.coords);
                      console.log(r.data.data)
                      locations.push(r.data.data);
                      setRecos(locations);
                      setPending(false)
                  })
              });
          }*/
        /*for (let i = 0; i < data.length; i++) {
                        activities.push(data[i])
                    }*/
        let activities = [];
        activitiesInArea(airport.latitude, airport.longitude).then(r => {
            let data = r.data.data
            console.log(r.data.data)
            setRecos(data);
            setPending(false)
        })
    }

    return (
        <>
            {pending ? <img src={pendingSearchIcon} width={"25%"} height={"25%"}
                            alt={""}/> : (recos?.length > 0 && <div className={'w-50 p-2'}>
                <h2 className={''}>Destination Experience</h2>
                <div className={'w-75 d-flex flex-column gap-3 justify-content-center shadow-sm'}>
                    {recos.splice(0, 5).map(activity => (
                        <Carousel fade={true} slide={false} className={'element-shadow'}>
                            {activity.pictures.map((picture) => (
                                <Carousel.Item>
                                    <a href={activity.bookingLink}>
                                        <img className={"carousel-img"} src={picture} alt={""}/>
                                    </a>
                                    <Carousel.Caption className={'text-white rounded-1 bg-body-tertiary bg-opacity-50'}>
                                        {activity.name} {activity.price.amount} {activity.price.currencyCode}
                                    </Carousel.Caption>
                                </Carousel.Item>))}
                        </Carousel>
                    ))}
                </div>
            </div>)}
        </>
    );
};