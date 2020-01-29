const defaultState = {
  taxonLineage: null,
  allData: null,
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

    case "SET_ALL_DATA": {
      return {
        ...state,

        allData: action.payload
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
