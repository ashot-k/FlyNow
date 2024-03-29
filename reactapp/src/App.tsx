import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import Button from 'react-bootstrap/Button'
import pendingIcon from './bouncing-circles.svg'

function App() {
    const [token, setToken] = useState(null);
    const [flightList, setFlightList] = useState<any[]>();
    const [departureDate, setDepartureDate] = useState<string>();
    const [pendingSearch, setPendingSearch] = useState(false);
    useEffect(() => {
        axios.get("http://localhost:8080/amadeus/token").then(response => {
            setToken(response.data);
        });
    }, []);

    const handleClick = () => {
        setPendingSearch(true)
        axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers",
            {
                headers: {Authorization: 'Bearer ' + token}, params: {
                    originLocationCode: "SYD",
                    destinationLocationCode: "BKK",
                    departureDate: departureDate,
                    adults: 1
                }
            })
            .then((response => {
                setFlightList(response.data.data);
                setPendingSearch(false);
            }));
    }
    return (
        <div className="App">
            <input type={"date"} min = {new Date().toISOString().substring(0,10)} onChange={(event)=> setDepartureDate(event.target.value)}></input>
            {departureDate && !pendingSearch && <Button variant="primary" onClick={handleClick}>Search</Button>}
            {pendingSearch &&  <img src={pendingIcon} width={"42px"} height={"42px"} alt={""}></img>}
            {flightList && flightList.length > 0 && flightList.map(flight => {
                return <div>
                    <div>From {flight.source} {flight.price.total} {flight.price.currency}</div>
                </div>
            })}
        </div>
    );
}

export default App;
