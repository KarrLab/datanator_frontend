import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
import ReactDOM from 'react-dom';
import {
  Input,
  Col,
  Row,
  Select,
  InputNumber,
  DatePicker,
  AutoComplete,
  Cascade,
  Button,
} from 'antd';
import Chart3 from './Chart3.js';
import {styles} from './ResultsTable.css';


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


let tableRef = null

class ResultsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayed_columns: [],
      displayed_data: [],
      table_size: 0,
    };
  }

  setSelected(){
    this.setState({displayed_data:this.props.data})
    console.log(this.props.data)
    console.log("above")

    for (var i = this.state.displayed_data.length - 1; i >= 0; i--) {
        this.state.displayed_data[i]["key"] = i;
        selectRow["selected"].push(i);
        this.state.displayed_data[i]["selected"] = true;
    }
  }
  componentDidMount() {
    this.props.getTableRef(this.node.table);
    tableRef = this.node.table
    this.setSelected()
  }


  componentDidUpdate (prevProps) {
      console.log("updating");
      if (this.props.data != prevProps.data){
          this.setSelected()
      }
  }






  render() {
    console.log('woot woot');
    console.log(this.props.data)

    let selected = [];
    console.log(this.state.displayed_data)
    for (var i = this.state.displayed_data.length - 1; i >= 0; i--) {
      if (this.state.displayed_data[i]['selected'])
        selected.push(this.state.displayed_data[i]['key']);
    }
    selectRow['selected'] = selected;

    let display_columns;

    display_columns = this.props.columns;

    let selected_data = [];
    for (var i = this.state.displayed_data.length - 1; i >= 0; i--) {
      if (this.state.displayed_data[i].selected) {
        selected_data.push(this.state.displayed_data[i]);
      }
    }

    let b_title;

    let next;
    if (!this.state.advanced) {
      b_title = 'Advanced';
      next = true;
    } else {
      b_title = 'Basic';
      display_columns = display_columns.concat(this.props.advanced_columns);
      console.log(display_columns);
      next = false;
    }

    return (
      <div className="concTable2">
        <img src={require('~/images/result.png')} />
        <Button
          type="primary"
          onClick={event => this.setState({ advanced: next })}
        >
          {' '}
          {b_title}{' '}
        </Button>

        <div className="bootstrap">
          <BootstrapTable
            ref={n => (this.node = n)}
            striped
            hover
            keyField="key"
            data={this.props.data}
            columns={display_columns}
            filter={filterFactory()}
            selectRow={selectRow}
          />
        </div>
      </div>
    );
  }
}


function getSelectedData(data) {
  let selected_data = [];
  console.log(data)
  console.log("newwww")
  console.log(tableRef)
  if (tableRef){

    for (var i = tableRef.props.data.length - 1; i >= 0; i--) {
      if (tableRef.props.data[i].selected){
        console.log("indeed")
        selected_data.push(tableRef.props.data[i]);
      }
      else{
        console.log("Indont")
      }
    }
  }
  let return_data=selected_data
  return (selected_data);
}


export { ResultsTable, getSelectedData };
