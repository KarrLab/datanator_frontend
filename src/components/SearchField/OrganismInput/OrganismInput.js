import React from "react";
import {FormGroup, InputGroup, MenuItem} from "@blueprintjs/core";
import {Suggest} from "@blueprintjs/select";
import {GetSearchData} from "~/services/MongoApi.js";
import {connect} from "react-redux";

//"@"connect()
class OrganismInput extends React.Component{
    render(){
        return(
            <FormGroup 
                helperText= "Select a species from which to get data"
                label="Species"
                labelFor="species-input"
                labelInfo="(required)">
                <Suggest 
                    itemRenderer={this.itemRenderer} 
                    items={["hello", "world", "this", "is", "a'", "test"]}
                    inputValueRenderer={this.inputValueRenderer}
                    id="species-input" 
                    placeholder="Escherichia coli" />
            </FormGroup>
        );}

    inputValueRenderer(item){
        return( {item} );
    }

    filter(query){
    };

    itemRenderer = (item, {handleClick, Modifiers}) => {

        return (
      
            <MenuItem
            //active={Modifiers.active}
                Key={item}
                onclick={handleClick}
                text= {item} />
        );


    };
}



export{OrganismInput};