import {useEffect, useState} from "react";
import {
    checkIfExpired,
    getAmadeusTokenFromStorage,
    removeAmadeusTokenFromStorage,
    saveAmadeusTokenToStorage, Token
} from "../utils/Utils";
import {axiosAmadeus, getToken} from "../services/AmadeusAPIService";

export default function useAmadeusToken() {
    const [amadeusToken, setAmadeusToken] = useState<Token | undefined>(undefined)

    useEffect(() => {
        if (!amadeusToken) {
            let tokenObject = getAmadeusTokenFromStorage();
            if (tokenObject) {
                setAmadeusToken(tokenObject);
                axiosAmadeus.defaults.headers.common.Authorization = "Bearer " + tokenObject.token;
            } else {
                console.log("token expired")
                getToken().then(tokenObject => {
                    if (tokenObject) {
                        console.log(tokenObject)
                        setAmadeusToken(tokenObject)
                        axiosAmadeus.defaults.headers.common.Authorization = "Bearer " + tokenObject.token
                        saveAmadeusTokenToStorage(tokenObject);
                    }
                }).catch((e) => console.log(e));
            }
        } else if (checkIfExpired(amadeusToken)) {
            removeAmadeusTokenFromStorage();
            setAmadeusToken(undefined);
        }
    }, [amadeusToken]);

    return amadeusToken;
}