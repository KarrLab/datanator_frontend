import React from "react";
import logo from "./logo.svg";
const Logo = () => {
  return (
    <a href="/" className="logo-inner-container">
      <img src={logo} className="logo" alt="Datanator Logo" />
    </a>
  );
};
export { Logo };
