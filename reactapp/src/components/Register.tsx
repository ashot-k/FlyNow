import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import {Alert} from "react-bootstrap";
import {register} from "../services/AuthenticationServiceAPI";
import {useNavigate} from 'react-router-dom'

export default function Register(){
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pendingRegister, setPendingRegister] = useState<boolean>(false);
    const [registerStatus, setRegisterStatus] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>('');
    const navigate = useNavigate();
    function handleRegistration(e: React.FormEvent){
        e.preventDefault();
        if ((username.trim() && password.trim())) {
            setPendingRegister(true);
            register({username, password})
                .then(r => {
                    if (r && r.username) {
                        setRegisterStatus(true)
                        setShowAlert(true);
                        setResponseMessage(r.message)
                        setTimeout(()=> {
                            navigate("/");
                        }, 750);
                    } else {
                        setRegisterStatus(false);
                        setShowAlert(true);
                        console.log(r.response.data)
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
              className={"d-flex flex-column w-25 login p-3 element-shadow mt-3 gap-3 d-flex flex-column align-items-center justify-content-start"}>
            <h3>Register</h3>
            <label>Username
                <input className={"form-control"} type={"text"} placeholder={"Enter username"}
                       onChange={e => setUsername(e.target.value)}/>
            </label>
            <label>Password
                <input className={"form-control"} type={"password"} placeholder={"Enter password"}
                       onChange={e => setPassword(e.target.value)}/>
            </label>

            <Button variant={"btn"} className={"w-25"} type={"submit"}>Sign up</Button>
            <Alert variant={registerStatus ? "success" : "danger"} show={!pendingRegister && showAlert}>{responseMessage}</Alert>
        </form>
    )
}