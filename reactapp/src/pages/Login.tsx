import React, { useEffect, useState } from "react";
import { login } from "../services/FlyNowServiceAPI";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@headlessui/react";
import errorIcon from "../static/assets/error-svgrepo-com.svg";
import successIcon from "../static/assets/success-svgrepo-com.svg";

interface LoginProps {
    onLogin?: (token: string) => void;
    className?: string;
    previousURL?: string;
}

export default function Login({ className }: LoginProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [pendingLogin, setPendingLogin] = useState<boolean>(false);
    const [loginStatus, setLoginStatus] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        setShowAlert(false);
    }, [username, password]);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (username.trim() && password.trim()) {
            setPendingLogin(true);
            login({ username, password })
                .then((r) => {
                    if (r) {
                        setLoginStatus(true);
                        setShowAlert(true);
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 350);
                    } else {
                        setLoginStatus(false);
                        setShowAlert(true);
                    }
                })
                .catch((e) => {
                    setShowAlert(true);
                    setLoginStatus(false);
                    console.log(e);
                })
                .finally(() => setPendingLogin(false));
        }
    }

    return (
        <form onSubmit={handleLogin} className={className}>
            <div className={"w-full"}>
                <h1 className={"text-2xl"}>Login</h1>
                <hr className={"mb-2 mt-5 border-gray-500"} />
            </div>
            <div className={"flex w-full flex-col items-center gap-3.5 sm:w-1/2 lg:w-2/3"}>
                <div className={"flex w-full flex-col gap-1.5"}>
                    <label className={"w-full text-sm"} htmlFor={"username"}>
                        Username
                    </label>
                    <Input
                        name={"username"}
                        className={
                            "w-full rounded-lg bg-transparent px-3 py-2 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:py-1.5"
                        }
                        type={"text"}
                        placeholder={"Enter username"}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className={"flex w-full flex-col gap-1.5"}>
                    <label className={"w-full text-sm"} htmlFor={"password"}>
                        Password
                    </label>
                    <Input
                        name={"password"}
                        className={
                            "w-full rounded-lg bg-transparent px-3 py-2 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:py-1.5"
                        }
                        type={"password"}
                        placeholder={"Enter password"}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className={"flex w-full flex-col items-center gap-2"}>
                <button
                    className={
                        "w-full rounded-2xl bg-flyNow-light py-2 transition-colors duration-300 hover:bg-flyNow-secondary sm:w-1/4"
                    }
                    type={"submit"}
                    onClick={handleLogin}>
                    Login
                </button>
                <div
                    className={"data-[alert-type=danger]:text-red-500 data-[alert-type=success]:text-emerald-500"}
                    data-alert-type={loginStatus ? "success" : "danger"}
                    hidden={!showAlert}>
                    {loginStatus ? (
                        <div className={"flex w-full gap-1"}>
                            Login success.
                            <img src={successIcon} className={"h-8 w-8"} alt={""} />
                        </div>
                    ) : (
                        <div className={"flex w-full gap-1"}>
                            An error occurred during login.
                            <img src={errorIcon} className={"h-8 w-8"} alt={""} />
                        </div>
                    )}
                </div>
                <span>
                    New here?{" "}
                    <Link to={"/register"} className={"text-flyNow-light-secondary underline"}>
                        Sign up
                    </Link>
                </span>
            </div>
        </form>
    );
}
