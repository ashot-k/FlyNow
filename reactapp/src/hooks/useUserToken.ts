import {useEffect, useState} from "react";
import {checkIfExpired, getFlyNowTokenFromStorage, removeFlyNowTokenFromStorage, Token} from "../utils/Utils";
import {UserData} from "../context";
import {axiosFlyNow} from "../services/FlyNowServiceAPI";
import {jwtDecode} from "jwt-decode";


export function useUserToken() {
    const [flyNowToken, setFlyNowToken] = useState<Token | undefined>(undefined)
    const [user, setUser] = useState<UserData | undefined>(undefined);

    useEffect(() => {
        if (!flyNowToken) {
            let tokenObject = getFlyNowTokenFromStorage();
            if (tokenObject) {
                setFlyNowToken(tokenObject);
                axiosFlyNow.defaults.headers.common.Authorization = tokenObject.token;
            }
        } else if (checkIfExpired(flyNowToken)) {
            removeFlyNowTokenFromStorage();
            setFlyNowToken(undefined);
        } else {
            const decoded = jwtDecode(flyNowToken.token)
            if (decoded.sub) {
                setUser({username: decoded.sub})
            }
        }
    }, [flyNowToken]);
    return user;
}