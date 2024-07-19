import { addZero } from "./Utils";

export const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
export const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function flightDateToStringFull(dateString: string) {
    const date = new Date(dateString);
    return (
        Days[date.getDay()] +
        ", " +
        date.getDate() +
        " " +
        Months[date.getMonth()] +
        " " +
        date.getFullYear() +
        " " +
        addZero(date.getHours()) +
        ":" +
        addZero(date.getMinutes())
    ); // + " UTC";
}

export function compareDateHours(dateString1: string, dateString2: string) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    return date2.getHours() - date1.getHours() >= 0;
}

export function isSameDate(date1: Date, date2: Date) {
    return date1.toLocaleDateString().toString() === date2.toLocaleDateString().toString();
}

export function minutesToClock(mins: number) {
    let clock = "";
    const hours = Math.round(mins / 60);
    if (hours < 10) clock += "0";
    clock += hours.toString() + ":";
    const minutes = mins % 60;
    if (minutes < 10) clock += "0";
    clock += minutes;
    return clock;
}

export function dateDiffInHoursAndMins(dateString1: string, dateString2: string) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    let diff = (date2.getTime() - date1.getTime()) / 1000 / 60;
    let hours = Math.floor(diff / 60);
    let minutes = diff % 60;
    if (minutes <= 0) {
        return hours + "h";
    } else if (hours > 0) {
        return hours + "h " + minutes;
    } else {
        return minutes + "m";
    }
}

export function flightDateToStringNoYear(date: string) {
    const str = new Date(date);
    return (
        Days[str.getDay()] +
        ", " +
        str.getDate() +
        " " +
        Months[str.getMonth()] +
        " " +
        addZero(str.getHours()) +
        ":" +
        addZero(str.getMinutes())
    ); // + " UTC";
}

export function flightDateToStringNoYearNoDay(dateString: string) {
    const date = new Date(dateString);
    return (
        date.getDate() +
        " " +
        Months[date.getMonth()] +
        " " +
        addZero(date.getHours()) +
        ":" +
        addZero(date.getMinutes())
    ); // + " UTC";
}

export function flightDateToStringShort(dateString: string) {
    const date = new Date(dateString);
    return Days[date.getDay()] + ", " + date.getDate() + " " + Months[date.getMonth()];
}

export function flightDateToStringTime(dateString: string) {
    const date = new Date(dateString);
    return addZero(date.getHours()) + ":" + addZero(date.getMinutes()); //+ " UTC";
}
