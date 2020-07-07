import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";
import { Button } from "@blueprintjs/core";
import { parseHistoryLocationPathname } from "~/utils/utils";

import "./Header.scss";
import { Logo } from "./Logo/Logo";
import SearchForm from "~/components/SearchForm/SearchForm";

class Header extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.unlistenToHistory = null;
    this.state = {
      showSearchForm: false,
    };
  }

  componentDidMount() {
    this.unlistenToHistory = this.props.history.listen(() => {
      this.updateStateFromLocation();
    });
    this.updateStateFromLocation();
  }

  /* istanbul ignore next */
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
      <div className="header-component" id="top">
        <Link to="/" className="logo-title-container">
          <Logo />
          <div className="titles">
            <div className="title">Datanator</div>
            <div className="subtitle">Data for modeling cells</div>
          </div>
        </Link>

        <div className={"search-container" + (showSearchForm ? "" : " hide")}>
          <SearchForm />
        </div>

        <div className="page-links">
          <Button
            minimal="true"
            className="icon-button page-link-search"
            icon={searchIcon}
            text={searchText}
            onClick={() =>
              this.setState({ showSearchForm: !this.state.showSearchForm })
            }
          />
          <HashLink scroll={scrollTo} to="/help/#tutorial">
            <Button
              minimal="true"
              className="icon-button"
              icon="star"
              text="Getting started"
            />
          </HashLink>
          <Link to="/help/">
            <Button
              minimal="true"
              className="icon-button"
              icon="help"
              text="Help"
            />
          </Link>
          <Link to="/stats/">
            <Button
              minimal="true"
              className="icon-button"
              icon="horizontal-bar-chart"
              text="Stats"
            />
          </Link>
          <Link to="/about/">
            <Button
              minimal="true"
              className="icon-button"
              icon="info-sign"
              text="About"
            />
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
