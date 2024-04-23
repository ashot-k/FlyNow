import React, {useEffect, useState} from "react";
import {Container, Nav, Navbar, NavItem, NavLink} from "react-bootstrap";
import {activitiesInArea} from "../services/AmadeusAPIService";

export const NavBar = ({token, tokenExp}:any) => {
    const [tokenExpiration, setTokenExpiration] = useState<number>(tokenExp);



    return (
    <Navbar expand="lg" className="w-100 nav-bar bg-body-tertiary"  bg="dark" data-bs-theme="dark">
        <Container>
            <Navbar.Brand className={"display-1"} href="#home">FlyNow</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#">Home</Nav.Link>
                    <Nav.Link>Token: {token}</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    );
};
