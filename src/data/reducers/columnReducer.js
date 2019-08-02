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

  columns: {},
  column_list: [],
  taxon_lineage: null,
};

let taxonFilter;

let filters = {};

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
    filter: textFilter({ getFilter: filter => (filters['molecule'] = filter) }),
  },
  organism: {
    dataField: 'organism',
    text: 'Organism',
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
    sort: true,
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
        permanent_taxon_filter: taxonFilter,
      };
    }

    case 'FILTER_TAXON': {
      taxonFilter({ number: action.payload, comparator: Comparator.LE });
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

    default: {
      return state;
    }
  }
}
export default columnReducer;
