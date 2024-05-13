import React, {useState} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

export const NavBar = ({token, tokenExp, username}: any) => {
    const [tokenExpiration, setTokenExpiration] = useState<number>(tokenExp);
    return (
        <Navbar id={'navBar'} expand="lg" className="w-100 nav-bar bg-body-tertiary" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand className={"display-1"} href="#home">FlyNow</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
                        <Nav.Link as={Link} to={"/top-destinations"}>Top Destinations</Nav.Link>
                        <Nav.Link>Token: {token}</Nav.Link>

                    </Nav>
                </Navbar.Collapse>
                <Nav>
                    {!username && <Nav.Link as={Link} className={"btn btn-outline-dark"} to={"/login"}>Login</Nav.Link>}
                    {!username && <Nav.Link as={Link} className={"btn btn-outline-dark"} to={"/register"}>Register</Nav.Link>}
                    {username && <h3 className={"navbar-brand display-1"}>Logged in as <span
                        className={"fw-bold"}>{username}</span></h3>}
                </Nav>
            </Container>
        </Navbar>
    );
};
