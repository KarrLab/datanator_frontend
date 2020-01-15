import React from 'react';
import logo from './logo.png';
const Logo = props => {
  return (
    <div className="logo">
      <a href="/">
        <img
          src={logo}
          //className="logo-image"
          alt="Datanator Logo"
        />
      </a>
    </div>
  );
};
export { Logo };
