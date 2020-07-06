import React from "react";
import "./Logo.scss";
import logo from "./logo.svg";

const Logo = () => {
  return (
    <div className="logo">
      <object
        data={logo}
        className="logo-image no-pointer-events"
        alt="Datanator logo"
        aria-label="Datanator logo"
      />
    </div>
  );
};
export { Logo };
