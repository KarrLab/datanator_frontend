import React from 'react';
import logo from './logo.svg';
const Logo = props => {
  return (
    <a href="/" className="logo">
      <img
        src={logo}
        className="logo-image"
        alt="Datanator Logo"
      />
    </a>
  );
};
export { Logo };
