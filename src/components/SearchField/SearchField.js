import React, {Component} from 'react';
import {FormGroup, InputGroup, ControlGroup, Button} from "@blueprintjs/core";
class SearchField extends Component {
    constructor(props) {
        super(props)

        this.state = {
            type: props.type,
            name: props.name,
            dataSource: props.dataSource,
            value: props.default,
        }
    }

    render() {
        return(
            <ControlGroup fill='true'>
        <FormGroup inline="true"
        helperText= "Search for"
        label="test"
        labelFor="text-input"
        labelInfo="(required)"
        label="Species"
        labelFor="species-input"
        labelInfor="Required"    >
        <InputGroup id="metabolite-input" placeholder="Placeholder text" />
    </FormGroup>
    <FormGroup inline="true"
        helperText= "Search for"
        label="test"
        labelFor="text-input"
        labelInfo="(required)"
        label="Species"
        labelFor="species-input"
        labelInfor="Required"    >
        <InputGroup id="metabolite-input" placeholder="Placeholder text" />
    </FormGroup>
    <FormGroup inline="true"
    helperText= "Search for"
    label="test"
    labelFor="text-input"
    labelInfo="(required)"
    label="Species"
    labelFor="species-input"
    labelInfor="Required"    >
    <InputGroup id="metabolite-input" placeholder="Placeholder text" />
</FormGroup>
<Button icon="filter">Filter</Button>
    </ControlGroup>
        );
        

}}

export {SearchField};