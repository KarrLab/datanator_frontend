import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

export default class Footer extends Component {
  render() {
    return (
      <div className="footer-component">
        <span className="footer-item">
          &copy;2019-2020&nbsp;
          <a
            href="https://www.karrlab.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Karr Lab
          </a>
        </span>
        <span className="footer-item">
          <Link to="/stats">Stats</Link>
        </span>
        <span className="footer-item">
          <Link to="/help">Help</Link>
        </span>
        <span className="footer-item">
          <Link to="/about">About</Link>
        </span>
        <span className="footer-item">
          <a href="mailto:info@karrlab.org" subject="Datanator">
            Contact us
          </a>
        </span>
      </div>
    );
  }
}
