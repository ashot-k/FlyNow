import axios from "axios";
import { getFlyNowTokenFromStorage, saveFlyNowTokenToStorage, Token } from "../utils/Utils";

export interface Credentials {
  username: string;
  password: string;
}

export interface registrationFormInfo {
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
  baseURL: "http://" + process.env.REACT_APP_FLY_NOW_INSTANCE_IP + ":" + process.env.REACT_APP_FLY_NOW_INSTANCE_PORT + "/api",
});

const noAuthUrls = ["/auth/register", "/auth/login", "/auth/refresh", "/auth/logout", "/amadeus/token"];

axiosFlyNow.interceptors.request.use(
  async function (config) {
    if (config.url && noAuthUrls.includes(config?.url)) {
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
    if (!noAuthUrls.includes(error.config.baseURL + error.config.url))
      if (error.response.status === 401 || error.response.status === 403) {
        //   window.location.href = "/login"
      }
    return Promise.reject(error.response);
  },
);
export const register = async (registrationInfo: registrationFormInfo) => {
  const r = await axiosFlyNow.post("/auth/register", {
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
  const r = await axiosFlyNow.post("/auth/login", {
    username: userDetails.username,
    password: userDetails.password,
  });
  saveFlyNowTokenToStorage(r.data);
  return r.status === 200;
};

export const refresh = async (token: Token) => {
  if (!token) return;
  const r = await axiosFlyNow.post("/auth/refresh", {
    token: token,
  });
  saveFlyNowTokenToStorage(r.data);
  return r.status === 200;
};

export async function getUserInfo() {
  try {
    return await axiosFlyNow.get("/users");
  } catch (e) {
    return console.log(e);
  }
}

export function book() {
  axiosFlyNow.post("/flight/book", {}).catch((e) => console.log(e));
}

export function logSearchTerms(origin: string, destination: string) {
  axiosFlyNow
    .post("/analytics/search-analytics", {
      origin: origin,
      destination: destination,
    })
    .catch((e) => console.log(e));
}

export function logBookingInfo() {
  axiosFlyNow.post("/analytics/booking-analytics").catch((e) => console.log(e));
}

export function getSearchTerms() {
  return axiosFlyNow.get("/analytics/search-analytics");
}
