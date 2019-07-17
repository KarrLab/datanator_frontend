import React, {
    Component
} from 'react'
import {
    Input,
    AutoComplete,
} from 'antd';
import 'antd/dist/antd.css';

const InputGroup = Input.Group;

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

        if(this.state.type=="AutoComplete"){
            return (
                <div className= "Search Field">
               
                <AutoComplete
                dataSource={this.state.dataSource}
                defaultValue={this.props.default}
                style={{ width: '30%' }}
                onSelect={inputValue => { this.setState({ value: inputValue })}}
                addonBefore="Organism"
                label="organism"
                placeholder="Autocomplete here"
                onChange={inputValue => { this.setState({ value: inputValue })}}
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}>
                </AutoComplete>
                </div>
            )
        }
        if (this.state.type=="Input"){
            return(
                <div className = "Search Field">
                    <Input
                    defaultValue={this.state.default}
                    style={{ width: '30%' }}
                    onSelect={inputValue => { this.setState({ value: inputValue })}}
                    addonBefore="Organism"
                    label="organism"
                    placeholder="input here"
                    onChange={inputValue => { this.setState({ value: inputValue })}}
                      >
                          </Input>
                </div>
            )
        }   
    }
}

export {SearchField}