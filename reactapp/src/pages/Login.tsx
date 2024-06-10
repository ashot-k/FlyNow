import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Alert} from "react-bootstrap";
import {login} from "../services/FlyNowServiceAPI";
import {Link} from "react-router-dom";

interface LoginProps {
    onLogin: (token: string) => void;
}

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pendingLogin, setPendingLogin] = useState<boolean>(false);
    const [loginStatus, setLoginStatus] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        setShowAlert(false);
    }, [username, password]);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if ((username.trim() && password.trim())) {
            setPendingLogin(true);
            login({username, password})
                .then(r => {
                    if (r) {
                        setLoginStatus(true)
                        setShowAlert(true);
                        setTimeout(() => {
                            window.location.href = "/"
                        }, 350);
                    } else {
                        setLoginStatus(false);
                        setShowAlert(true);
                    }
                })
                .catch((e) => {
                    setShowAlert(true)
                    setLoginStatus(false);
                    console.log(e);
                }).finally(() => setPendingLogin(false));
        }
    }

    return (
        <form onSubmit={handleLogin}
              className={"login-page p-3 pb-4 element-shadow mt-3 gap-3 d-flex flex-column align-items-center justify-content-center"}>
            <h3>Login</h3>
            <div className={"w-100 d-flex flex-column align-items-center gap-2"}>
                <label className={"w-50"}>Username</label>
                <input className={"form-control w-50"} type={"text"} placeholder={"Enter username"}
                       onChange={e => setUsername(e.target.value)}/>
                <label className={"w-50"}>Password</label>
                <input className={"form-control w-50"} type={"password"} placeholder={"Enter password"}
                       onChange={e => setPassword(e.target.value)}/>
            </div>
            <Button variant={"btn"} className={"w-50 rounded-5"} type={"submit"}>Login</Button>
            <span>New here? <Link to={"/register"}>Sign up</Link></span>
            <Alert variant={loginStatus ? "success" : "danger"}
                   show={!pendingLogin && showAlert}>{loginStatus ? "Successful Login" : "Wrong Credentials"}
            </Alert>
        </form>
    )
}