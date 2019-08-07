

const defaultState = {
	url: ""
};


//let taxonFilter = null;
function pageReducer(state = defaultState, action) {
  if (action === undefined) {
    return state;
  }

  switch (action.type) {
    case 'NEW_REDIRECT': {

      return {
        ...state,
        url: action.payload,
      };
    }


    default: {
      return state;
    }
  }
}
export default pageReducer;
