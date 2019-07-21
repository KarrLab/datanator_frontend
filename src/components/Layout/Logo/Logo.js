import React from 'react'
import logo from './logo.svg'
const Logo= (props) => {
    return(
        <div className= "logo">
            <a href="/"><img src={logo} padding="0" height="100%" className= "logo-image" alt="Datanator Logo"/></a>
        </div>
    );
};
export {Logo};