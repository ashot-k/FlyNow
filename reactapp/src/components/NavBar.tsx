import React, {useContext} from "react";
import {Container, Nav, Navbar, NavbarText} from "react-bootstrap";
import {Link} from "react-router-dom";
import {AuthContext} from "../context";
import Button from "react-bootstrap/Button";
import {removeFlyNowTokenFromStorage} from "../utils/Utils";

export const NavBar = () => {
    const userData = useContext(AuthContext);
    return (
        <Navbar id={'navBar'} sticky="top" expand="lg" className="w-100 nav-bar bg-body-tertiary fs-5">
            <Container>
                <Navbar.Brand className={"fs-3"} href="#home">FlyNow</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100 d-flex align-items-center justify-content-between gap-2">
                        <div className={"d-flex "}>
                        <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
                        {userData?.username && <Nav.Link as={Link} to={"/profile"}>Profile</Nav.Link>}
                        </div>
                        <div className={"d-flex gap-2 "}>
                        {!userData?.username &&
                            <Nav.Link as={Link} className={"btn btn-outline-dark"}  to={"/login"}>Login</Nav.Link>}
                        {!userData?.username &&
                            <Nav.Link as={Link} className={"btn btn-outline-dark"} to={"/register"}>Register</Nav.Link>}
                        {userData?.username && <div className={"d-flex gap-3"}>
                        <NavbarText className={"text-white"}>Logged in as <span className={"fw-bold"}>{userData?.username}</span>
                        </NavbarText>
                            <Button variant={"outline-danger"}  onClick={() => {
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
