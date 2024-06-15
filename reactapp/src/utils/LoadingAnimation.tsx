import pendingSearchIcon from "../static/assets/infinite-spinner.svg";
import React from "react";



interface LoadingAnimationProps {
    className?: string;
    width?: number | string;
    height?: number | string;
}

export default function LoadingAnimation({className, width, height}: LoadingAnimationProps) {

    return (
        <img className={className} src={pendingSearchIcon} width={width} height={height} alt={""}/>
    )
}