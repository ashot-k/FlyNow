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
              className={"w-25 login p-3 element-shadow mt-3 gap-3 d-flex flex-column align-items-center justify-content-center"}>
            <h3>Login</h3>
            <label>Username
                <input className={"form-control"} type={"text"} placeholder={"Enter username"}
                       onChange={e => setUsername(e.target.value)}/>
            </label>
            <label>Password
                <input className={"form-control"} type={"password"} placeholder={"Enter password"}
                       onChange={e => setPassword(e.target.value)}/>
            </label>
            <Button variant={"btn"} className={""} type={"submit"}
                    disabled={!(username.trim().length > 0 && password.trim().length > 0)}>Login</Button>
            <Link to={"/register"}>New? Sign up here</Link>
            <Alert variant={loginStatus ? "success" : "danger"} show={!pendingLogin && showAlert}>{
                loginStatus ? "Successful Login" : "Wrong Credentials"}
            </Alert>
        </form>
    )
}