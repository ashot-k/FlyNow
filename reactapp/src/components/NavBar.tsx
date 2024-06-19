import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context";
import {removeFlyNowTokenFromStorage} from "../utils/Utils";
import {Disclosure} from "@headlessui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faXmark} from '@fortawesome/free-solid-svg-icons'

interface NavBar {
    className?: string
}

export const NavBar = ({className}: NavBar) => {
    const userData = useContext(AuthContext);

    const [dropDownMenu, setDropDownMenu] = useState(false)

    function toggleDropDown() {
        setDropDownMenu(prevState => !prevState);
    }

    const navigate = useNavigate();
    return (
        <Disclosure as={"nav"} id={"navBar"}
                    className={className}>
            <div className={"mx-auto flex w-full h-full sm:w-10/12 p-2 sm:px-6"}>
                <div className={"w-fit px-3"}>
                    <Link to={"/"} className={"font-normal text-4xl sm:text-5xl"}>
                        FlyNow
                    </Link>
                </div>
                {/* Tablet / Desktop */}
                <div
                    className={"w-full sm:flex px-2 py-1.5 items-center justify-between gap-1 text-xl sm:visible hidden"}>
                    <div className={"flex gap-3"}>
                        <Link className={"text-gray-100 hover:text-white"} to={"/"}>Home</Link>
                        {userData?.username &&
                            <Link className={"text-gray-100 hover:text-white"} to={"/profile"}>Profile</Link>}
                    </div>
                    <div className={"flex items-center justify-center gap-4"}>
                        {userData?.username ? <>
                                <span>Logged in as <span
                                    className={"bold"}>{userData?.username}</span>
                                </span>
                            <button
                                className={"transition duration-500 text-rose-600 hover:bg-rose-600 hover:text-white outline-rose-600 outline outline-1 px-5 py-2 rounded-xl"}
                                onClick={() => {
                                    removeFlyNowTokenFromStorage();
                                    window.location.href = "/";
                                }}>Logout
                            </button>
                        </> : <>
                            <Link
                                className={"transition-all duration-500 text-white hover:bg-flyNow-light outline-flyNow-light outline outline-1 px-5 py-2 rounded-xl"}
                                to={"/login"}>Login</Link>
                            <Link
                                className={"transition-all duration-500 text-white bg-flyNow-light outline-flyNow-light outline outline-1 px-5 py-2 rounded-xl"}
                                to={"/register"}>Register</Link>
                        </>}
                    </div>
                </div>
                {/* Mobile */}
                <div className={"sm:hidden w-full py-1 px-3 flex justify-end items-center gap-2"}>
                    <button className={"size-10 rounded-sm"}>
                        <FontAwesomeIcon icon={faBars}
                                         className={"size-full"}
                                         color={"white"} onClick={toggleDropDown}/>
                    </button>
                </div>
            </div>
            {dropDownMenu && <div
                className={"animate-slideIn absolute w-full h-screen flex flex-col items-center justify-start gap-5 sm:hidden backdrop-blur-lg"}>
                <div className={"flex w-full justify-between py-3 px-5"}>
                    <div className={"w-fit"}>
                        <Link to={"/"} className={"font-normal text-5xl"}>
                            FlyNow
                        </Link>
                    </div>
                    <div className={"py-2"}>
                        <button className={"size-10 rounded-sm"}>
                            <FontAwesomeIcon icon={faXmark} onClick={toggleDropDown}
                                             className={"w-full h-full"}
                                             color={"white"}/>
                        </button>
                    </div>
                </div>
                <div className={"w-full flex flex-col px-5 gap-2"}>
                    <Link
                        className={"text-center text-3xl text-white bg-flyNow-light py-4 "}
                        to={"/"} onClick={toggleDropDown}>Home</Link>
                    {userData?.username ? <>
                                <span>Logged in as
                                    <span className={"bold"}>{userData?.username}</span>
                                </span>
                        <button
                            className={"transition duration-500 text-white bg-rose-700 hover:text-white outline-rose-700 outline outline-1 px-5 py-2 rounded-xl"}
                            onClick={() => {
                                removeFlyNowTokenFromStorage();
                                window.location.href = "/";
                            }}>Logout
                        </button>
                    </> : <>
                        <Link
                            className={"text-center transition-all duration-500 text-3xl text-white bg-flyNow-light-bg py-4"}
                            to={"/register"} onClick={toggleDropDown}>Register</Link>
                        <Link
                            className={"text-center transition-all duration-500 text-3xl text-white bg-flyNow-light-secondary py-4 "}
                            to={"/login"} onClick={toggleDropDown}>Login</Link></>}
                </div>
            </div>}
        </Disclosure>
    );
};
