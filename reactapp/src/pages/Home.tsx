import React, {useEffect, useState} from "react";
import FlightSearch, {FlightSearchData, Route} from "../components/FlightSearch";
import SearchInfoHeader from "../components/SearchInfoHeader";
import {FlightList} from "../components/FlightList";
import {axiosAmadeus, getToken} from "../services/AmadeusAPIService";
import {DestinationActivities} from "../components/DestinationActivities";
import FlightListFilters from "../components/FlightListFilters";
import {Flight} from "../components/FlightCard";
import SearchRecos, {SearchReco} from "../components/SearchRecos";
import FlightDestinationRecos from "../components/FlightDestinationRecos";
import {
    checkIfExpired,
    getAmadeusTokenFromStorage,
    removeAmadeusTokenFromStorage,
    saveAmadeusTokenToStorage,
    Token
} from "../utils/Utils";
import axios from "axios";

function Home() {
    const [searchResults, setSearchResults] = useState<FlightSearchData>();
    const userArea = "MAD";
    const [originReco, setOriginReco] = useState<string>(userArea);
    const [destinationReco, setDestinationReco] = useState<string>();
    const [flightList, setFlightList] = useState<Flight[]>([]);

    const [amadeusToken, setAmadeusToken] = useState<Token | undefined>(undefined)

    const handleFlightSearch = (searchData: FlightSearchData) => {
        setSearchResults(searchData);
        setFlightList(searchData.flightList);
        console.log((searchData.flightList))
    }
    const handleSelectedDestReco = (destination: string, originIata: string) => {
        setOriginReco(userArea)
        setDestinationReco(destination);
    }

    const handleSelectedSearchReco = (searchReco: SearchReco) => {
        setOriginReco(searchReco.origin);
        setDestinationReco(searchReco.destination);
    }

    const setFilters = (filteredFlightList: Flight[]) => {
        setFlightList(filteredFlightList);
    }

    useEffect(() => {
        if (!amadeusToken) {
            let tokenObject = getAmadeusTokenFromStorage();
            if(tokenObject) {
                setAmadeusToken(tokenObject);
                axiosAmadeus.defaults.headers.common.Authorization = "Bearer " + tokenObject.token;
            }
            else {
                console.log("token expired")
                getToken().then(tokenObject => {
                    if (tokenObject) {
                        console.log(tokenObject)
                        setAmadeusToken(tokenObject)
                        axiosAmadeus.defaults.headers.common.Authorization = "Bearer " + tokenObject.token
                        saveAmadeusTokenToStorage(tokenObject);
                    }
                }).catch((e)=> console.log(e));
            }
        }
        else if (checkIfExpired(amadeusToken)){
            removeAmadeusTokenFromStorage();
            setAmadeusToken(undefined);
        }
    }, [amadeusToken]);

    return (
        <div className="d-flex w-100 flex-column gap-3 align-items-center">
            {(amadeusToken?.token && amadeusToken?.token.length > 0) ? <>
                <div className={"d-flex w-75 mt-3 gap-2 justify-content-center align-content-center"}>
                  {/*  <FlightDestinationRecos originIata={userArea} date={"2017-01"}
                                            onRecoSelect={handleSelectedDestReco}/>*/}
                    <SearchRecos onSearchRecoSelect={handleSelectedSearchReco}/>
                </div>
                <FlightSearch onSearch={handleFlightSearch} originiataCode={originReco}
                              destinationiataCode={destinationReco ? destinationReco : ''}/>
                {(searchResults ? <>
                    <SearchInfoHeader {...searchResults.searchInfo}/>
                    {/* <FlightListFilters flightList={searchResults.flightList} dictionaries={searchResults.dictionaries}
                                   filter={setFilters}/>*/}
                    <div className={"w-100 d-flex flex-row"}>
                        <div className={"w-100 d-flex justify-content-evenly gap-2 p-1"}>
                            <div className={"w-25"}></div>
                            {(flightList?.length > 0 ?
                                <FlightList flightList={flightList}
                                            dictionaries={searchResults.dictionaries}/> : <></>)}
                            <div className={"w-25"}>
                                {/*  <DestinationActivities dest={searchResults.searchInfo.destination.iataCode}/>*/}
                            </div>
                        </div>
                    </div>
                </> : <></>)
                }
            </> : <></>}
        </div>
    );
}

export default Home;