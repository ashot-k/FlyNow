import React, {useEffect, useState} from 'react';
import './static/App.css';
import './static/NavBar.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import {NavBar} from "./components/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import { jwtDecode } from "jwt-decode";

function App() {
    const [jwtToken, setJwtToken] = useState<string>('')
    const [username, setUsername] = useState<string>('')

    useEffect(() => {
        let jwtCookie = localStorage.getItem("FlyNowToken");
        if(jwtCookie && jwtCookie.length > 0)
           handleLogin(jwtCookie);
    }, []);

    const handleLogin = (jwt: string) =>{
        const decoded = jwtDecode(jwt);
        if(decoded.sub)
            setUsername(decoded.sub);
        setJwtToken(jwt);
    }
    return (
        <BrowserRouter>
            <NavBar username={username.trim().length > 0 ? username : false}/>
            <div className={"App w-100 justify-content-center d-flex"} data-bs-theme="dark">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;