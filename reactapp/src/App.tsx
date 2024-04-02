import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import Button from 'react-bootstrap/Button'
import pendingIcon from './static/bouncing-circles.svg'
import pendingSearchIcon from './static/infinite-spinner.svg'
import Select from "react-select";
import Flag from "react-flagkit";


function App() {
    const lodash = require('lodash');

    const [token, setToken] = useState(null);
    const [pendingSearch, setPendingSearch] = useState(false);
    const [pendingDestSearch, setPendingDestSearch] = useState(false);
    const [flightList, setFlightList] = useState<any[]>();
    const [departureDate, setDepartureDate] = useState<string>();

    const [originOptions, setOriginOptions] = useState<any[]>();
    const [origin, setOrigin] = useState<string>();
    const [destinationOptions, setDestinationOptions] = useState<any[]>();
    const [destination, setDestination] = useState<string>();

    useEffect(() => {
        axios.get("http://192.168.1.64:8080/amadeus/token").then(response => {
            setToken(response.data);
            axios.defaults.headers.common['Authorization'] = "Bearer " + response.data;
            console.log(response.data)
        });
    }, []);

    useEffect(() => {
        destinationOptionsSearch()
    }, [departureDate, origin]);

    useEffect(() => {

    }, []);
    const handleClick = () => {
        console.log(origin);
        console.log(destination);
        console.log(departureDate)
        setPendingSearch(true);
        axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers",
            {
                params: {
                    originLocationCode: origin,
                    destinationLocationCode: destination,
                    departureDate: departureDate,
                    adults: 1
                }
            }).then((response => {
            setFlightList(response.data.data);
            setPendingSearch(false);
            console.log(response.data)
        }));
    }

    const airportData = require('airport-data-js');
    const countries = require('countries-list');
    const pendingImg = <img src={pendingIcon} width={"42px"} height={"42px"} alt={""}/>;

    const originOptionsSearch = lodash.debounce((inputValue: string, token: string) => {
        var options: any[] = [];
        axios.get("https://test.api.amadeus.com/v1/reference-data/locations", {
            params: {
                subType: "CITY",
                keyword: inputValue
            }
        }).then(response => {
            response.data.data.map((option: any, index: number) => options.push(
                {
                    value: index,
                    label: option.name + " (" + option.iataCode + "), " + option.address.countryName,
                    cityName: option.address.cityName,
                    countryCode: option.address.countryCode,
                    iataCode: option.iataCode
                }))
            setOriginOptions(options)
        });
    }, 300);
    const destinationOptionsSearch = () => {
        var options: any[] = [];
        if (origin && departureDate) {
            setPendingDestSearch(true)
            axios.get("https://test.api.amadeus.com/v1/shopping/flight-destinations", {
                params: {
                    origin: origin,
                    oneWay: false,
                    nonStop: false,
                    departureDate: departureDate
                }
            }).then(response => {
                console.log(response.data)
                response.data.data.map((destinationInfo: any, index: number) => {
                    airportData.getAirportByIata(destinationInfo.destination).then((r: any) => {
                        const responseData = r[0];
                        let countryName: string;
                        if (countries.countries[responseData.country_code])
                            countryName = countries.countries[responseData.country_code].name;
                        else
                            countryName = responseData.country_code
                        options.push(
                            {
                                value: index,
                                countryCode: responseData.country_code,
                                label: responseData.city.toUpperCase() + " (" + responseData.iata + "), " + countryName.toUpperCase(),
                                cityName: responseData.city,
                                iataCode: responseData.iata
                            });
                    })
                });
            }).then(() => setPendingDestSearch(false))
                .catch(() => setPendingDestSearch(false))
        }
        setDestinationOptions(options)
    }

    return (
        <div className="App d-flex flex-column gap-3 align-items-center">
            <div className={"w-100 d-flex flex-column gap-3 align-items-center"}>
                <label>Departure Date
                    <input className={"form-control"} type={"date"} min={new Date().toISOString().substring(0, 10)}
                           onChange={(e) => setDepartureDate(e.target.value)}>
                    </input>
                </label>
                <div className={"w-50"}>
                    Origin<Select options={originOptions}
                                  onChange={(option) => setOrigin(option.iataCode)}
                                  onInputChange={(inputValue) => {
                                      if (inputValue.length > 3) {
                                          originOptionsSearch(inputValue, token);
                                      }
                                  }}
                                  components={{
                                      Option: ({innerProps, label, data}) => (
                                          <div className={"options"} {...innerProps}>
                                              <span>{label}</span> <Flag country={data.countryCode}/>
                                          </div>
                                      ),
                                  }}
                /></div>
                {!pendingDestSearch ? <div className={"w-50"}>
                    Destination<Select options={destinationOptions}
                                       onChange={(option) => setDestination(option.iataCode)}
                                       onInputChange={(inputValue) => {
                                           if (inputValue.length > 3) {

                                           }
                                       }}
                                       components={{
                                           Option: ({innerProps, label, data}) => (
                                               <div className={"options"} {...innerProps}>
                                                   <span>{label}</span> <Flag country={data.countryCode}/>
                                               </div>)
                                       }}
                /></div> : pendingImg}
            </div>
            {departureDate && pendingSearch ?  <></> : <Button variant="primary" onClick={handleClick}>Search</Button>}
            <div className={"d-flex flex-wrap gap-2 justify-content-center w-100 flight-list"}>
                {pendingSearch ?  <img src={pendingSearchIcon} width={"250px"} height={"250px"} alt={""}/>  : (flightList ? (flightList.length > 0 &&
                    flightList.map((flight, index: number) => {
                    return <div key={index} className={"card"}>
                        <div className={"card-body"}>
                            <div className={"card-title"}>{origin} - {destination}</div>
                            <div className={"card-text"}></div>
                            {flight.itineraries[0].segments.map((segment : any) => <div>From {segment.departure.iataCode} to {segment.arrival.iataCode}</div>)}
                        </div>
                    </div>
                })) : <></>)
                }
            </div>
        </div>
    );
}

export default App;
