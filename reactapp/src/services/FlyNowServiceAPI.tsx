import axios from "axios";
import {saveFlyNowTokenToStorage, Token} from "../utils/Utils";

export interface Credentials {
    username: string
    password: string
}
export const axiosFlyNow = axios.create({
    baseURL: "http://" + process.env.REACT_APP_FLY_NOW_INSTANCE_IP + ":" + process.env.REACT_APP_FLY_NOW_INSTANCE_PORT + "/api"
});

export const register = async (userDetails: Credentials) => {
    const r = await axiosFlyNow.post("/auth/register", {
        username: userDetails.username,
        password: userDetails.password
    }, {headers: {Authorization: ""}});
    return (r.status === 200) ? ({
        username: userDetails.username,
        message: "Successfully created user: " + userDetails.username
    }) : r.data;
}

export const login = async (userDetails: Credentials) => {
    const r = await axiosFlyNow.post("/auth/login", {
        username: userDetails.username,
        password: userDetails.password
    }, {headers: {Authorization: ""}});
    saveFlyNowTokenToStorage(r.data)
    return r.status === 200
}

export const refresh = async (token: Token) => {
    if (!token)
        return;
    const r = await axiosFlyNow.post("/auth/refresh", {
        token: token,
    }, {headers: {Authorization: ""}});
    saveFlyNowTokenToStorage(r.data)
    return r.status === 200
}

export function logSearchTerms(origin: string, destination: string) {
    axiosFlyNow.post("/analytics/search-analytics", {
        origin: origin,
        destination: destination
    }).catch(e => console.log(e))
}

export function logBookingInfo() {
    axiosFlyNow.post("/analytics/booking-analytics").catch(e => console.log(e))
}

export function getSearchTerms() {
    return axiosFlyNow.get("/analytics/search-analytics");
}
