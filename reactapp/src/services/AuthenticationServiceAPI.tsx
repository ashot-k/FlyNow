import axios from "axios";

export interface Credentials{
    username: string
    password: string
}
export const register = async (userDetails: Credentials) => {
    const r = await axios.post("http://192.168.1.64:8079/api/auth/register", {
        username: userDetails.username,
        password: userDetails.password
    });
    return (r.status === 200) ? ({
        username: userDetails.username,
        message: " Successfully created user: " + userDetails.username
    }) : r.data;
}
export const login  = async (userDetails: Credentials) => {
    const r = await axios.post("http://192.168.1.64:8079/api/auth/login", {
        username: userDetails.username,
        password: userDetails.password
    });
    return (r.status === 200) ? ({
        username: userDetails.username,
        message: "Successfully logged in as: " + userDetails.username
    }) : false;
}