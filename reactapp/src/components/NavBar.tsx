import React, {useContext} from "react";
import {Container, Nav, Navbar, NavbarText} from "react-bootstrap";
import {Link} from "react-router-dom";
import {AuthContext} from "../context";
import Button from "react-bootstrap/Button";
import {removeFlyNowTokenFromStorage} from "../utils/Utils";

export const NavBar = () => {
    const userData = useContext(AuthContext);
    return (
        <Navbar id={'navBar'} sticky="top" expand="lg" className="w-100 nav-bar bg-body-tertiary">
            <Container>
                <Navbar.Brand className={"display-1"} href="#home">FlyNow</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" >
                    <Nav className="me-auto align-items-center gap-2">
                        <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
                        {userData?.username && <Nav.Link as={Link} to={"/profile"}>Profile</Nav.Link>}
                        {!userData?.username &&
                            <Nav.Link as={Link} className={"btn btn-outline-dark"} to={"/login"}>Login</Nav.Link>}
                        {!userData?.username &&
                            <Nav.Link as={Link} className={"btn btn-outline-dark"} to={"/register"}>Register</Nav.Link>}
                        {userData?.username && <>
                        <NavbarText className={"text-white"}>Logged in as <span className={"fw-bold"}>{userData?.username}</span>
                        </NavbarText>
                            <Button variant={"outline-danger"} size={"sm"} onClick={() => {
                                removeFlyNowTokenFromStorage();
                                window.location.href = "/"
                            }}>Logout</Button>
                        </>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
