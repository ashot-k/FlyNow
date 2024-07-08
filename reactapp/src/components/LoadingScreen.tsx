import LoadingAnimation from "../utils/LoadingAnimation";
import React, { useEffect } from "react";

interface LoadingScreenProps {
    className?: string;
    id?: string;
    show?: boolean;
}

export default function LoadingScreen({ className, id, show }: LoadingScreenProps) {
    useEffect(() => {
        if (!id) return;
        const loadingScreen = document.getElementById(id);
        if (loadingScreen) {
            const handleAnimationEnd = () => {
                loadingScreen.classList.add("hidden");
            };

            if (show) {
                loadingScreen.classList.remove("hidden");
                loadingScreen.classList.remove("animate-slideOut");
                loadingScreen.removeEventListener("animationend", handleAnimationEnd);
            } else {
                loadingScreen.classList.add("animate-slideOut");
                loadingScreen.addEventListener("animationend", handleAnimationEnd);
            }
            return () => {
                loadingScreen.removeEventListener("animationend", handleAnimationEnd);
            };
        }
    }, [show]);
    return (
        <div id={id} className={className}>
            <LoadingAnimation color={"#4AB5F2"} className={"size-32"} />
        </div>
    );
}
