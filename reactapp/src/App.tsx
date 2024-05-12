import React, {useEffect, useState} from 'react';
import './static/App.css';
import './static/NavBar.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import TopDestinations from "./pages/TopDestinations";
import {NavBar} from "./components/NavBar";
import {getToken} from "./services/AmadeusAPIService";
import axios from "axios";

function App() {

    const [token, setToken] = useState(undefined);
    const [tokenExpiration, setTokenExpiration] = useState<number>();

    useEffect(() => {
        if (!token)
            getToken().then(response => {
                setToken(response.data.token);
                setTokenExpiration(response.data.expiration);
                axios.defaults.headers.common['Authorization'] = "Bearer " + response.data.token;
            }).catch((e) => console.log(e));
    }, []);

    return (
        <BrowserRouter>
            <NavBar token={token} tokenExp={tokenExpiration}/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="top-destinations" element={<TopDestinations/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;