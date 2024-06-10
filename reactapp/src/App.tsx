import './static/App.css';
import './static/NavBar.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import {NavBar} from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import {AuthContext, UserData} from "./context";
import ScrollToTop from "./utils/ScrollToTop";
import {useUserToken} from "./hooks/useUserToken";

function App() {
    const user = useUserToken();

    return (
        <AuthContext.Provider value={user}>
            <BrowserRouter>
                <ScrollToTop/>
                <div data-bs-theme="dark">
                    <NavBar/>
                    <div className={"App w-100 d-flex justify-content-center"}>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            {!user?.username && <Route path="/login" element={<Login/>}/>}
                            {!user?.username && <Route path="/register" element={<Register/>}/>}
                            {user?.username && <Route path="/profile" element={<UserProfile/>}/>}
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;