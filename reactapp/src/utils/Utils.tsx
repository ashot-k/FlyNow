import airportData from "./airports.json";
import airportData2 from "./airports2.json";
import axios from "axios";

export const customStyles = {
    control: (provided: any) => ({
        ...provided,
        background: 'transparent',
        display: 'flex',
        flexWrap: 'nowrap',
        color: 'white',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#04D7FF'
        },
        borderColor: 'white'
    }),
    menu: (provided: any) => ({
        ...provided,
        paddingTop: '8px', /* Add top padding to create a gap */
        paddingBottom: '8px',
        background: '#36373A',
        color: 'white'
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'white'
    }),
    input: (provided: any) => ({
        ...provided,
        color: 'white'
    })
};
export function capitalize(word: string | undefined) {
    if(word)
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function getAirportByIATA(iataCode: string) {
    let airport = airportData.filter((airport) => airport.iata === iataCode)[0]
        return airport
}
export function getAirportByCityName(cityName: string) {
    let airport = airportData.filter((airport) => airport.city.toLowerCase() === cityName.toLowerCase())[0]
    return airport
}
export function getUserLocation(){
   return axios.get('http://ip-api.com/json');
}

export var Months = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
export var Days = ['Sunday', 'Monday', 'Tuesday',
    'Wednesday', 'Thursday', 'Friday', 'Saturday'];


export function flightDateToStringFull(date: string) {
    var str = new Date(date);
    return Days[str.getDay()] + ", "+ str.getDate() + " " + Months[str.getMonth()] + " " + str.getFullYear() + " " + addZero(str.getHours()) + ":" + addZero(str.getMinutes());
}
export function flightDateToStringNoYear(date: string) {
    var str = new Date(date);
    return Days[str.getDay()] + ", "+ str.getDate() + " " + Months[str.getMonth()] + " " + addZero(str.getHours()) + ":" + addZero(str.getMinutes());
}

export function flightDateToStringShort(date: string) {
    var str = new Date(date);
    return Days[str.getDay()] + ", "+ str.getDate() + " " + Months[str.getMonth()];
}
export function flightDateToStringTime(date: string) {
    var str = new Date(date);
    return addZero(str.getHours()) + ":" + addZero(str.getMinutes());
}

export function calculateStops(segments: any[]){
    let stops = 0;
   segments.forEach(segment => stops += segment.numberOfStops);
    return stops
}

function addZero(i: string | number) {
    if (i < 10) {i = "0" + i}
    return i;
}