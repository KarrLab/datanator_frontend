import React from 'react'
import logo from './logo.svg'
function Logo(props){
    return(
        <div className= "logo">
            <img src={logo} width={props.width} height={props.height} className= "logo-image" alt="Datanator Logo"/>
        </div>
    );
}
export {Logo};