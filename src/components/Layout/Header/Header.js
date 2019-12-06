import React from 'react';
import { Navbar, AnchorButton, InputGroup } from '@blueprintjs/core';
import './header.scss';
import { Logo } from '~/components/Layout/Logo';

const Header = () => {
  return (
    <Navbar fixedToTop="true" className="bp3-dark navbar">
      <Navbar.Group className="logo-holder">
        <Logo className="logo" />
      </Navbar.Group>

      <Navbar.Group align className="page-links">
        <AnchorButton
          minimal="true"
          className="navbutton"
          icon="home"
          text="Home"
          href="/"
        />

      </Navbar.Group>
    </Navbar>
  );
};
export { Header };
