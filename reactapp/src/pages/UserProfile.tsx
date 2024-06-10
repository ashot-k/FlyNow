import {useContext} from "react";
import {AuthContext} from "../context";
import '../static/UserProfilePage.css'

export default function UserProfile() {

    const userData = useContext(AuthContext);

    return (
        <div className={"user-profile-page d-flex flex-column justify-content-center align-items-center"}>
            {userData?.username && <div className={"w-100 component-box mt-3 p-4 d-flex flex-column gap-2"}>
                <div className={"d-flex align-items-center gap-3"}>
                    <img alt={""} width={"128px"} height={"128px"}
                         src={"https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"}
                         className={"rounded-circle bg-white"}/>
                    <h1>{userData.username}</h1>
                </div>
                <h3>Bookings</h3>
            </div>}
        </div>
    )
}