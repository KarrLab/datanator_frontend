import React, {Component} from "react";
import {ControlGroup, Button} from "@blueprintjs/core";

import {MetaboliteInput} from "./MetaboliteInput";

class SearchField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: props.type,
            name: props.name,
            dataSource: props.dataSource,
            value: props.default,
        };
    }

    render() {
        return(
            <ControlGroup fill='true'>
                <MetaboliteInput/>
                <Button icon="filter">Filter</Button>
            </ControlGroup>
        );
        

    }}
export {SearchField};