import React, {useEffect, useState} from "react";

export const NavBar = ({token, tokenExp}:any) => {
    const [tokenExpiration, setTokenExpiration] = useState<number>(tokenExp);

    useEffect(() => {
        if (tokenExpiration)
            var tokenExpCountDown = setInterval(() => {
                if(tokenExpiration > 0)
                setTokenExpiration(tokenExpiration - 1);
                if (tokenExpiration <= 0)
                    clearInterval(tokenExpCountDown);
            }, 1000);
    }, [tokenExpiration]);
    return (
        <div className={"w-100 nav-bar d-flex gap-2"}>
            <a className={"p-3 h1 h-100 text-white bg-secondary text-decoration-none"} href={"/"}>FlyNow</a>
            <div className={"d-flex gap-2 align-items-center"}>
                <div>Token: {token} <br/>Expires in: {tokenExpiration}</div>
               <div></div>
            </div>
        </div>
    );
};
