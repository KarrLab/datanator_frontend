import React, { Component } from 'react';
import {Button} from 'antd';
class SideButton extends Component {
    state={
        open: false,
    };
    render(){
    return (
        <button>
            <Button
                type ="link"
                icon ="menu" 
                size = "large"
                >
                </Button>

        </button>        
    )
    }
}
export{SideButton}