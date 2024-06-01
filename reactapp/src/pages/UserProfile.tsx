import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context";

export default function UserProfile(){

    const userData = useContext(AuthContext);

    return (
        <div className={"w-100 d-flex flex-column justify-content-center align-items-center"}>
            {userData?.username && <div className={"w-50 component-box mt-3 p-4 d-flex flex-column gap-2"}>
                <div className={"d-flex align-items-center gap-3"}>
                    <img alt={""} width={"96px"} height={"96px"}
                         src={"https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"}
                         className={"rounded-circle bg-white"}/>
                    <h2>{userData.username}</h2>
                </div>
                <h3>Bookings</h3>
            </div>}
        </div>
    )
}