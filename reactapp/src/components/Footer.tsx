
interface FooterProps{
    className?: string;
}
export default function Footer({className}: FooterProps){
    return (
        <footer className={className}>
            <p className={"italic text-center"}>All rights reserved. © 2024 FlyNow. Terms of Service | Privacy Policy | Disclaimer | Contact Us</p>
        </footer>
    )
}