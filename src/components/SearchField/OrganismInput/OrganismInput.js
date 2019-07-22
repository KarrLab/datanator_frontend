import React from "react";
import {FormGroup, InputGroup, MenuItem} from "@blueprintjs/core";
import {Suggest} from "@blueprintjs/select";


const inputValueRenderer = (item)=> {
    return( {item}
    );
}

const filter = (query) => {

}
const items =["hello", "world", "this", "is", "a'", "test"];
const itemRenderer = (item, {handleClick, Modifiers}) => {

    return (
      
            <MenuItem
            //active={Modifiers.active}
            Key={item}
            onclick={handleClick}
            text= {item} />
        );


}

const OrganismInput = () => {
    return(
        <FormGroup 
            helperText= "Select a species from which to get data"
            label="Species"
            labelFor="species-input"
            labelInfo="(required)">
            <Suggest 
                itemRenderer={itemRenderer} 
                items={["hello", "world", "this", "is", "a'", "test"]}
                inputValueRenderer={inputValueRenderer}
                id="species-input" 
                placeholder="Escherichia coli" />
        </FormGroup>
    );
};

export{OrganismInput};