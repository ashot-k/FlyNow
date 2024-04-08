export const NavBar = () => {
    return (

        <div className={"w-100 nav-bar d-flex"}>
            <a className={"p-3 display-4 text-white bg-secondary text-decoration-none"} href={"/"}>FlyNow</a>
            <div className={"d-flex gap-2 align-items-center"}>
                <a className={"btn btn-info h-100 "}>My bookings</a>
            </div>
        </div>
    );
};
