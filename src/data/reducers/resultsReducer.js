const defaultState = {
  taxonLineage: null,
  totalData: null,
  selectedData: null
};

function resultsReducer(state = defaultState, action) {
  if (action === undefined) {
    return state;
  }

  switch (action.type) {
    case "SET_LINEAGE": {
      return {
        ...state,

        taxonLineage: action.payload
      };
    }

    case "SET_TOTAL_DATA": {
      return {
        ...state,

        totalData: action.payload
      };
    }
    case "SET_SELECTED_DATA": {
      return {
        ...state,

        selectedData: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export default resultsReducer;
