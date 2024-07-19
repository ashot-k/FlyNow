import axios from "axios";
import { FLY_NOW_URL_BASE, FLY_NOW_URLs } from "../utils/Links";
import { getFlyNowTokenFromStorage, saveFlyNowTokenToStorage, Token } from "../utils/Token";

interface Credentials {
    username: string;
    password: string;
}

interface registrationFormInfo {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    postalCode: string;
    city: string;
    country: string;
}

export const axiosFlyNow = axios.create({
    baseURL: FLY_NOW_URL_BASE,
});

axiosFlyNow.interceptors.request.use(
    async function (config) {
        if (config.url && FLY_NOW_URLs.NO_AUTH_ENDPOINTS.includes(config?.url)) {
            config.headers.Authorization = "";
            return config;
        } else {
            config.headers.Authorization = getFlyNowTokenFromStorage()?.token;
            return config;
        }
    },
    function (error) {
        return Promise.reject(error);
    },
);

axiosFlyNow.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (!FLY_NOW_URLs.NO_AUTH_ENDPOINTS.includes(error.config.baseURL + error.config.url))
            if (error.response.status === 401 || error.response.status === 403) {
                //   window.location.href = "/login"
            }
        return Promise.reject(error.response);
    },
);
export const register = async (registrationInfo: registrationFormInfo) => {
    const r = await axiosFlyNow.post(FLY_NOW_URLs.REGISTER, {
        ...registrationInfo,
    });
    return r.status === 200
        ? {
              username: registrationInfo.username,
              message: "Successfully created user: " + registrationInfo.username,
          }
        : r.data;
};

export const login = async (userDetails: Credentials) => {
    const r = await axiosFlyNow.post(FLY_NOW_URLs.LOGIN, {
        username: userDetails.username,
        password: userDetails.password,
    });
    saveFlyNowTokenToStorage(r.data);
    return r.status === 200;
};

export const refresh = async (token: Token) => {
    if (!token) return;
    const r = await axiosFlyNow.post(FLY_NOW_URLs.REFRESH, {
        token: token,
    });
    saveFlyNowTokenToStorage(r.data);
    return r.status === 200;
};

export async function getUserInfo() {
    try {
        return await axiosFlyNow.get(FLY_NOW_URLs.USER_INFO);
    } catch (e) {
        return console.log(e);
    }
}

export function book() {
    axiosFlyNow.post("/flight/book", {}).catch((e) => console.log(e));
}

export function logSearchTerms(origin: string, destination: string) {
    axiosFlyNow
        .post(FLY_NOW_URLs.SEARCH_ANALYTICS, {
            origin: origin,
            destination: destination,
        })
        .catch((e) => console.log(e));
}

export function logBookingInfo() {
    axiosFlyNow.post(FLY_NOW_URLs.BOOKING_ANALYTICS).catch((e) => console.log(e));
}

export function getSearchTerms() {
    return axiosFlyNow.get(FLY_NOW_URLs.SEARCH_ANALYTICS);
}
