import errorIcon from "../static/assets/error-svgrepo-com.svg";

interface ErrorMessage {
    className?: string;
    message: string;
    show: boolean;
    img?: string
}

export default function ErrorMessage({className, message, show, img}: ErrorMessage) {

    return (
        <>
            {show && <div className={className} >
                <span>{message}</span><img src={img ? img : errorIcon} className={"w-8 h-8"} alt={errorIcon}/>
            </div>}
        </>
    )
}