import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface LoadingAnimationProps {
    className?: string;
    width?: number | string;
    height?: number | string;
    color?: string;
}

export default function LoadingAnimation({ className, width, height, color }: LoadingAnimationProps) {
    return (
        <FontAwesomeIcon className={className + " fa-spin"} width={width} height={height} color={color} icon={"gear"} />
    );
}
