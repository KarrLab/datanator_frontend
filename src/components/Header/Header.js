import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";

import "./Header.scss";
import { Logo } from "./Logo/Logo";
import SearchForm from "~/components/SearchForm/SearchForm";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      showSearchForm: true
    };
  }

  render() {
    let showSearchForm = this.state.showSearchForm;
    let searchIcon = "search";
    let searchText = "Search";
    if (showSearchForm) {
      searchIcon = null;
      searchText = "Hide search";
    }

    return (
      <Navbar fixedToTop="true" className="header-component" id="top">
        <Navbar.Group className="logo-title-container">
          <Logo />
          <div className="titles">
            <div className="title">Datanator</div>
            <div className="subtitle">Data for modeling cells</div>
          </div>
        </Navbar.Group>

        {showSearchForm && (
          <Navbar.Group className="search-container">
            <SearchForm />
          </Navbar.Group>
        )}

        <Navbar.Group align className="page-links">
          <Button
            minimal="true"
            className="navbutton"
            icon={searchIcon}
            text={searchText}
            onClick={() =>
              this.setState({ showSearchForm: !this.state.showSearchForm })
            }
          />
          <Link to="/about">
            <Button
              minimal="true"
              className="navbutton"
              icon="info-sign"
              text="About"
            />
          </Link>
        </Navbar.Group>
      </Navbar>
    );
  }
}
export { Header };
