import { useEffect, useState } from "react";
import { UserData } from "../context";
import { axiosFlyNow, getUserInfo } from "../services/FlyNowServiceAPI";
import { checkIfExpired, getFlyNowTokenFromStorage, removeFlyNowTokenFromStorage, Token } from "../utils/Token";

export function useUserToken() {
    const [flyNowToken, setFlyNowToken] = useState<Token | undefined>(undefined);
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
            getUserInfo().then((r) => {
                if (r && r.data) setUser(r.data);
            });
        }
    }, [flyNowToken]);
    return user;
}
