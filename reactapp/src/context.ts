import { createContext } from "react";
import { Dictionaries } from "./components/flight/FlightCard";

export interface UserData {
    username: string;
    city: string;
    country: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    postalCode: string;
}

export const AuthContext = createContext<UserData | undefined>(undefined);
export const userArea = createContext<string>("MUC");
export const DictionariesContext = createContext<Dictionaries | undefined>(undefined);
