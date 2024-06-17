import React, {useEffect, useState} from "react";
import {register} from "../services/FlyNowServiceAPI";
import {Link, useNavigate} from 'react-router-dom'
import {Input} from "@headlessui/react";
import successIcon from "../static/assets/success-svgrepo-com.svg";
import errorIcon from "../static/assets/error-svgrepo-com.svg";

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
                })
                .catch((e) => {
                    console.log(e);
                    setShowAlert(true)
                    setRegisterStatus(false);
                    setResponseMessage(e.data);
                    setPendingRegister(false);
                });
        }
    }

    return (
        <form onSubmit={handleRegistration}
              className={"my-40 w-full bg-flyNow-component sm:w-2/3 lg:w-1/2 xl:w-1/3 flex flex-col text-xl text-white shadow-black shadow-[2px_2px_5px_rgba(0,0,0,1)] sm:px-8 py-6 px-5 justify-center items-center gap-5"}>
            <div className={"w-full"}>
                <h1 className={"text-3xl"}>Create your account</h1>
                <hr className={"mt-5 mb-2 border-gray-500"}/>
            </div>
            <div className={"w-full sm:w-1/2 lg:w-2/3 static flex flex-col items-center gap-3.5"}>
                <label className={"w-full"} htmlFor={"username"}>Username</label>
                <Input name={"username"} className={
                    "invalid:visible w-full rounded-lg bg-transparent outline outline-1 outline-gray-500 data-[focus]:outline-cyan-300 py-1.5 px-3 text-white"
                } type={"text"}
                       placeholder={"Enter username"} onChange={e => setUsername(e.target.value)}
                />
                <label className={"w-full"} htmlFor={"password"}>Password</label>
                <Input name={"password"}
                       className={"w-full rounded-lg bg-transparent outline outline-1 outline-gray-500 data-[focus]:outline-cyan-300 py-1.5 px-3 text-white"}
                       type={"password"} placeholder={"Enter password"}
                       onChange={e => setPassword(e.target.value)}/>
            </div>
            <button className={"w-full sm:w-3/6 bg-cyan-700 outline-cyan-700 outline px-5 py-2 rounded-xl"}
                    type={"submit"}>Register
            </button>
            <div
                className={"data-[alert-type=success]:text-emerald-500 data-[alert-type=danger]:text-red-500"}
                data-alert-type={registerStatus ? "success" : "danger"}
                hidden={!showAlert}>
                {registerStatus ?
                    <div className={"w-full flex gap-1"}>Registration success.<img src={successIcon}
                                                                                   className={"w-8 h-8"}
                                                                                   alt={""}/></div>
                    :
                    <div className={"w-full flex gap-2"}>{responseMessage}<img src={errorIcon}
                                                                               className={"w-8 h-8"}
                                                                               alt={""}/></div>}
            </div>
            <span>Already have an account? <Link to={"/login"}
                                                 className={"underline text-cyan-300"}>Log in</Link></span>
            {/* <Alert variant={registerStatus ? "success" : "danger"} show={!pendingRegister && showAlert}>{responseMessage}</Alert>*/
            }
        </form>
    )


}