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

function Home({loginStatus}: { loginStatus: boolean }) {
    const [searchResults, setSearchResults] = useState<FlightSearchData>();
    const userArea = "MAD";
    const [originReco, setOriginReco] = useState<string>(userArea);
    const [destinationReco, setDestinationReco] = useState<string>();
    const [amadeusToken, setAmadeustoken] = useState<string>('');
    const [flightList, setFlightList] = useState<Flight[]>([]);

    const handleFlightSearch = (searchData: FlightSearchData) => {
        setSearchResults(searchData);
        setFlightList(searchData.flightList);
        console.log(searchData)
    }
    const handleSelectedDestReco = (destination: string, originIata: string) => {
        setOriginReco(userArea)
        setDestinationReco(destination);
    }

    const handleSelectedSearchReco = (searchReco: SearchReco) => {
        setOriginReco(searchReco.origin);
        setDestinationReco(searchReco.destination);
        console.log(searchReco)
    }

    const setFilters = (filteredFlightList: Flight[]) => {
        setFlightList(filteredFlightList);
    }

    useEffect(() => {
        if (!amadeusToken) {
            getToken().then(r => {
                axiosAmadeus.defaults.headers.common['Authorization'] = "Bearer " + r.data.token;
                setAmadeustoken(r.data.token);
            });
        }
        console.log(amadeusToken)
    }, [amadeusToken]);

    return (
        <div className="d-flex w-100 flex-column gap-3 align-items-center">
            {amadeusToken?.length > 0 &&
                <div className={"d-flex w-75 mt-3 gap-2 justify-content-center align-content-center"}>
                    <FlightDestinationRecos originIata={userArea} date={"2017-01"}
                                            onRecoSelect={handleSelectedDestReco}/>
                    <SearchRecos onSearchRecoSelect={handleSelectedSearchReco}/>
                </div>}
            {amadeusToken?.length > 0 && <FlightSearch onSearch={handleFlightSearch} originiataCode={originReco}
                                                       destinationiataCode={destinationReco ? destinationReco : ''}/>}
            {(searchResults ? <>
                <SearchInfoHeader {...searchResults.searchInfo}/>
                {/*<FlightListFilters flightList={searchResults.flightList} dictionaries={searchResults.dictionaries}
                                   filter={setFilters}/>*/}
                <div className={"w-100 d-flex flex-row"}>
                    <div className={"w-100 d-flex justify-content-center gap-2"}>
                        {/*<FlightDestinationRecos flights={recommendations}/>*/}
                        {(flightList?.length > 0 ?
                            <FlightList flightList={flightList}
                                        dictionaries={searchResults.dictionaries}/> : <></>)}
                        {/*<DestinationActivities dest={searchResults.searchInfo.destination.iataCode}/>*/}
                    </div>
                </div>
            </> : <></>)
            }
        </div>
    );
}

export default Home;