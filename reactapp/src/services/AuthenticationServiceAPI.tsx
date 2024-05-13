import axios from "axios";

interface Credentials{
    username: string
    password: string
}
export const register = (userDetails: Credentials) => {
    return axios.post("http://192.168.1.64:8079/api/auth/register",{
        username: userDetails.username,
        password: userDetails.password
    }).then((r) => (r.status === 200) ?  {username: userDetails.username, message:" Successfully created user: " + userDetails.username} :  false)
}
export const login  = (userDetails: Credentials) => {
    return axios.post("http://192.168.1.64:8079/api/auth/login",{
        username: userDetails.username,
        password: userDetails.password
    }).then((r) => (r.status === 200) ?  {username: userDetails.username, message:" Successfully logged in as: " + userDetails.username} :  false)
}