import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';

const selectOptions = {
  'Stationary Phase': 'Stationary Phase',
  'Log Phase': 'Log Phase',
};

const defaultState = {
  marks: {},
  numToNode: { 0: 0 },
  sliderLen: 100,
  columns: [],
};




function columnReducer(state = defaultState, action) {
	if (action === undefined) {
    return state;
  }

  switch (action.type) {

    case 'CREATE_COLUMNS': {

     let total_columns = {
      concentration: {
        dataField: 'concentration',
        text: 'Conc. (µM)',
      },

      error: {
        dataField: 'error',
        text: 'Error',
      },
      molecule: {
        dataField: 'name',
        text: 'Molecule',
        filter: textFilter(),

      },


    };


    let final_columns = []
    let desired_columns = action.payload
    console.log(desired_columns.length)
    for (var i = 0; i < desired_columns.length; i++) {
      console.log(desired_columns[i])
      final_columns.push(total_columns[desired_columns[i]])
    }
    console.log(final_columns)
    console.log("muffins")



      return {
        ...state,

        columns: final_columns,

      };
    }
    
    default: {
      return state;
    }
  }
}
export default columnReducer;