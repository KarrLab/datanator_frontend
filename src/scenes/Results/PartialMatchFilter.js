import React, {Component} from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import store from '~/data/Store';



function getLineage(){
  return(this.getCurrentStateFromStore().results.taxon_lineage)
}


class PartialMatchFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };

        this.valueGetter = this.props.valueGetter;

        this.onChange = this.onChange.bind(this);
    }

    isFilterActive() {
        return this.state.text !== null && this.state.text !== undefined && this.state.text !== '';
    }

    doesFilterPass(params) {
        return this.state.text.toLowerCase()
            .split(" ")
            .every((filterWord) => {
                return this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
            });
    }

    getModel() {
        return {value: this.state.text};
    }

    setModel(model) {
        this.state.text = model ? model.value : '';
    }

    afterGuiAttached(params) {
        this.focus();
    }

    focus() {
        window.setTimeout(() => {
            let container = ReactDOM.findDOMNode(this.refs.input);
            if (container) {
                container.focus();
            }
        });
    }

    componentMethod(message) {
        alert(`Alert from PartialMatchFilterComponent ${message}`);
    }
    componentMethod2(lineage) {
        console.log(lineage);
    }
    onChange(event) {
      console.log(store.getState().results.taxon_lineage)
      console.log(this)
      console.log(this.props.agGridReact.props.lineage)
        let newValue = event.target.value;
        if (this.state.text !== newValue) {
            this.setState({
                text: newValue
            }, () => {
                this.props.filterChangedCallback();
            });

        }
    }

    render() {
        let style = {
            border: "2px solid #22ff22",
            borderRadius: "5px",
            backgroundColor: "#bbffbb",
            width: "200px",
            height: "50px"
        };

        return (
            <div style={style}>Filter: <input style={{height: "20px"}} ref="input" value={this.state.text}
                                              onChange={this.onChange} className="form-control"/></div>
        );
    }
};
export default PartialMatchFilter