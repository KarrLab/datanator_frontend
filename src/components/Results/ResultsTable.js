
import React, {
    Component
} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import filterFactory, {
    textFilter,
    selectFilter,
    numberFilter,
    Comparator
} from "react-bootstrap-table2-filter";
import ReactDOM from "react-dom";
import {
    Input,
    Col,
    Row,
    Select,
    InputNumber,
    DatePicker,
    AutoComplete,
    Cascade,
    Button
} from "antd";
import "antd/dist/antd.css";
import Chart3 from "./Chart3.js";
import { Slider } from "antd";
import { withRouter } from "react-router";

import './ResultsTable.css';






const selectRow = {
    mode: "checkbox",
    selected: [],
    onSelect: (row, isSelect, rowIndex, e) => {
  		console.log(selectRow["selected"]);
  		row["selected"] = isSelect;

    },
    onSelectAll: (isSelect, rows, e) => {

        for (var i = rows.length - 1; i >= 0; i--){
            rows[i]["selected"] = isSelect;
        }
    },
};




class ResultsTable extends Component {
	constructor(props) {
        super(props);


        this.state = {
        	displayed_columns:[],
            displayed_data:[],
            table_size:0
        }


    }
    componentDidMount(){
    	this.props.recordDisplayedData(this.node.table)
    }

    ooooo_componentDidUpdate(prevProps, prevState) {
    	console.log(this.state.table_size)
    	console.log(this.node.table.props.data.length)
    	 if (prevState.table_size !== this.node.table.props.data.length) {
    	 	this.setState({table_size:this.node.table.props.data.length})
	    	let selected_data = []
	    	let post_filtered_data = this.node.table.props.data;
	    	for (var i = post_filtered_data.length - 1; i >= 0; i--) {
			  	if (post_filtered_data[i].selected){
			  		selected_data.push(post_filtered_data[i]);
			  	}
			  }

			this.props.recordDisplayedData(selected_data)
			//this.setState({displayed_data:selected_data})
		}



    }


    render() {
    	console.log("woot woot")

        let selected = [];
        for (var i = this.props.data.length - 1; i >= 0; i--) {
            if (this.props.data[i]["selected"])
                selected.push(this.props.data[i]["key"]);
        }
        selectRow["selected"] = selected;

        let display_columns;

        display_columns = this.props.columns;


        let selected_data = [];
		  for (var i = this.state.displayed_data.length - 1; i >= 0; i--) {
		  	if (this.state.displayed_data[i].selected){
		  		selected_data.push(this.state.displayed_data[i]);
		  	}
		  }



        let b_title;
		
        let next;
        if (!this.state.advanced){
            b_title = "Advanced";
            next = true;
        }
        else{
            b_title = "Basic";
            display_columns = display_columns.concat(this.props.advanced_columns);
            console.log(display_columns);
            next=false;
        }




	 


        return (

		      <div className="concTable2" >
		      	<img src={require("~/images/result.png")} />
		      	<Button type="primary" onClick={(event)=>this.setState({advanced:next})}> {b_title} </Button>


		      	<div className="bootstrap" >
		        <BootstrapTable 
		        ref={ n => this.node = n }
		        striped
		        hover
		        keyField='key' 
		        data={ this.props.data } 
		        columns={ display_columns }
		        filter={ filterFactory() }
		        selectRow={ selectRow}

		     />
		     </div>


		     </div>
		)
    }
}

export {ResultsTable};



