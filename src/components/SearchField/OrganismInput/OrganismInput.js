import React from "react";
import {FormGroup, InputGroup, MenuItem} from "@blueprintjs/core";
import {Suggest} from "@blueprintjs/select";

<<<<<<< HEAD
//"@"connect()
=======
import {connect} from "react-redux";
import {getData} from "~/data/actions/organismAction";

@connect((store) =>{
    return{
        organisms: store.organisms.organismList,
        organismsFetched: store.organisms.fetched,
        organismsFetching: store.organisms.fetching,
        organismsError: store.organisms.error
    };
})
>>>>>>> c932e9c... Use store to pull organism list
class OrganismInput extends React.Component{
    componentDidMount(){
        this.props.dispatch(getData());

    }
    render(){
        return(
            <FormGroup 
                helperText= "Select a species from which to get data"
                label="Species"
                labelFor="species-input"
                labelInfo="(required)">
                <Suggest 
                    itemRenderer={this.itemRenderer} 
                    items={this.props.organisms}
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