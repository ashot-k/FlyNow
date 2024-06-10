import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Alert} from "react-bootstrap";
import {register} from "../services/FlyNowServiceAPI";
import {Link, useNavigate} from 'react-router-dom'

export default function Register() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pendingRegister, setPendingRegister] = useState<boolean>(false);
    const [registerStatus, setRegisterStatus] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        setShowAlert(false);
    }, [username, password]);

    function handleRegistration(e: React.FormEvent) {
        e.preventDefault();
        if ((username.trim() && password.trim())) {
            setPendingRegister(true);
            register({username, password})
                .then(r => {
                    if (r && r.username) {
                        setRegisterStatus(true)
                        setShowAlert(true);
                        setResponseMessage(r.message)
                        setTimeout(() => {
                            navigate("/login");
                        }, 750);
                    } else {
                        setRegisterStatus(false);
                        setShowAlert(true);
                        setResponseMessage(r);
                    }
                    setPendingRegister(false)
                })
                .catch((e) => {
                    setShowAlert(true)
                    setRegisterStatus(false);
                    setResponseMessage(e.response.data);
                    console.log(e);
                    setPendingRegister(false);
                });
        }
    }

    return (
        <form onSubmit={handleRegistration}
              className={"register-page p-3 pb-4 element-shadow mt-3 gap-3 d-flex flex-column align-items-center justify-content-center"}>
            <h3>Register</h3>
            <div className={"w-100 d-flex flex-column align-items-center gap-2"}>
                <label className={"w-50"}>Username</label>
                <input className={"form-control w-50"} type={"text"} placeholder={"Enter username"}
                       onChange={e => setUsername(e.target.value)}/>

                <label className={"w-50"}>Password</label>
                <input className={"form-control w-50"} type={"password"} placeholder={"Enter password"}
                       onChange={e => setPassword(e.target.value)}/>
            </div>
            <Button variant={"btn"} className={"w-50 rounded-5"} type={"submit"}>Sign up</Button>
            <span>Already signed up? <Link to={"/login"}>Log in</Link></span>
            <Alert variant={registerStatus ? "success" : "danger"} show={!pendingRegister && showAlert}>{responseMessage}</Alert>
        </form>
    )
}