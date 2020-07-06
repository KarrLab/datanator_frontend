import React from "react";
import LazyLoad from "react-lazyload";
import "./Logo.scss";
import logo from "./logo.svg";

const Logo = () => {
  return (
    <div className="logo">
      <LazyLoad>
        <object
          data={logo}
          className="logo-image no-pointer-events"
          alt="Datanator logo"
          aria-label="Datanator logo"
        />
      </LazyLoad>
    </div>
  );
};
export { Logo };
