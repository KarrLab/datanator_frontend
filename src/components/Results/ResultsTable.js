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
import { styles } from './ResultsTable.css';

const selectRow = {
  mode: 'checkbox',
  selected: [],
  onSelect: (row, isSelect, rowIndex, e) => {
    console.log(selectRow['selected']);
    row['selected'] = isSelect;
  },
  onSelectAll: (isSelect, rows, e) => {
    for (var i = rows.length - 1; i >= 0; i--) {
      rows[i]['selected'] = isSelect;
    }
  },
};

let tableRef = null;

const defaultSorted = [
  {
    dataField: 'taxonomic_proximity', // if dataField is not match to any column you defined, it will be ignored.
    order: 'asc', // desc or asc
  },
];

class ResultsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayed_data: [],
      table_size: 0,
      toggleLabel: 'Advanced',
    };
    this.correctlyRenderSelectRow = this.correctlyRenderSelectRow.bind(this);
    this.handleBasicToAdvancedToggle = this.handleBasicToAdvancedToggle.bind(
      this,
    );
  }

  setSelected() {
    let data = this.props.data;
    //this.setState({displayed_data:this.props.data})
    console.log(this.props.data);
    console.log('above');

    for (var i = data.length - 1; i >= 0; i--) {
      data[i]['key'] = i;
      selectRow['selected'].push(i);

      data[i]['selected'] = true;
    }

    this.setState({ displayed_data: data });
  }
  componentDidMount() {
    tableRef = this.node.table;
    this.setSelected();
  }

  componentDidUpdate(prevProps) {
    console.log('updating');
    if (this.props.data != prevProps.data) {
      this.setSelected();
      this.setState({ display_columns: this.props.columns });
    }
    console.log(this.state.displayed_data);
  }

  /**
   * At each render, the selectRow object must be reinitialized with the correct selections from the data.
   */
  correctlyRenderSelectRow() {
    let selected = [];
    for (var i = this.state.displayed_data.length - 1; i >= 0; i--) {
      if (this.state.displayed_data[i]['selected'])
        selected.push(this.state.displayed_data[i]['key']);
    }
    selectRow['selected'] = selected;
  }

  handleBasicToAdvancedToggle() {
    if (!this.state.advanced) {
      this.setState({ toggleLabel: 'Basic' });
    } else {
      this.setState({ toggleLabel: 'Advanced' });
    }

    this.setState({ advanced: !this.state.advanced });
  }

  render() {
    this.correctlyRenderSelectRow();

    let display_columns = this.props.columns;

    if (this.state.advanced) {
      display_columns = display_columns.concat(this.props.advanced_columns);
    }

    return (
      <div className="concTable2">
        <img src={require('~/images/result.png')} />
        <Button
          type="primary"
          onClick={event => this.handleBasicToAdvancedToggle()}
        >
          {' '}
          {this.state.toggleLabel}{' '}
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
            defaultSorted={defaultSorted}
          />
        </div>
      </div>
    );
  }
}

function getSelectedData(data) {
  let selected_data = [];
  console.log(data);
  console.log('newwww');
  console.log(tableRef);
  if (tableRef) {
    for (var i = tableRef.props.data.length - 1; i >= 0; i--) {
      if (tableRef.props.data[i].selected) {
        console.log('indeed');
        selected_data.push(tableRef.props.data[i]);
      } else {
        console.log('Indont');
      }
    }
  }
  return selected_data;
}

export { ResultsTable, getSelectedData };
