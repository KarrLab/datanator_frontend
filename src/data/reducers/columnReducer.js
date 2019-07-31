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


};




let taxonFilter = null;
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
          getFilter: filter => (taxonFilter = filter),
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

    for (var i = 0; i < desired_columns.length; i++) {
      console.log(desired_columns[i])
      final_columns.push(total_columns[desired_columns[i]])
    }



      return {
        ...state,

        //columns: final_columns,
        columns: final_columns,

      };
    }

    case 'FILTER_TAXON': {
    	console.log(taxonFilter)
    	taxonFilter({number: action.payload, comparator: Comparator.LE,})


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