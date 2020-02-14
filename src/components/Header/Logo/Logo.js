import React from "react";
import { Link } from "react-router-dom";
import LazyLoad from "react-lazyload";
import "./Logo.scss";
import logo from "./logo.svg";

const Logo = () => {
  return (
    <Link to="/" className="logo">
      <LazyLoad>
        <object
          data={logo}
          className="logo-image no-pointer-events"
          alt="Datanator logo"
          aria-label="Datanator logo"
        />
      </LazyLoad>
    </Link>
  );
};
export { Logo };
