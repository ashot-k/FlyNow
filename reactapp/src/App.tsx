import React, {useEffect, useState} from 'react';
import './static/App.css';
import './static/NavBar.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import TopDestinations from "./pages/TopDestinations";
import {NavBar} from "./components/NavBar";
import {getToken} from "./services/AmadeusAPIService";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {

    const [token, setToken] = useState(undefined);
    const [tokenExpiration, setTokenExpiration] = useState<number>();
    const [username, setUsername] = useState<string>('')
    useEffect(() => {
        if (!token)
            getToken().then(response => {
                setToken(response.data.token);
                setTokenExpiration(response.data.expiration);
                axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.token;
            }).catch((e) => console.log(e));
    }, []);

    const handleLogin = (username: string) =>{
        console.log(username);
        setUsername(username);
    }
    return (
        <BrowserRouter>
            <NavBar token={token} tokenExp={tokenExpiration} username={username.trim().length > 0 ? username : false}/>
            <div className={"App w-100 justify-content-center d-flex"} data-bs-theme="dark">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="top-destinations" element={<TopDestinations/>}/>
                    <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;