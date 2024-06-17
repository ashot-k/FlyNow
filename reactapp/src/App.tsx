import './static/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import {NavBar} from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import {AuthContext} from "./context";
import {useUserToken} from "./hooks/useUserToken";
import Footer from "./components/Footer";
import './static/animations.css'
import { faB, faCheckSquare, faCoffee, faDatabase, faHouseLaptop, faS, faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import {library} from "@fortawesome/fontawesome-svg-core";
library.add(faB, faS, faHouseLaptop, faCheckSquare, faCoffee, faDatabase, faWindowMaximize)

interface AppProps {
    className?: string
}

export default function App({className}: AppProps) {
    const user = useUserToken();

    return (
        <AuthContext.Provider value={user}>
            <BrowserRouter>
                <div className={className}>
                    <NavBar/>
                    <main className={"flex flex-col flex-grow w-full items-center bg-home-page-background bg-no-repeat bg-fixed bg-cover "}>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            {!user?.username && <Route path="/login" element={<Login/>}/>}
                            {!user?.username && <Route path="/register" element={<Register/>}/>}
                            {user?.username && <Route path="/profile" element={<UserProfile/>}/>}
                        </Routes>
                    </main>
                    <Footer className={"w-full mt-25 px-4 flex flex-col justify-end items-center from-flyNow-main to-flyNow-component bg-gradient-to-b h-16"}/>
                </div>
            </BrowserRouter>

        </AuthContext.Provider>
    );
}