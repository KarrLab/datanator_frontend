const defaultState = {
  allData: null
};

function resultsReducer(state = defaultState, action) {
  if (action === undefined) {
    return state;
  }

  switch (action.type) {
    case "SET_ALL_DATA": {
      return {
        ...state,

        allData: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export default resultsReducer;
