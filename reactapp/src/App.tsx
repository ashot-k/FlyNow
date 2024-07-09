import "./static/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { NavBar } from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import { AuthContext } from "./context";
import { useUserToken } from "./hooks/useUserToken";
import Footer from "./components/Footer";
import "./static/animations.css";
import {
    faB,
    faCheckSquare,
    faCoffee,
    faDatabase,
    faHouseLaptop,
    faS,
    faWindowMaximize,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faB, faS, faHouseLaptop, faCheckSquare, faCoffee, faDatabase, faWindowMaximize);

interface AppProps {
    className?: string;
}

export default function App({ className }: AppProps) {
    const user = useUserToken();

    return (
        <AuthContext.Provider value={user}>
            <BrowserRouter>
                <div className={className}>
                    <NavBar
                        className={
                            "fixed top-0 z-50 flex h-16 max-h-16 w-full bg-gradient-to-l from-flyNow-main to-flyNow-light shadow-sm shadow-black sm:from-flyNow-component sm:to-flyNow-light sm:to-55%"
                        }
                    />
                    <main
                        className={
                            "mt-16 flex w-full flex-grow flex-col items-center justify-center sm:justify-start [&>*]:animate-slideInFadeIn"
                        }>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Home
                                        className={
                                            "flex w-full flex-grow flex-col items-start justify-start gap-5 sm:justify-start"
                                        }
                                    />
                                }
                            />
                            {!user?.username && (
                                <Route
                                    path="/login"
                                    element={
                                        <Login
                                            className={
                                                "flex w-full flex-grow flex-col items-center justify-center gap-5 bg-flyNow-component bg-opacity-95 px-5 py-6 text-xl text-white shadow-[2px_2px_5px_rgba(0,0,0,1)] shadow-black sm:mt-16 sm:w-2/3 sm:flex-grow-0 sm:px-8 lg:w-1/2 xl:w-1/3"
                                            }
                                        />
                                    }
                                />
                            )}
                            {!user?.username && (
                                <Route
                                    path="/register"
                                    element={
                                        <Register
                                            className={
                                                "flex w-full flex-grow flex-col items-center justify-center gap-5 bg-flyNow-component bg-opacity-95 px-5 py-6 text-xl text-white shadow-[2px_2px_5px_rgba(0,0,0,1)] shadow-black sm:mt-16 sm:w-2/3 sm:flex-grow-0 sm:px-8 lg:w-1/2 xl:w-2/4"
                                            }
                                        />
                                    }
                                />
                            )}
                            {user?.username && <Route path="/profile" element={<UserProfile />} />}
                        </Routes>
                    </main>
                    <Footer
                        className={
                            "flex h-16 max-h-16 w-full flex-col items-center justify-end bg-flyNow-component px-4 py-3"
                        }
                    />
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}
