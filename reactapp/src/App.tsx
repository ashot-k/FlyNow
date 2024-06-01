import React, {useEffect, useState} from 'react';
import './static/App.css';
import './static/NavBar.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import {NavBar} from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {jwtDecode} from "jwt-decode";
import UserProfile from "./pages/UserProfile";
import {
    checkIfExpired,
    getFlyNowTokenFromStorage, removeFlyNowTokenFromStorage, Token
} from "./utils/Utils";
import {axiosFlyNow} from "./services/FlyNowServiceAPI";
import {AuthContext, UserData} from "./context";
import ScrollToTop from "./utils/ScrollToTop";


function App() {
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

    return (
        <AuthContext.Provider value={user}>
        <BrowserRouter>
            <ScrollToTop/>
            <div data-bs-theme="dark">
            <NavBar/>
            <div className={"App w-100 justify-content-center d-flex"}>
                <Routes>
                        <Route path="/" element={<Home/>}/>
                        {!flyNowToken && <Route path="/login" element={<Login/>}/>}
                        {!flyNowToken && <Route path="/register" element={<Register/>}/>}
                        {flyNowToken && <Route path="/profile" element={<UserProfile/>}/>}

                </Routes>
            </div>
            </div>
        </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;