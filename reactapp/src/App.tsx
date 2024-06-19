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
                    <NavBar className={"w-full fixed flex from-flyNow-main to-flyNow-light sm:to-55% sm:from-flyNow-component sm:to-flyNow-light bg-gradient-to-l z-10 shadow-black shadow-sm"}/>
                    <main className={"[&>*]:animate-slideInFadeIn w-full flex flex-col flex-grow items-center bg-home-page-background bg-no-repeat bg-fixed bg-cover"}>
                        <Routes>
                            <Route path="/" element={<Home className={"flex w-full h-full flex-col items-center gap-5"}/>}/>
                            {!user?.username && <Route path="/login" element={<Login className={"my-40 w-full bg-flyNow-component sm:w-2/3 lg:w-1/2 xl:w-1/3 flex flex-col text-xl text-white shadow-black shadow-[2px_2px_5px_rgba(0,0,0,1)] sm:px-8 py-6 px-5 justify-center items-center gap-5"}/>}/>}
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