import React, { useState} from "react";
import {FlightSearch, FlightSearchData} from "../components/FlightSearch";
import SearchInfoHeader from "../components/SearchInfoHeader";
import {FlightList} from "../components/FlightList";
import Login from "../components/Login";
import Register from "../components/Register";

function Home() {
    const [searchResults, setSearchResults] = useState<FlightSearchData>();


    const handleFlightSearch = (searchData: FlightSearchData) => {
        setSearchResults(searchData);
        console.log(searchData)
    }

    return (
    <div className="d-flex w-100 flex-column gap-3 align-items-center">
        {/*<UserLocationRecos/>*/}
        <FlightSearch onSearch={handleFlightSearch}/>
        {/*{destRecos && destRecos?.length > 0 && <FlightDestinationRecos iataCodes={destRecos.map((reco) => reco.destination)}/>}*/}
        {(searchResults ? <>
            <SearchInfoHeader {...searchResults.searchInfo}/>
            <div className={"w-100 d-flex flex-row"}>
                <div className={"w-100 d-flex justify-content-center align-items-center"}>
                    {/*<FlightDestinationRecos flights={recommendations}/>*/}
                    {searchResults.flightList?.length > 0 ?
                        <FlightList flightList={searchResults.flightList} dictionaries={searchResults.dictionaries}/> : <></>}
                </div>
            </div>
        </> : <></>)
        }
    </div>
);
}

export default Home;