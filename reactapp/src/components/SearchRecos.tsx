import React, {useEffect, useState} from "react";
import {getSearchTerms} from "../services/FlyNowServiceAPI";
import Flag from "react-flagkit";
import countryCodes from "../utils/countryCodes.json";
import {getAirportByIATA} from "../utils/Utils";
import Button from "react-bootstrap/Button";

export interface SearchReco {
    origin: string;
    destination: string;
}

interface SearchRecoProps{
    onSearchRecoSelect: (searchReco: SearchReco) => void;
}

export default function SearchRecos({onSearchRecoSelect}: SearchRecoProps) {
    const [recos, setRecos] = useState<SearchReco[]>([]);

    useEffect(() => {
        getSearchTerms().then((r) => setRecos(r.data)).catch(e => console.log(e))
    }, []);

    useEffect(() => {
    }, [recos]);

    function searchRecoSelection(searchReco: SearchReco){
        onSearchRecoSelect(searchReco);
    }

    return (
       <> {recos?.length > 0 ? <div className={"w-100 p-2"}>
            <h3>Search again</h3>
            <div className={"w-100 d-flex flex-wrap gap-3"}>
                {recos?.map((reco, index) => (
                    <div key={index}
                         className={"component-box p-3 d-flex flex-column justify-content-center align-items-center gap-2"}>
                        <div>
                            <Flag
                                country={countryCodes.find(row => row.iata === reco.origin)?.iso}/> {getAirportByIATA(reco.origin)?.city}, {getAirportByIATA(reco.origin)?.country} ---{">"} <Flag
                                country={countryCodes.find(row => row.iata === reco.destination)?.iso}/> {getAirportByIATA(reco.destination)?.city}, {getAirportByIATA(reco.destination)?.country}
                        </div>
                        <Button variant={"primary"} className={"w-50"} onClick={() => searchRecoSelection(reco)}>Select</Button>
                    </div>
                ))}
            </div>
        </div>: <></>}
       </>
    )
}