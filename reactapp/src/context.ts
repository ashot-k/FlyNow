import {createContext} from "react";



export interface UserData {
   username: string;
   //
}

export const AuthContext = createContext<UserData | undefined>(undefined);
