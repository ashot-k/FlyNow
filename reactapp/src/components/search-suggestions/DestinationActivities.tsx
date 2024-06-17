import React, {useEffect, useState} from "react";
import pendingSearchIcon from "../../static/assets/infinite-spinner.svg";

interface DestinationActivitiesProps {
    dest: string,
    className?: string
}

interface Activity {
    name: string,
    description: string,
    rating: number,
    price: {
        amount: number,
        currencyCode: string
    },
    pictures: string[],
    bookingLink: string
}

export const DestinationActivities = ({dest, className}: DestinationActivitiesProps) => {

    const [activities, setActivities] = useState<Activity[]>([]);
    const [pending, setPending] = useState(false);
    const dummyActivity = {
        name: "activity name",
        price: {amount: 123, currencyCode: "EUR"},
        description: "Amongus activity isijfasioejgiower jfiowerjf weiofjr afiocv jeiove viose jvioejvioaejvioeavjeaiocjeioacvai ocvioaedcjioaeicoaeiio.",
        rating: 55,
        bookingLink: "booking",
        pictures: ["https://images.musement.com/cover/0001/07/prado-museum-tickets_header-6456.jpeg?w=500"]
    };
    const dummyActivity2 = {
        name: "activity name2",
        price: {amount: 12312312312, currencyCode: "EUR"},
        description: "Amongus activityadfasd sda sdasda sda sdfa sdfa ",
        rating: 55,
        bookingLink: "booking",
        pictures: ["https://images.musement.com/cover/0001/07/prado-museum-tickets_header-6456.jpeg?w=500"]
    };

    useEffect(() => {
        if (dest?.length > 0)
            findActivities();
    }, [dest]);

    useEffect(() => {
        const allActivities = [
            dummyActivity, dummyActivity2, dummyActivity, dummyActivity2, dummyActivity, dummyActivity,
            dummyActivity, dummyActivity, dummyActivity, dummyActivity, dummyActivity, dummyActivity
        ];
        setActivities(allActivities);

    }, []);

    function findActivities() {
        /*
         if ("geolocation" in navigator) {
              setPending(true);
              navigator.geolocation.getCurrentPosition((position) => {
              //position.coords.latitude, position.coords.longitude
              });
          }
          */
        /* let airport = getAirportByIATA(dest);
         setPending(true);
         activitiesInArea(airport.latitude, airport.longitude).then(r => {
             let data = r.data.data
             setActivities(data.slice(0,2 ));
             console.log(r.data)
             setPending(false)
         }).catch(e => console.log(e));*/
    }

    return (
        <>
            {pending ? <img src={pendingSearchIcon} width={"25%"} height={"25%"}
                            alt={""}/> : (activities?.length > 0 &&
                <div
                    className={className + " element-shadow p-4 d-flex flex-column justify-content-start align-items-start"}>
                    <div className={'activity-container d-flex flex-row justify-content-center'}>
                        <div className={"w-100"}>
                            {activities.map((activity) => (
                                <div>
                                    <div className={"w-100 row"}>
                                        <a href={activity.bookingLink} className={"col-sm-5"}>
                                            <img className={"carousel-img"} src={activity.pictures[0]}
                                                 alt={""}/>
                                        </a>
                                        <div className={"col-sm-4 d-flex flex-column justify-content-between"}>
                                            <div>
                                                <h2 className={'text-white'}>
                                                    {activity.name}
                                                </h2>
                                                <span className={"text-wrap"}>{activity.description}</span>
                                            </div>
                                            <div>
                                                <button
                                                    className={"btn"}>For {activity.price.amount} {activity.price.currencyCode}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>))}
                        </div>

                    </div>
                </div>)}
        </>
    );
};