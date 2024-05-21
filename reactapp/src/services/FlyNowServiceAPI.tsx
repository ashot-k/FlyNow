import axios from "axios";

export interface Credentials {
    username: string
    password: string
}




const axiosFlyNow = axios.create({
    baseURL: "http://192.168.1.64:8079/api",
});

if(localStorage.getItem("token"))
    axiosFlyNow.defaults.headers.common['Authorization'] = localStorage.getItem("token");

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
    localStorage.setItem("token", "Bearer " + r.data.token);
    localStorage.setItem("token_exp", r.data.expiration);

    return (r.status === 200) ? ({
        token: r.data.token,
        message: "Successfully logged in as: " + userDetails.username
    }) : r.data;
}
export const refresh = async (token: string, expiration: number) => {
    const r = await axiosFlyNow.post("/auth/refresh", {
        token: token,
    });
    localStorage.setItem("token", "Bearer " + r.data.token)
    localStorage.setItem("token_exp", r.data.expiration)
    return (r.status === 200) ? ({
        token: r.data.token
    }) : r.data;
}

export function logSearchTerms(origin: string, destination: string){
    console.log(origin + " " + destination)
    axiosFlyNow.post("/analytics/search-analytics", {origin: origin, destination: destination}).catch(e => console.log(e))
}
export function logBookingInfo(){
    axiosFlyNow.post("/analytics/")
}

export function getSearchTerms(){
   return axiosFlyNow.get("/analytics/search-analytics");
}