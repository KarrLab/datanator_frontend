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
import PropTypes from 'prop-types';

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


/**
 * Class to render the results. This table uses react-bootsrap-table2, but adds three additional pieces of functionality 
 */
let propTypes={data: PropTypes.string,}
class ResultsTable extends Component {
  static propTypes = {
    /** The data must be a list of dictionaries. Each dictionary cooresponds a single row. Each key is the proper column,
    and each value gets entered into the corresponding cell. 
    For example:
    data = [
      { name: "Adenosine triphosphate", concentration: 4150, units: "uM"},
      { name: "Adenosine triphosphate", concentration: 3829, units: "uM"},
    ]
    */
    data: PropTypes.array.isRequired,


    /** This must be a list of columns that can be used in a react-bootstrap-table2 table. The docs for that can be 
    found here - https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/getting-started.html

    This is used to define the columns that show up in the table. Each column represented as a dictionary with 
    at least two key:value pairs -- dataField, to the column id; text, to what its title will be upon rendering. 
    For example
    {
      dataField: 'concentration',
      text: 'Concentration',
    }
    The dataField id in the columns list must correspond to a key in the data list. 
     */
    columns: PropTypes.array.isRequired,

    /** Optional advanced columns that can be added*/
    advanced_columns: PropTypes.array,
  }

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

  /**
   * At each render, the selectRow object must be reinitialized with the correct selections from the data.
   */
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

  /**
   * At each render, the selectRow object must be reinitialized with the correct selections from the data.
   */
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

/*
ResultsTable.propTypes = {
  data: PropTypes.number
};*/
export { ResultsTable, getSelectedData };
