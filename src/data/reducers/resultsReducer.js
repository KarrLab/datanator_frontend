import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
import ReactDOM from 'react-dom';
import { getSelectedData } from '~/components/Results/components/ResultsTable.js';

const selectOptions = {
  'Stationary Phase': 'Stationary Phase',
  'Log Phase': 'Log Phase',
};

export const defaultState = {
  columns: {},
  column_list: [],
  taxon_lineage: null,
  totalData: null,
  selectedData: null,
};

let taxonFilter;

let filters = {};

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
    filter: textFilter({ getFilter: filter => (filters['molecule'] = filter) }),
  },
  organism: {
    dataField: 'organism',
    text: 'Organism',
    headerStyle: (colum, colIndex) => {
      return { width: '20%', textAlign: 'left' };
    },
    filter: textFilter({ getFilter: filter => (filters['organism'] = filter) }),
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
    //sort: true,
  },

  growth_phase: {
    dataField: 'growth_phase',
    text: 'Growth Phase',
    formatter: cell => selectOptions[cell],
    filter: selectFilter({
      getFilter: filter => (filters['growth_phase'] = filter),
      options: selectOptions,
    }),
  },

  growth_conditions: {
    dataField: 'growth_conditions',
    text: 'Conditions',
    filter: textFilter({
      getFilter: filter => (filters['growth_conditions'] = filter),
    }),
  },



  growth_media: {
    dataField: 'growth_media',
    text: 'Media',
    filter: textFilter({
      getFilter: filter => (filters['growth_media'] = filter),
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
      getFilter: filter => (filters['tanitomo'] = filter),
    }),
  },


  genetic_identifiers: {
    dataField: 'genetic_identifiers',
    text: 'Identifiers',
    filter: textFilter({
      getFilter: filter => (filters['genetic_identifiers'] = filter),
    }),
  },

  abundance: {
    dataField: 'abundance',
    text: 'Abundance (ppm)',
    headerStyle: (colum, colIndex) => {
      return { width: '9%', textAlign: 'left' };
    },
  },

  k_cat: {
    dataField: 'k_cat',
    text: 'Kcat (s^-1)',
    headerStyle: (colum, colIndex) => {
      return { width: '9%', textAlign: 'left' };
    },
  },

  organ: {
    dataField: 'organ',
    text: 'Organ',
    
    filter: textFilter({ getFilter: filter => (filters['organ'] = filter) }),
  },

  gene_symbol: {
    dataField: 'gene_symbol',
    text: 'Gene',
    headerStyle: (colum, colIndex) => {
      return { width: '9%', textAlign: 'left' };
    },
    filter: textFilter({ getFilter: filter => (filters['gene_symbol'] = filter) }),
  },

  protein_name: {
    dataField: 'protein_name',
    text: 'Protein',
    headerStyle: (colum, colIndex) => {
      return { width: '9%', textAlign: 'left' };
    },
    filter: textFilter({ getFilter: filter => (filters['protein_name'] = filter) }),
  },

  uniprot_id: {
    dataField: 'uniprot_id',
    text: 'Uniprot',
    headerStyle: (colum, colIndex) => {
      return { width: '9%', textAlign: 'left' };
    },
    filter: textFilter({ getFilter: filter => (filters['uniprot_id'] = filter) }),
  },




};

//let taxonFilter = null;
function resultsReducer(state = defaultState, action) {
  if (action === undefined) {
    return state;
  }

  switch (action.type) {
    case 'CREATE_COLUMNS': {
      let temp_taxon_filter = null;

      let final_columns = {};
      let final_column_list = [];
      let desired_columns = action.payload;

      for (var i = 0; i < desired_columns.length; i++) {
        console.log(desired_columns[i]);
        if ('filter' in total_columns[desired_columns[i]]) {
          total_columns[desired_columns[i]].filter['getFilter'] = filter =>
            (filters[desired_columns[i]] = filter);
        }
        final_columns[desired_columns[i]] = total_columns[desired_columns[i]];
        final_column_list.push(total_columns[desired_columns[i]]);
      }
      console.log(filters);

      return {
        ...state,
        columns: final_columns,
        column_list: final_column_list,
      };
    }

    case 'FILTER_TAXON': {
      taxonFilter({ number: action.payload, comparator: Comparator.LE });
      //let newSelectedData = getSelectedData();
      return {
        ...state,
      };
    }

    case 'FILTER_TANITOMO': {
      filters['tanitomo']({
      number: action.payload,
      comparator: Comparator.GE,
    });
      //let newSelectedData = getSelectedData();
      return {
        ...state,
      };
    }

    case 'HIDE_COLUMNS': {
      let list_col_names = action.payload;
      let to_display_columns = [];
      for (var i = 0; i < list_col_names.length; i++) {
        state.columns[list_col_names[i]].hidden = true;
        if (list_col_names[i] in filters) {
          filters[list_col_names[i]]('');
        }
      }

      return {
        ...state,
      };
    }

    case 'REVEAL_COLUMNS': {
      let list_col_names = action.payload;
      let to_display_columns = [];
      for (var i = 0; i < list_col_names.length; i++) {
        state.columns[list_col_names[i]].hidden = false;
      }

      return {
        ...state,
      };
    }

    case 'SET_LINEAGE': {
      return {
        ...state,

        taxon_lineage: action.payload,
      };
    }

    case 'SET_TOTAL_DATA': {
      return {
        ...state,

        totalData: action.payload,
      };
    }

    case 'REFRESH_SELECTED_DATA': {
      let newSelectedData = getSelectedData();
      return {
        ...state,

        selectedData: newSelectedData,
      };
    }

    default: {
      return state;
    }
  }
}
export {resultsReducer, total_columns} ;
