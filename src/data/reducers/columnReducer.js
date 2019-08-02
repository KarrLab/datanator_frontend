import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
import ReactDOM from 'react-dom';



const selectOptions = {
  'Stationary Phase': 'Stationary Phase',
  'Log Phase': 'Log Phase',
};

let defaultState = {
  marks: {},
  numToNode: { 0: 0 },
  sliderLen: 100,
  columns: {},
  column_list:[],
  displayed_columns:[],
  taxon_lineage:null,
  permanent_taxon_filter:null,


};


let taxonFilter;

let filters = {}

const total_columns = {
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
        filter: textFilter({getFilter: filter => (filters["molecule"] = filter)}),
      },
      organism: {
        dataField: 'organism',
        text: 'Organism',
        filter: textFilter({getFilter: filter => (filters["organism"] = filter)}),
      },

      taxonomic_proximity: {
        dataField: 'taxonomic_proximity',
        text: 'Taxonomic Distance',

        headerStyle: (colum, colIndex) => {
          return { width: '40px', textAlign: 'left' };
        },

        filter: numberFilter({
          placeholder: 'custom placeholder',
          defaultValue: { comparator: Comparator.LE, number: 1000 }, //ref:this.node,
          getFilter: filter => (taxonFilter = filter),
        }),
        sort: true,
      },

      growth_phase: {
        dataField: 'growth_phase',
        text: 'Growth Phase',
        formatter: cell => selectOptions[cell],
        filter: selectFilter({
        getFilter: filter => (filters["growth_phase"] = filter),
          options: selectOptions,
        }),
      },

      growth_conditions: {
        dataField: 'growth_conditions',
        text: 'Conditions',
        filter: textFilter({getFilter: filter => (filters["growth_conditions"] = filter)}),
      },
      growth_media: {
        dataField: 'growth_media',
        text: 'Media',
        filter: textFilter({
        	getFilter: filter => (filters["growth_media"] = filter)
        }),
        //hidden: true,
      },

      tanitomo: {
        dataField: 'tanitomo_similarity',
        text: 'Tanitomo Score',
        headerStyle: (colum, colIndex) => {
          return { width: '20px', textAlign: 'left' };
        },
        filter: numberFilter({
          placeholder: 'custom placeholder',
          defaultValue: { comparator: Comparator.GE, number: 0.5 }, //ref:this.node,
          getFilter: filter => (this.tanitomo_filter = filter),
        }),
      },
    };

//let taxonFilter = null;
function columnReducer(state = defaultState, action) {
	if (action === undefined) {
    return state;
  }

  switch (action.type) {

    case 'CREATE_COLUMNS': {
     //let taxonFilter;

     let temp_taxon_filter = null


    let final_columns = {}
    let final_column_list = []
    let desired_columns = action.payload

    for (var i = 0; i < desired_columns.length; i++) {
      console.log(desired_columns[i])
      //total_columns[desired_columns[i]].ref = desired_columns[i]
      if ('filter' in total_columns[desired_columns[i]]){
      	total_columns[desired_columns[i]].filter["getFilter"] = filter => (filters[desired_columns[i]] = filter)
  		}
      final_columns[desired_columns[i]] = total_columns[desired_columns[i]]
      
      final_column_list.push(total_columns[desired_columns[i]])
      //final_columns.push(total_columns[desired_columns[i]])
    }
    console.log(filters)


      return {
        ...state,

        //columns: final_columns,
        columns: final_columns,
        column_list: final_column_list,
        permanent_taxon_filter: taxonFilter

      };
    }

    case 'FILTER_TAXON': {
    	//console.log(taxonFilter)

    	taxonFilter({number: action.payload, comparator: Comparator.LE,})
    	console.log(filters)
    	filters["growth_media"]("")
    	return {
        ...state,
    }
      }

    case 'REMOVE_COLUMNS': {
    	//console.log(taxonFilter)

    	let list_col_names = action.payload
    	let new_columns = state.columns;
    	for (var i = 0; i < list_col_names.length; i++) {
	      delete new_columns[list_col_names[i]]
	    } 
    	return {
        ...state,

        columns:new_columns
    }
      }

    case 'APPEND_COLUMNS': {
    	//console.log(taxonFilter)

    	return {
        ...state,
    }
      }

    case 'SET_DISPLAYED_COLUMNS': {
    	let list_col_names = action.payload
    	let to_display_columns = [];
	    for (var i = 0; i < list_col_names.length; i++) {
	     //new_col = state.columns[list_col_names[i]]
	      to_display_columns.push(state.columns[list_col_names[i]])
	    } 

    	return {
        ...state,

        displayed_columns:to_display_columns,
    }
      }

    case 'HIDE_COLUMNS': {
    	let list_col_names = action.payload
    	let to_display_columns = [];
	    for (var i = 0; i < list_col_names.length; i++) {
	    	state.columns[list_col_names[i]].hidden = true
	    	console.log(state.columns[list_col_names[i]].ref)//.cleanFiltered()
	    	if (list_col_names[i] in filters){
	    		filters[list_col_names[i]]("")
	    	}
	    //console.log(ReactDOM.findDOMNode("growth_phase"))
	    //console.log(this.refs.growth_phase)
	    //refs.new_ref.cleanFiltered()
	    } 

    	return {
        ...state,

    }
      }

    case 'REVEAL_COLUMNS': {
    	let list_col_names = action.payload
    	let to_display_columns = [];
	    for (var i = 0; i < list_col_names.length; i++) {
	     state.columns[list_col_names[i]].hidden = false
	    } 


    	return {
        ...state,

    }
      }

    case 'SET_LINEAGE': {
    	return {
        ...state,

        taxon_lineage:action.payload
    }
      }

    
    default: {
      return state;
    }
  }
}
export default columnReducer;