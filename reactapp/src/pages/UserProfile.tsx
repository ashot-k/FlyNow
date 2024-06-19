import {useContext} from "react";
import {AuthContext} from "../context";
import '../static/UserProfilePage.css'

export default function UserProfile() {

    const userData = useContext(AuthContext);

    return (
        <div className={"mt-36 bg-flyNow-component p-6 w-full sm:w-1/2 flex flex-col justify-center items-center rounded-3xl shadow-md shadow-black"}>
            {userData?.username && <div className={"w-full flex flex-col gap-2"}>
                <div className={"flex items-center gap-3"}>
                    <h1 className={"text-3xl "}>{userData.username}</h1>
                </div>
                <h3>Bookings</h3>
            </div>}
        </div>
    )
}