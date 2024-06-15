import {createContext} from "react";


export interface UserData {
    username: string;
    //
}

export const AuthContext = createContext<UserData | undefined>(undefined);
export const userArea = createContext<string>("MAD");
export const FlightListContext = createContext<any[] | undefined>(undefined);
