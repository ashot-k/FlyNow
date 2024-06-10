import React, {useContext} from "react";
import {Container, Nav, Navbar, NavbarText} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context";
import Button from "react-bootstrap/Button";
import {removeFlyNowTokenFromStorage} from "../utils/Utils";

export const NavBar = () => {
    const userData = useContext(AuthContext);

    const navigate = useNavigate();
    return (
        <Navbar id={'navBar'} sticky="top" expand="lg" className="w-100 nav-bar fs-5">
            <Container>
                <Nav.Link as={Link} to={"/"}>
                    <Navbar.Brand className={"fs-3"} href={"#"}>FlyNow</Navbar.Brand>
                </Nav.Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100 d-flex align-items-center justify-content-between gap-2">
                        <div className={"d-flex "}>
                            <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
                            {userData?.username && <Nav.Link as={Link} to={"/profile"}>Profile</Nav.Link>}
                        </div>
                        <div className={"d-flex gap-2"}>
                            {!userData?.username &&
                                <Nav.Link as={Link} className={"btn p-2"} to={"/login"}>Login</Nav.Link>}
                            {!userData?.username &&
                                <Nav.Link as={Link} className={"btn btn-outline-dark p-2"}
                                          to={"/register"}>Register</Nav.Link>}
                            {userData?.username && <div className={"d-flex gap-3"}>
                                <NavbarText className={"text-white"}>Logged in as <span
                                    className={"fw-bold"}>{userData?.username}</span>
                                </NavbarText>
                                <Button variant={"outline-danger"} onClick={() => {
                                    removeFlyNowTokenFromStorage();
                                    window.location.href = "/"
                                }}>Logout</Button>
                            </div>}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
