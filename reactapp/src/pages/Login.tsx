import React, {useEffect, useState} from "react";
import {login} from "../services/FlyNowServiceAPI";
import {Link} from "react-router-dom";
import {Input} from "@headlessui/react";
import errorIcon from '../static/assets/error-svgrepo-com.svg'
import successIcon from '../static/assets/success-svgrepo-com.svg'

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
              className={"my-40 w-full bg-flyNow-component sm:w-2/3 lg:w-1/2 xl:w-1/3 flex flex-col text-xl text-white shadow-black shadow-[2px_2px_5px_rgba(0,0,0,1)] sm:px-8 py-6 px-5 justify-center items-center gap-5"}>
            <div className={"w-full"}>
                <h1 className={"text-3xl"}>Login</h1>
                <hr className={"mt-5 mb-2 border-gray-500"}/>
            </div>
            <div className={"w-full sm:w-1/2 lg:w-2/3 static flex flex-col items-center gap-3.5"}>
                <label className={"w-full"} htmlFor={"username"}>Username</label>
                <Input name={"username"}
                       className={"w-full rounded-lg bg-transparent outline outline-1 outline-gray-500 data-[focus]:outline-cyan-300 py-1.5 px-3 text-white"}
                       type={"text"} placeholder={"Enter username"}
                       onChange={e => setUsername(e.target.value)}
                />
                <label className={"w-full"} htmlFor={"password"}>Password</label>
                <Input name={"password"}
                       className={"w-full rounded-lg bg-transparent outline outline-1 outline-gray-500 data-[focus]:outline-cyan-300 py-1.5 px-3 text-white"}
                       type={"password"} placeholder={"Enter password"}
                       onChange={e => setPassword(e.target.value)}/>
            </div>
            <button className={"w-full sm:w-3/6 bg-cyan-700 outline-cyan-700 outline px-5 py-2 rounded-xl"}
                    type={"submit"} onClick={handleLogin}>Login
            </button>
            <div
                className={"data-[alert-type=success]:text-emerald-500 data-[alert-type=danger]:text-red-500"}
                data-alert-type={loginStatus ? "success" : "danger"}
                hidden={!showAlert}>
                {loginStatus ?
                    <div className={"w-full flex gap-1"}>Login success.<img src={successIcon} className={"w-8 h-8"} alt={""}/></div>
                    :
                    <div className={"w-full flex gap-1"}>An error occurred during login.<img src={errorIcon} className={"w-8 h-8"} alt={""}/></div>}
            </div>
            <span>New here? <Link to={"/register"} className={"underline text-cyan-300"}>Sign up</Link></span>
        </form>
    )
}