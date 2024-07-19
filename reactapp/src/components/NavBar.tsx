import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context";
import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CurrencySelect from "./CurrencySelect";
import { removeFlyNowTokenFromStorage } from "../utils/Token";

interface NavBar {
    className?: string;
}

export const NavBar = ({ className }: NavBar) => {
    const userData = useContext(AuthContext);

    const [dropDownMenu, setDropDownMenu] = useState(false);
    const [hide, setHide] = useState(true);

    function toggleDropDown() {
        if (dropDownMenu) {
            setHide(true);
            setTimeout(() => setDropDownMenu(false), 400);
        } else {
            setHide(false);
            setDropDownMenu(true);
        }
    }

    return (
        <Disclosure as={"nav"} id={"navBar"} className={className}>
            <div className={"mx-auto flex h-full w-full p-3 sm:w-full sm:px-6 xl:w-5/6"}>
                <div className={"w-fit px-3"}>
                    <a href={"/"} className={"text-4xl font-normal sm:text-4xl"}>
                        FlyNow
                    </a>
                </div>
                {/* Tablet / Desktop */}
                <div
                    className={
                        "hidden w-full items-center justify-between gap-1 px-2 py-1.5 text-base lg:visible lg:flex"
                    }>
                    <div className={"flex gap-3"}>
                        <a href={"/"} className={"text-gray-100 hover:text-white"}>
                            Home
                        </a>
                        {userData?.username && (
                            <Link className={"text-gray-100 hover:text-white"} to={"/profile"}>
                                Profile
                            </Link>
                        )}
                    </div>
                    <div className={"flex w-3/4 items-center justify-end gap-4 md:w-full xl:w-3/4"}>
                        {userData?.username ? (
                            <>
                                <span>
                                    Logged in as <span className={"bold"}>{userData?.username}</span>
                                </span>
                                <button
                                    className={
                                        "rounded-xl px-5 py-2 text-rose-600 outline outline-1 outline-rose-600 transition duration-500 hover:bg-rose-600 hover:text-white"
                                    }
                                    onClick={() => {
                                        removeFlyNowTokenFromStorage();
                                        window.location.href = "/";
                                    }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    className={
                                        "rounded-xl px-5 py-2 text-white outline outline-1 outline-flyNow-light transition-all duration-500 hover:bg-flyNow-light"
                                    }
                                    to={"/login"}>
                                    Login
                                </Link>
                                <Link
                                    className={
                                        "rounded-xl bg-flyNow-light px-5 py-2 text-white outline outline-1 outline-flyNow-light transition-all duration-500"
                                    }
                                    to={"/register"}>
                                    Register
                                </Link>
                            </>
                        )}
                        <CurrencySelect className={"w-1/6 text-sm"} />
                    </div>
                </div>
                {/* Mobile */}
                <div className={"flex w-full items-center justify-end gap-2 px-3 py-1 lg:hidden"}>
                    <button className={"size-10 rounded-sm"}>
                        <FontAwesomeIcon
                            icon={"bars"}
                            className={"size-full"}
                            color={"white"}
                            onClick={toggleDropDown}
                        />
                    </button>
                </div>
            </div>
            {/* Mobile */}
            {dropDownMenu && (
                <div
                    className={
                        "absolute flex h-screen w-full animate-slideIn flex-col items-center justify-start gap-5 text-base backdrop-blur-lg lg:hidden" +
                        (hide ? " -translate-x-full opacity-0 transition-all duration-[350ms]" : "")
                    }>
                    <div className={"flex w-full justify-between px-5 py-3"}>
                        <div className={"w-fit"}>
                            <Link to={"/"} className={"text-5xl font-normal"}>
                                FlyNow
                            </Link>
                        </div>
                        <div className={"py-2"}>
                            <button className={"size-10 rounded-sm"}>
                                <FontAwesomeIcon
                                    icon={"xmark"}
                                    onClick={toggleDropDown}
                                    className={"h-full w-full"}
                                    color={"white"}
                                />
                            </button>
                        </div>
                    </div>
                    <div className={"flex w-3/4 flex-col gap-3 px-5 sm:w-1/2"}>
                        {userData?.username ? (
                            <>
                                <Link
                                    className={
                                        "rounded-lg bg-flyNow-secondary py-2 text-center text-white transition-all duration-500"
                                    }
                                    to={"/profile"}
                                    onClick={toggleDropDown}>
                                    Profile
                                </Link>
                                <button
                                    className={
                                        "rounded-lg bg-rose-700 py-2 text-center text-white transition-all duration-500"
                                    }
                                    onClick={() => {
                                        removeFlyNowTokenFromStorage();
                                        window.location.href = "/";
                                    }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    className={
                                        "rounded-lg bg-flyNow-light py-2 text-center text-white transition-all duration-500"
                                    }
                                    to={"/register"}
                                    onClick={toggleDropDown}>
                                    Register
                                </Link>
                                <Link
                                    className={
                                        "rounded-lg bg-flyNow-secondary py-2 text-center text-white transition-all duration-500"
                                    }
                                    to={"/login"}
                                    onClick={toggleDropDown}>
                                    Login
                                </Link>
                            </>
                        )}
                        <div className={"flex w-full justify-end"}>
                            <CurrencySelect className={"w-1/2 text-sm sm:w-1/3"} />
                        </div>
                    </div>
                </div>
            )}
        </Disclosure>
    );
};
