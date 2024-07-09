import LoadingAnimation from "./LoadingAnimation";
import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
    className?: string;
    id?: string;
    show?: boolean;
}

export default function LoadingScreen({ className, id, show }: LoadingScreenProps) {
    const duration = "duration-[1000ms]";
    const [loadingScreenClass, setLoadingScreenClass] = useState<string>(className ? className : "");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setLoadingScreenClass(className ? className : "");
            setVisible(true);
        } else {
            setLoadingScreenClass(className + "  transition-all -translate-x-full opacity-75");
            setTimeout(() => setVisible(false), 1000);
        }
    }, [show]);

    return (
        <>
            {visible && (
                <div id={id} className={loadingScreenClass + " " + duration}>
                    <LoadingAnimation color={"#4AB5F2"} className={"size-32"} />
                </div>
            )}
        </>
    );
}
