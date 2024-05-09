import React, {useEffect, useState} from 'react';
import './static/App.css';
import './static/NavBar.css'
import axios from "axios";
import pendingSearchIcon from './static/infinite-spinner.svg'
import {NavBar} from "./components/NavBar";
import {FlightList} from "./components/FlightList";
import {getToken} from "./services/AmadeusAPIService";
import {FlightSearch} from "./components/FlightSearch";

function App() {
    const [token, setToken] = useState(undefined);
    const [tokenExpiration, setTokenExpiration] = useState<number>();

    const [searchResults, setSearchResults] = useState<any>();

    const [flightList, setFlightList] = useState<any[]>([]);
    const [dictionaries, setDictionaries] = useState<any[]>([]);

    useEffect(() => {
        if (!token)
            getToken().then(response => {
                setToken(response.data.token);
                setTokenExpiration(response.data.expiration);
                axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.token;
            }).catch((e) => console.log(e));
    }, []);

    const handleFlightSearch = (searchData: any) => {
        setSearchResults(searchData);
        setFlightList(searchData.flightList)
        setDictionaries(searchData.dictionaries)
    }
    useEffect(() => {
        if(searchResults){
            console.log(searchResults)
        }
    }, [searchResults]);

    return (
        <div className="App d-flex flex-column gap-3 align-items-center" data-bs-theme="dark">
            <NavBar id={'navBar'} token={token} tokenExp={tokenExpiration}/>
            {/*<UserLocationRecos/>*/}
            <FlightSearch onSearch={handleFlightSearch}/>
            {/*{destRecos && destRecos?.length > 0 && <FlightDestinationRecos iataCodes={destRecos.map((reco) => reco.destination)}/>}*/}
            <div className={"w-100 d-flex flex-row"}>
                <div className={"w-100 d-flex justify-content-center align-items-center"}>
                    {/*<FlightDestinationRecos flights={recommendations}/>*/}
                  {/*  {pendingFlightSearch ? <img src={pendingSearchIcon} width={"50%"} height={"50%"}
                                                alt={""}/> : (searchResults ? (searchResults.flightList.length > 0 &&
                        <FlightList flightList={flightList} departureDate={searchResults.departureDate} returnDate={searchResultsreturnDate}
                                    dictionaries={dictionaries}
                                    origin={origin}
                                    destination={destination}/>) : <></>)}*/}
                {(searchResults ? (searchResults.flightList?.length > 0 &&
                        <FlightList flightList={searchResults.flightList} departureDate={searchResults.departureDate} returnDate={searchResults.returnDate}
                                    dictionaries={searchResults.dictionaries}
                                    origin={searchResults.origin}
                                    destination={searchResults.destination}/>) : <></>)}
                </div>
            </div>
        </div>
    );
}

export default App;