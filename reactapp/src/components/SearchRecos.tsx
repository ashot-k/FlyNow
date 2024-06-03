import React, {useEffect, useState} from "react";
import {getSearchTerms} from "../services/FlyNowServiceAPI";
import Flag from "react-flagkit";
import countryCodes from "../utils/countryCodes.json";
import {getAirportByIATA} from "../utils/Utils";
import Button from "react-bootstrap/Button";
import ArrowRight from "../static/arrow-right.svg";

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
                         className={"search-reco component-box p-4 d-flex flex-column justify-content-center align-items-center"}>
                        <Button variant={"btn app-btn"} className={"w-100 p-2 ps-3 pe-3 d-flex gap-2 fw-bold fs-6 justify-content-center"}
                                onClick={() => searchRecoSelection(reco)}>
                            <Flag size={24}
                                country={countryCodes.find(row => row.iata === reco.origin)?.iso}/>
                            <span>{getAirportByIATA(reco.origin)?.city}</span>
                            {/*, {getAirportByIATA(reco.origin)?.country}*/}
                            <img src={ArrowRight} width={'24px'} alt={''}/>
                            <Flag size={24}
                                country={countryCodes.find(row => row.iata === reco.destination)?.iso}/>
                            <span>{getAirportByIATA(reco.destination)?.city}</span>
                                {/*, {getAirportByIATA(reco.destination)?.country}*/}
                        </Button>
                    </div>
                ))}
            </div>
        </div>: <></>}
       </>
    )
}