import airportData from "./airports.json";
import axios from "axios";

export interface Token {
    expiration: number,
    issued_at: string,
    token: string
}

export function removeAmadeusTokenFromStorage() {
    localStorage.removeItem("amadeus_token");
    localStorage.removeItem("amadeus_token_expiration");
    localStorage.removeItem("amadeus_token_issuedAt");
}

export function getAmadeusTokenFromStorage(): Token | undefined {
    let token = localStorage.getItem("amadeus_token");
    let expiration = localStorage.getItem("amadeus_token_expiration");
    let issuedAt = localStorage.getItem("amadeus_token_issuedAt");
    if (token && expiration && issuedAt)
        return {token: token, expiration: Number.parseInt(expiration), issued_at: issuedAt}
    return undefined
}

export function saveAmadeusTokenToStorage(tokenObject: Token){
    if(tokenObject){
        localStorage.setItem("amadeus_token", tokenObject.token);
        localStorage.setItem("amadeus_token_expiration", tokenObject.expiration.toString());
        localStorage.setItem("amadeus_token_issuedAt", tokenObject.issued_at);
    }
}
export function getFlyNowTokenFromStorage(): Token | undefined{
    let token = localStorage.getItem("flynow_token");
    let expiration = localStorage.getItem("flynow_token_expiration");
    let issuedAt = localStorage.getItem("flynow_token_issuedAt");
    if (token && expiration && issuedAt)
        return {token: token, expiration: Number.parseInt(expiration), issued_at: issuedAt}
    return undefined
}

export function saveFlyNowTokenToStorage(tokenObject: Token){
    if(tokenObject){
        localStorage.setItem("flynow_token", "Bearer " + tokenObject.token);
        localStorage.setItem("flynow_token_expiration", tokenObject.expiration.toString());
        localStorage.setItem("flynow_token_issuedAt", tokenObject.issued_at);
    }
}

export function removeFlyNowTokenFromStorage(){
    localStorage.removeItem("flynow_token");
    localStorage.removeItem("flynow_token_expiration");
    localStorage.removeItem("flynow_token_issuedAt");
}

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
        color: 'white',
        zIndex: '5'
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

export function capitalize(str: string | undefined) {
    if(!str) return;
    let capitalizedString = "";
    const words = str.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (words[i]?.trim()) {
            if(words[i].length > 2)
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
            else
                words[i] = words[i].toLowerCase();
            capitalizedString += words[i]
            if(!(i === words.length - 1)){
                capitalizedString += " ";
            }

        }
    }
    return capitalizedString;
}

export const checkIfExpired = (jwt: Token) => {
    const issuedAt = new Date(jwt.issued_at);
    const expirationTime = new Date(issuedAt).getTime() + jwt.expiration * 1000;
    const currentTime = new Date().getTime();
    return currentTime >= expirationTime
}

export function getAirportByIATA(iataCode: string) {
    return airportData.filter((airport) => airport.iata === iataCode)[0]
}

export function getAirportByCityName(cityName: string) {
    return airportData.filter((airport) => airport.city.toLowerCase() === cityName.toLowerCase())[0]
}

export function getUserLocation() {
    return axios.get('http://ip-api.com/json');
}

export var Months = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
export var Days = ['Sunday', 'Monday', 'Tuesday',
    'Wednesday', 'Thursday', 'Friday', 'Saturday'];


export function flightDateToStringFull(date: string) {
    const str = new Date(date);
    return Days[str.getDay()] + ", " + str.getDate() + " " + Months[str.getMonth()] + " " + str.getFullYear() + " " + addZero(str.getHours()) + ":" + addZero(str.getMinutes()) + " UTC";
}

export function flightDateToStringNoYear(date: string) {
    const str = new Date(date);
    return Days[str.getDay()] + ", " + str.getDate() + " " + Months[str.getMonth()] + " " + addZero(str.getHours()) + ":" + addZero(str.getMinutes()) + " UTC";
}
export function flightDateToStringNoYearNoDay(date: string) {
    const str = new Date(date);
    return str.getDate() + " " + Months[str.getMonth()] + " " + addZero(str.getHours()) + ":" + addZero(str.getMinutes()) + " UTC";
}

export function flightDateToStringShort(date: string) {
    const str = new Date(date);
    return Days[str.getDay()] + ", " + str.getDate() + " " + Months[str.getMonth()];
}

export function flightDateToStringTime(date: string) {
    const str = new Date(date);
    return addZero(str.getHours()) + ":" + addZero(str.getMinutes()) + " UTC";
}

export function calculateStops(segments: any[]) {
    let stops = 0;
    segments.forEach(segment => stops += segment.numberOfStops);
    return stops
}

export function addZero(i: string | number) {
    if (i < 10) {
        i = "0" + i
    }
    return i;
}