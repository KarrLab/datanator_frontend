import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { Navbar } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";
import { parseHistoryLocationPathname } from "~/utils/utils";

import "./Header.scss";
import { Logo } from "./Logo/Logo";
import SearchForm from "~/components/SearchForm/SearchForm";

class Header extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.unlistenToHistory = null;
    this.state = {
      showSearchForm: false
    };
  }

  componentDidMount() {
    this.unlistenToHistory = this.props.history.listen(() => {
      this.updateStateFromLocation();
    });
    this.updateStateFromLocation();
  }

  componentWillUnmount() {
    this.unlistenToHistory();
    this.unlistenToHistory = null;
  }

  updateStateFromLocation() {
    const args = parseHistoryLocationPathname(this.props.history);
    if (this.unlistenToHistory && args.route === "search") {
      this.setState({ showSearchForm: true });
    }
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

        <Navbar.Group
          className={"search-container" + (showSearchForm ? "" : " hide")}
        >
          <SearchForm />
        </Navbar.Group>

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
          <Link to="/stats">
            <Button
              minimal="true"
              className="navbutton"
              icon="horizontal-bar-chart"
              text="Stats"
            />
          </Link>
          <Link to="/help">
            <Button
              minimal="true"
              className="navbutton"
              icon="help"
              text="Help"
            />
          </Link>
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

export default withRouter(Header);
