export const defaultState = {
	url: "",
	moleculeAbstract: false,
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

    case 'ABSTRACT_MOLECULE': {

      return {
        ...state,
        moleculeAbstract: action.payload,
      };
    }


    default: {
      return state;
    }
  }
}
export default pageReducer;
