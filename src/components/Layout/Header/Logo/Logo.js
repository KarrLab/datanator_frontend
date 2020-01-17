import React from "react";
import { Link } from "react-router-dom";
import "./Logo.scss";
import logo from "./logo.svg";
const Logo = () => {
  return (
    <Link to="/" className="logo">
      <img src={logo} className="logo-image" alt="Datanator Logo" />
    </Link>
  );
};
export { Logo };
