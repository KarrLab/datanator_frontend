import React, { Component } from 'react';
import { Navbar, AnchorButton, InputGroup } from '@blueprintjs/core';
import './header.css';
import { Logo } from '~/components/Layout/Logo';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.defaultQuery,
      organism: this.props.defaultOrganism,
    }

    this.handleClickInner = this.handleClickInner.bind(this);
  }

  handleClickInner() {
    this.props.handleClick([this.state.query, this.state.organism])

  }

  render() {
  return (
     <Navbar fixedToTop="true" className="bp3-dark navbar" style={{ "background-color": "#1890ff"}}>
      <Navbar.Group className="logo-holder">
        <Logo className="logo" />
      </Navbar.Group>
      <Navbar.Group className="searchbar" onKeyPress={ (event) => {if (event.key === "Enter") { this.handleClickInner() } }}>
        <InputGroup
          className="searchbar-input"
          leftIcon="search"
          placeholder="Search for..."
          onChange={event => {
              this.setState({query:event.target.value});
            }}
        />
        <InputGroup
          className="searchbar-input"
          //leftIcon="search"
          placeholder="In organism..."
          onChange={event => {
              this.setState({organism:event.target.value})
            }}
                  />
      </Navbar.Group>
      <Navbar.Group align className="page-links">
        <AnchorButton
          minimal="true"
          className="navbutton"
          icon="home"
          text="Home"
          href="/"
        />
        <AnchorButton
          minimal="true"
          className="navbutton"
          icon="info-sign"
          text="About"
          href="/about/"
        />
        <AnchorButton
          minimal="true"
          className="navbutton"
          icon="search"
          text="Search"
          href="/search/"
        />
        <AnchorButton
          minimal="true"
          className="navbutton"
          icon="document"
          text="Data"
          href="/data/"
        />
      </Navbar.Group>
</Navbar>
  );
};}
export { Header };
