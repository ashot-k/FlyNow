import airportData from "../dev-data/mock_json/airports.json";
import axios from "axios";

export function devMode(): boolean {
    return process.env.REACT_APP_DEV_MODE === "true";
}
export function detectMob() {
    return window.innerWidth <= 800 || window.innerHeight <= 700;
}
export const userArea = "MUC";
export function normalizeDate(d: Date) {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
}
export function capitalize(str: string | undefined) {
    if (!str) return;
    let capitalizedString = "";
    const words = str.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (words[i]?.trim()) {
            if (words[i].length > 2) words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
            else words[i] = words[i].toLowerCase();
            capitalizedString += words[i];
            if (!(i === words.length - 1)) {
                capitalizedString += " ";
            }
        }
    }
    return capitalizedString;
}

export function getAirportByIATA(iataCode: string) {
    return airportData.filter((airport) => airport.iata === iataCode)[0];
}

export function getAirportByCityName(cityName: string) {
    return airportData.filter((airport) => airport.city.toLowerCase() === cityName.toLowerCase())[0];
}

export function getUserLocation() {
    return axios.get("http://ip-api.com/json");
}

export function calculateStops(segments: any[]) {
    let stops = 0;
    segments.forEach((segment) => (stops += segment.numberOfStops));
    return stops;
}

export function addZero(i: string | number) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

export function inverse(obj: any) {
    let retobj: any = {};
    for (let key in obj) {
        retobj[obj[key]] = key;
    }
    return retobj;
}
