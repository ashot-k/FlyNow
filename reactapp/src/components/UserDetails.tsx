import React, { useContext } from "react";
import { AuthContext } from "../context";

interface UserDetailsProps {
    className?: string;
}

export default function UserDetails({ className }: UserDetailsProps) {
    const userData = useContext(AuthContext);
    return (
        <>
            {userData && (
                <div className={className}>
                    <div className={"w-full"}>
                        <div className={"text-xs text-gray-400"}>Username</div>
                        <div className={"text-xl"}>{userData.username}</div>
                    </div>
                    <div className={"flex w-full"}>
                        <div className={"w-1/2"}>
                            <div className={"text-xs text-gray-400"}>First name</div>
                            <div className={"text-xl"}>{userData.firstName}</div>
                        </div>
                        <div className={"w-1/2"}>
                            <div className={"text-xs text-gray-400"}>Last name</div>
                            <div className={"text-xl"}>{userData.lastName}</div>
                        </div>
                    </div>
                    <div className={"flex w-full"}>
                        <div className={"w-1/2"}>
                            <div className={"text-xs text-gray-400"}>Phone number</div>
                            <div className={"text-xl"}>{userData.phoneNumber}</div>
                        </div>
                        <div className={"w-1/2"}>
                            <div className={"text-xs text-gray-400"}>Country</div>
                            <div className={"text-xl"}>{userData.country}</div>
                        </div>
                    </div>
                    <div className={"flex w-full"}>
                        <div className={"w-1/2"}>
                            <div className={"text-xs text-gray-400"}>City</div>
                            <div className={"text-xl"}>{userData.city}</div>
                        </div>
                        <div className={"w-1/2"}>
                            <div className={"text-xs text-gray-400"}>Postal code</div>
                            <div className={"text-xl"}>{userData.postalCode}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
