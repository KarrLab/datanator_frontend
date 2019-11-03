import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
//import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory from 'react-bootstrap-table2-filter';

import { Button } from 'antd';
import PropTypes from 'prop-types';
import {
  getTotalColumns,
  hide_columns,
  reveal_columns,
} from '~/data/actions/resultsAction';
import { connect } from 'react-redux';

/**
 * Constant to keep track of the checkboxes in the table
 */
const selectRow = {
  mode: 'checkbox',
  selected: [],
  onSelect: (row, isSelect, rowIndex, e) => {
    row['selected'] = isSelect;
  },
  onSelectAll: (isSelect, rows, e) => {
    for (var i = rows.length - 1; i >= 0; i--) {
      rows[i]['selected'] = isSelect;
    }
  },
};


/**
 * Variable to allow direct access to the table
 */
let tableRef = null;

/**
 * Constant to make default table sorting based on proximity
 */
const defaultSorted = [
  {
    dataField: 'taxonomic_proximity', // if dataField is not match to any column you defined, it will be ignored.
    order: 'asc', // desc or asc
  },
];



/**
 * Class to render the results. This table uses react-bootsrap-table2, but adds three additional pieces of functionality
 * 1) The ability to specify basic and advanced columns, and to toggle between them
 * 2) The addition of a column which allows selection/rejection of data
 * 3) The table keeps track of which data is both displayed and selected. This later gets used to calculated the consensus
 *
 * This file also contains a function which returns the current seleclted data --getSelectedData().
 * This is required to get the current displayed and selected data to calculate the consensus.
 * The reason this exists as a function here (as opposed to in a parent class) is because the information about
 * which data are displayed exists in the react-bootrsap-table2 component, and can only be accessed by a ref.
 */

@connect(store => {
  return {
    totalData: store.results.totalData,
    col_list: store.results.column_list,
  };
})
class ResultsTable extends Component {
  static propTypes = {
    
    /** 
     *REDUX: The data must be a list of dictionaries. Each dictionary cooresponds a single row. Each key is the proper column,
     * and each value gets entered into the corresponding cell.
     * For example:
     * data = [
     *   { name: "Adenosine triphosphate", concentration: 4150, units: "uM"},
     *   { name: "Adenosine triphosphate", concentration: 3829, units: "uM"},
     * ]
     * after that, you would need to set the total data in the redux state. For example:
     * this.props.dispatch(setTotalData(data))
     */
    totalData: PropTypes.array.isRequired,

    /** 
     *REDUX: This is a list of strings corresponding to a the column names
     *  For example:
     *    col_list = ['concentration', 'error', 'molecule']
     *  This value is set in Redux state)
     */
    col_list: PropTypes.array.isRequired,


    /** 
     *This must be a list of columns that can be used in a react-bootstrap-table2 table. The docs for that can be
     * found here - https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/getting-started.html
     *
     * This is used to define the columns that show up in the table. Each column represented as a dictionary with
     * at least two key:value pairs -- dataField, to the column id; text, to what its title will be upon rendering.
     * For example
     * {
     *   dataField: 'concentration',
     *   text: 'Concentration',
     * }
     * The dataField id in the columns list must correspond to a key in the data list.
     */
    basic_columns: PropTypes.array.isRequired,

    /** Optional advanced columns that can be added*/
    advanced_columns: PropTypes.array,

    /** Other optional columns that can be added*/
    optional_columns: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
    /** 
     * This must be a list of rows. It keeps track of which data is displayed.
     * This is important to know becuase certain functions, like get consensus, require knowledge
     * of which values are displayed
     */
      displayed_data: [],

    /** 
     * Value to keep track of whether advanced columns are displayed
     */
      toggleLabel: 'Advanced',
    };
    this.correctlyRenderSelectRow = this.correctlyRenderSelectRow.bind(this);
    this.setTable = this.setTable.bind(this);
    this.setPotentialColumns = this.setPotentialColumns.bind(this);
    this.handleBasicToAdvancedToggle = this.handleBasicToAdvancedToggle.bind(this);
  }

  /**
   * The table begins with all the data points being selected. This selects them all.
   */
  setSelected() {
    let data = this.props.totalData;

    for (var i = data.length - 1; i >= 0; i--) {
      data[i]['key'] = i;
      selectRow['selected'].push(i);

      data[i]['selected'] = true;
    }

    this.setState({ displayed_data: data });
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
   * Toggle back and forth between basic and advanced columns
   */
  handleBasicToAdvancedToggle() {
    if (!this.state.advanced) {
      this.setState({ toggleLabel: 'Basic' });
      this.props.dispatch(reveal_columns(this.props.advanced_columns));
    } else {
      this.setState({ toggleLabel: 'Advanced' });
      this.props.dispatch(hide_columns(this.props.advanced_columns));
    }

    this.setState({ advanced: !this.state.advanced });
  }

  componentDidMount() {
    this.setTable();
  }

  setTable() {
    this.props.dispatch(
      getTotalColumns(
        this.props.basic_columns.concat(this.props.advanced_columns).concat(Object.keys(this.props.potential_columns)),
      ),
    );
    let col_to_hide = this.props.advanced_columns
    for (const [key, value] of Object.entries(this.props.potential_columns)) {
      if (!value){
        col_to_hide.push(key)
      }
    }
  
    this.props.dispatch(hide_columns(col_to_hide));
    if (typeof this.node !== 'undefined') {
      tableRef = this.node.table;
    }
    if (this.props.totalData != null) {
      this.setSelected();
    }
  }

  setPotentialColumns(){
    let rev_col = []
    let hid_col = []
    for (const [key, value] of Object.entries(this.props.potential_columns)) {
          if (value){
            rev_col.push(key)
          }
        else{
          hid_col.push(key)
        }
    }
    this.props.dispatch(reveal_columns(rev_col))
    this.props.dispatch(reveal_columns(hid_col))
  }

  componentDidUpdate(prevProps) {
    if (this.props.totalData !== prevProps.totalData) {
      this.setSelected();
    }
    if (!compare(this.props.potential_columns, prevProps.potential_columns)) {
      console.log(this.props.potential_columns)
      console.log(prevProps.potential_columns)
      this.setPotentialColumns()
  }

    if (typeof this.node !== 'undefined') {
      tableRef = this.node.table;
    }
  }

  render() {
    console.log("Rendering ResultsTable")
    this.correctlyRenderSelectRow();

    return (
      <div className="concTable2">
        <img src={require('~/images/result.png')} alt="results" />
        <Button
          type="primary"
          onClick={event => this.handleBasicToAdvancedToggle()}
        >
          {' '}
          {this.state.toggleLabel}{' '}
        </Button>


        <div className="bootstrap" data-testid = "test_table">
          {(this.props.col_list.length > 0) && (
            <BootstrapTable
              ref={n => (this.node = n)}
              striped
              hover
              keyField="key"
              data={this.props.totalData}
              columns={this.props.col_list}
              filter={filterFactory()}
              selectRow={selectRow}
              defaultSorted={defaultSorted}
            />
          )}
        </div>
      </div>
    );
  }
}

/**
 * This returns the data that is both displayed (not filtered out) and selected.
 */
function getSelectedData() {
  let selected_data = [];
  if (tableRef) {
    for (var i = tableRef.props.data.length - 1; i >= 0; i--) {
      if (tableRef.props.data[i].selected) {
        selected_data.push(tableRef.props.data[i]);
      }
    }
  }
  return selected_data;
}


function compare(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export { ResultsTable, getSelectedData };
