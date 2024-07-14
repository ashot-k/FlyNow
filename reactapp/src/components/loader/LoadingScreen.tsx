import React, { useState, useEffect } from "react";
import LoadingAnimation from "./LoadingAnimation";

interface LoadingScreenProps {
    className?: string;
    id?: string;
    show: boolean;
}

export default function LoadingScreen({ className, id, show }: LoadingScreenProps) {
    const duration = 500;
    const durationClass = "duration-" + duration;
    const [loadingScreenClass, setLoadingScreenClass] = useState<string | undefined>(" ");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            setLoadingScreenClass("");
        } else {
            const className = durationClass + " " + "opacity-85 transition-transform -translate-x-full";
            setLoadingScreenClass(className);
            setTimeout(() => {
                setVisible(false);
            }, duration);
        }
    }, [show, className]);

    return (
        <>
            {visible && (
                <div id={id} className={className + " " + loadingScreenClass}>
                    <LoadingAnimation color={"#4AB5F2"} className={"size-32"} />
                </div>
            )}
        </>
    );
}
