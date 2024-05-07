import {Carousel} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {getAirportByIATA} from "../utils/Utils";
import {activitiesInArea} from "../services/AmadeusAPIService";
import pendingSearchIcon from "../static/infinite-spinner.svg";

export const FlightDestinationRecos = ({iataCodes}: any) => {

    const [positions, setPositions] = useState<any>();
    const [recos, setRecos] = useState<any[]>([]);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        let pos = [];
        console.log(iataCodes)
        for (let code of iataCodes) {
            pos.push({
                latitude: getAirportByIATA(code)?.latitude,
                longitude: getAirportByIATA(code)?.longitude
            });
        }
        setPositions(pos);
    }, [iataCodes]);

    useEffect(() => {
        if (positions) {
            setPending(true)
            const totalRequests = positions.length;
            let completedRequests = 0;
            for (let i = 0; i < positions.length; i++) {
                setTimeout((latitude, longitude) => {
                    activitiesInArea(latitude, longitude)
                        .then((r) => {
                            if(r.data.data.length > 0)
                            recos.push(r.data.data)
                            setRecos(recos);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        }).finally(() => {
                        completedRequests++;

                        if (completedRequests === totalRequests) {
                            setPending(false);
                        }
                    });
                }, 1200 * i, positions[i].latitude, positions[i].longitude);
            }
        }
    }, [positions]);
    return (
        <>
            {pending ? <img src={pendingSearchIcon} width={"25%"} height={"25%"}
                            alt={""}/> : (recos?.length > 0 && <div className={'w-75 p-2'}>
                <h2 className={''}>Activities in various destinations</h2>
                <div className={'w-auto d-flex gap-3 justify-content-center shadow-sm'}>
                    {recos.map(reco => (
                        <Carousel fade={true} slide={false} className={'element-shadow'}>
                            {reco.map((activity: any) => (
                                <Carousel.Item>
                                    <a href={activity.bookingLink}>
                                        <img className={"carousel-img"} src={activity.pictures[0]} alt={""}/>
                                    </a>
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