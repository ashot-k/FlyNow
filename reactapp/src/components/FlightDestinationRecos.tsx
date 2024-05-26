import React, {useEffect, useState} from "react";
import {getAirportByIATA} from "../utils/Utils";
import {recoMostTraveled} from "../services/AmadeusAPIService";
import pendingSearchIcon from "../static/infinite-spinner.svg";
import Flag from "react-flagkit";
import countryCodes from "../utils/countryCodes.json"
import Button from "react-bootstrap/Button";

interface Info {
    originIata: string,
    date: string
}

export interface destinations {
    dest: string[];
    originIata: string;
}

interface RecoSearchProps {
    onRecoSelect: (destinationIata: string, originIata :string) => void;
}

export default function FlightDestinationRecos({originIata, date, onRecoSelect}: Info & RecoSearchProps) {

    const [pending, setPending] = useState(false);
    const [destinations, setDestinations] = useState<string[]>([])

    useEffect(() => {
        setPending(true);
        recoMostTraveled(originIata, date)
            .then((r) => {
                let dests = [];
                let data = r.data.data
                for (let i = 0; i < data.length; i++) {
                   if (getAirportByIATA(data[i].destination)?.iata
                       && getAirportByIATA(data[i].destination)?.city
                       && getAirportByIATA(data[i].destination)?.name != "All Airports")
                    dests.push(data[i].destination)
                }
                dests = dests.slice(0, 3);

                setDestinations(dests);
            })
            .catch(e => console.log(e))
            .finally(() => setPending(false))
    }, []);

    function destSelection(destination : string){
        onRecoSelect(destination, originIata);
    }

    return (
        <>
            {pending ? <img src={pendingSearchIcon} width={"25%"} height={"25%"}
                            alt={""}/> : (destinations?.length > 0 && <div className={'w-50 p-2'}>
                <h3 className={''}>Popular destinations from your area</h3>
                <div className={'d-flex gap-3 justify-content-center shadow-sm flex-wrap'}>
                    {destinations.map((dest, index) => (
                        (getAirportByIATA(dest)?.iata && getAirportByIATA(dest)?.city && getAirportByIATA(dest)?.name != "All Airports") ?
                            <div key={index}
                                 className={"w-25 component-box p-3 gap-2 d-flex flex-column justify-content-between"}>
                                <h5><Flag
                                    country={countryCodes.find(row => row.iata === dest)?.iso}/> {getAirportByIATA(dest)?.city}, {getAirportByIATA(dest)?.country}
                                </h5>
                                <Button variant={"primary"} onClick={() => destSelection(dest)}>Select</Button>
                            </div> : <></>
                    ))}
                </div>
            </div>)}
        </>
    );
};