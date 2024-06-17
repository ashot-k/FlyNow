import axios from "axios";
import {
    getAmadeusTokenFromStorage,
    getFlyNowTokenFromStorage,
    saveAmadeusTokenToStorage,
    saveFlyNowTokenToStorage,
    Token
} from "../utils/Utils";
import config from "tailwindcss/defaultConfig";

export interface Credentials {
    username: string
    password: string
}
export const axiosFlyNow = axios.create({
    baseURL: "http://" + process.env.REACT_APP_FLY_NOW_INSTANCE_IP + ":" + process.env.REACT_APP_FLY_NOW_INSTANCE_PORT + "/api"
});

const noAuthUrls = [axiosFlyNow.defaults.baseURL + "/auth/register",
    axiosFlyNow.defaults.baseURL + "/auth/login",
    axiosFlyNow.defaults.baseURL + "/auth/refresh",
    axiosFlyNow.defaults.baseURL + "/auth/logout",
]

axiosFlyNow.interceptors.request.use(async function (config) {
    if (config.url === "http://3.74.56.55:8079/amadeus/token" || (config.url && noAuthUrls.includes(config?.url))) {
        config.headers.Authorization = "";
        return config;
    } else {
        config.headers.Authorization = getFlyNowTokenFromStorage()?.token;
        return config;
    }
}, function (error) {
    return Promise.reject(error);
});

axiosFlyNow.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;
    console.log(error.config)
    if(!noAuthUrls.includes(error.config.baseURL + error.config.url))
    if (error.response.status === 401 || error.response.status === 403) {
     //   window.location.href = "/login"
    }
    return Promise.reject(error.response);
});
export const register = async (userDetails: Credentials) => {
    const r = await axiosFlyNow.post("/auth/register", {
        username: userDetails.username,
        password: userDetails.password
    });
    return (r.status === 200) ? ({
        username: userDetails.username,
        message: "Successfully created user: " + userDetails.username
    }) : r.data;
}

export const login = async (userDetails: Credentials) => {
    const r = await axiosFlyNow.post("/auth/login", {
        username: userDetails.username,
        password: userDetails.password
    });
    saveFlyNowTokenToStorage(r.data);
    return r.status === 200;
}

export const refresh = async (token: Token) => {
    if (!token)
        return;
    const r = await axiosFlyNow.post("/auth/refresh", {
        token: token,
    });
    saveFlyNowTokenToStorage(r.data);
    return r.status === 200;
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
