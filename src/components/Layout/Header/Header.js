import React from 'react';
import {Navbar, Alignment, Button, AnchorButton, InputGroup, Classes} from "@blueprintjs/core";
import "./header.scss";
import {Logo} from "~/components/Logo";

const Header = () => {
    return(
        <Navbar fixedToTop="true" className ="bp3-dark navbar">
            <Navbar.Group className="navgroupleft" align={Alignment.LEFT}>
                <Navbar.Heading className="bp3-navbar-heading"> </Navbar.Heading>
                <Logo className="logo"/>
            </Navbar.Group>
            <Navbar.Group className="centernavgroup" > 
                <InputGroup className=" searchbar" leftIcon="search" placeholder="Search..." />
            </Navbar.Group>
            <Navbar.Group align ={Alignment.RIGHT} className="navgroupright">
                <AnchorButton minimal="true" className="navbutton" icon="home" text="Home" href="/" />
                <AnchorButton minimal="true" className="navbutton" icon="info-sign" text="About" href= "/about/" />
                <AnchorButton minimal="true" className="navbutton" icon="search" text="Search" href= "/search/" />
                <AnchorButton minimal="true" className="navbutton" icon="document" text="Data" href = "/data/"/>
            </Navbar.Group>
        </Navbar>
    );
}
export{Header}; 