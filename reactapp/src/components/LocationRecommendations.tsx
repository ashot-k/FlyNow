import {activitiesInArea} from "../services/AmadeusAPIService";
import {useEffect, useState} from "react";
import {Carousel} from "react-bootstrap";

export const LocationRecommendations = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [position, setPosition] = useState<any>();
    useEffect(() => {
        checkLocation();
    }, []);
    function checkLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                activitiesInArea(position.coords.latitude, position.coords.longitude).then(r => {
                    setPosition(position.coords);
                    console.log(position.coords.latitude, position.coords.longitude);
                    console.log(r.data.data)
                    setActivities(r.data.data);
                })
            });
        } else {
            /* geolocation IS NOT available */
        }
    }
    return (
        <>
        {activities?.length > 0 && <div className={'w-75 p-2'}>
            <h3 className={''}>In your Area</h3>
            <div className={'w-auto d-flex'}>
                <Carousel fade={true} slide={false} className={'element-shadow'}>
                    {activities.map((activity) => (
                        <Carousel.Item>
                            <a href={activity.bookingLink}><img width={320} height={260}
                                                                src={activity.pictures[0]}/></a>
                            <Carousel.Caption className={'text-white rounded-1 bg-body-tertiary bg-opacity-50'}>
                                {activity.name}
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>}
        </>
    );
};