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

let defaultState = {
  marks: {},
  numToNode: { 0: 0 },
  sliderLen: 100,
  columns: [],
  a_taxon_filter: null,
  new_taxon_filter: null,
  b_taxon_filter:numberFilter({
          placeholder: 'custom placeholder',
          defaultValue: { comparator: Comparator.LE, number: 1000 }, //ref:this.node,
          getFilter: filter => ( defaultState.a_taxon_filter = filter, console.log(filter),console.log("ddd")),
        }),



  test_col : [ {
        dataField: 'taxonomic_proximity',
        text: 'Taxonomic Distance',

        headerStyle: (colum, colIndex) => {
          return { width: '40px', textAlign: 'left' };
        },

        filter: numberFilter({
          placeholder: 'custom placeholder',
          defaultValue: { comparator: Comparator.LE, number: 1000 }, //ref:this.node,
          getFilter: filter => (defaultState.taxon_filter = filter),
        }),
        sort: true,
      },]









};


console.log(defaultState)

function setTaxonFilter(filter, state = defaultState){
	console.log("Blue")
	console.log(filter)
	return {
        ...state,
        new_taxon_filter: filter
    }
    
}
let innerFilter = null;
function columnReducer(state = defaultState, action) {
	if (action === undefined) {
    return state;
  }

  switch (action.type) {

    case 'CREATE_COLUMNS': {

     let temp_taxon_filter = null

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
      organism: {
        dataField: 'organism',
        text: 'Organism',
        filter: textFilter(),
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
          getFilter: filter => ( setTaxonFilter(filter=filter), innerFilter = filter, console.log(filter),console.log("ddd")),
        }),
        sort: true,
      },

      growth_phase: {
        dataField: 'growth_phase',
        text: 'Growth Phase',
        formatter: cell => selectOptions[cell],
        filter: selectFilter({
          options: selectOptions,
        }),
      },

      growth_conditions: {
        dataField: 'growth_conditions',
        text: 'Conditions',
        filter: textFilter(),
      },
      growth_media: {
        dataField: 'growth_media',
        text: 'Media',
        filter: textFilter(),
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


    let final_columns = []
    let desired_columns = action.payload
    console.log(desired_columns.length)
    for (var i = 0; i < desired_columns.length; i++) {
      console.log(desired_columns[i])
      final_columns.push(total_columns[desired_columns[i]])
    }
    console.log(final_columns)
    console.log("muffins")
    console.log(temp_taxon_filter)



      return {
        ...state,

        //columns: final_columns,
        columns: final_columns,
        new_taxon_filter: defaultState["new_taxon_filter"]

      };
    }

    case 'FILTER_TAXON': {
    	console.log(innerFilter)
    	innerFilter({number: 2, comparator: Comparator.LE,})

    	/*
    	state.a_taxon_filter({number: 2, comparator: Comparator.LE,})
    	console.log(state.columns)
    	console.log(state.columns[4])
    	state.columns[4].filter.Filter.number = action.payload
    	//console.log(state.columns[0]["filter"]["Filter"])
    	//console.log(state.columns[0]["filter"]["Filter"])
    	console.log(action.payload)
    	
    	//state.columns[0]["filter"].props.number = action.payload
    	
    	//state.columns[0]["filter"]["Filter"].getFilter()({
	    //  number: action.payload,
	    //  comparator: Comparator.LE,
	    //})
	    let filter = state.columns[4]["filter"].props.getFilter()
	    console.log(filter)
	    //filter({number: 2, comparator: Comparator.LE,})
	    console.log(state.columns[4]["filter"].props.getFilter)
	    //state.columns[0]["filter"].props.getFilter()
	    //.then(new_filter => {filter=new_filter})
	    //filter({
	    //  number: action.payload,
	     // comparator: Comparator.LE,
	    //})
	    //filter()
	    console.log(state.columns[4]["filter"])
    	//console.log(state.columns[0]["filter"]["Filter"])
    	//let filter = state.columns[0]["filter"]["getFilter"]()//.getFilter()
    	//console.log(filter)

    	let a = ({
	      number: action.payload,
	      comparator: Comparator.LE,
	    });
	    */
      }
      
      return {
        ...state,
        taxon_filter: state.taxon_filter
    }
    
    default: {
      return state;
    }
  }
}
export default columnReducer;